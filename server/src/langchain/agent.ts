import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { StateGraph } from "@langchain/langgraph";
import { Annotation } from "@langchain/langgraph";
import { tool } from "@langchain/core/tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { MongoClient } from "mongodb";
import "dotenv/config";
import { z } from "zod";

export async function callAgent(
  client: MongoClient,
  query: string,
  thread_id: string
) {
  // TODO: Define the MongoDB database and collection
  const dbName = "myEvents";
  const db = client.db(dbName);
  const collection = db.collection("events");

  // TODO: Define the graph state (Agent State)
  const GraphState = Annotation.Root({
    messages: Annotation<BaseMessage[]>({
      reducer: (x, y) => x.concat(y),
    }),
  });

  // TODO: Define the tool for the agent to use
  // Purpose: To find the relevant event information based on the query -> Return a list of events with their details
  const eventLookupTool = tool(
    async ({ query, n = 10 }: { query: string; n?: number }) => {
      console.log("Event lookup tool called");

      const dbConfig = {
        collection: collection,
        indexName: "vector_index",
        summary: "embedding_text",
        embeddingKey: "summary_embedding",
      };

      // Initialize vector store
      const vectorstore = new MongoDBAtlasVectorSearch(
        new GoogleGenerativeAIEmbeddings(), // Create Embedding for user query
        dbConfig
      );

      const result = await vectorstore.similaritySearchWithScore(query, n);
      return JSON.stringify(result);
    },
    {
      name: "event_lookup",
      description: "Gathers event details from the myEvents database",
      schema: z.object({
        query: z.string().describe("The search query"),
        n: z
          .number()
          .optional()
          .default(10)
          .describe("The number of results to return"),
      }),
    }
  );

  const tools = [eventLookupTool]; // Can add more tools as needed

  // We can exact the state typing via `GrapthState.State`
  const toolNode = new ToolNode<typeof GraphState.State>(tools);

  const model = new ChatGroq({
    model: "llama-3.1-70b-versatile",
    apiKey: process.env.GROQ_API_KEY as string,
    temperature: 0.5,
  }).bindTools(tools);

  // TODO: Define the function that determine whether to continue call a tool or stop and reply to the user
  function shouldContinue(state: typeof GraphState.State) {
    const messages = state.messages;
    const lastMessage = messages[messages.length - 1] as AIMessage;

    // If the LLM makes a tool call, then we route to the "tools" node
    if (lastMessage.tool_calls?.length) {
      return "tools";
    }

    // Otherwise, we stop (reply to the user)
    return "__end__";
  }

  // TODO: Define the function that calls the model (Main entry point for the agent)
  async function callModel(state: typeof GraphState.State) {
    const prompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        `You are a helpful AI specializing in event recommendations, collaborating with other assistants. Use the provided tools to progress towards answering the question. If you are unable to fully answer, that's OK, another assistant with different tools will help where you left off. Execute what you can to make progress. If you or any of the other assistants have the final answer or deliverable, prefix your response with FINAL ANSWER so the team knows to stop. You have access to the following tools: {tool_names}.\n{system_message}\nCurrent time: {time}.
        
        When recommending events:
        1. Consider the user's preferences and budget.
        2. Provide brief details about each event (name, date, price, type).
        3. If applicable, suggest why an event might be suitable for the user.
        `,
      ],
      new MessagesPlaceholder("messages"),
    ]);

    const formattedPrompt = await prompt.formatMessages({
      system_message: "You are helpful Event Guide Chatbot Agent.",
      time: new Date().toISOString(),
      tool_names: tools.map((tool) => tool.name).join(", "),
      messages: state.messages,
    });

    const result = await model.invoke(formattedPrompt);

    return { messages: [result] };
  }

  // TODO: Define a new graph - Conversation Workflow
  const workflow = new StateGraph(GraphState)
    .addNode("agent", callModel) // Add the agent node include the callModel function
    .addNode("tools", toolNode) // Add the tools node with the toolNode defined above
    .addEdge("__start__", "agent") // Add the start edge to the agent node
    .addConditionalEdges("agent", shouldContinue) // Add conditional edges to determine whether to continue or stop
    .addEdge("tools", "agent"); // Set up a simple back and forth between the agent and its tools

  // Initialize the MongoDB memory to persist data between graph runs -> Add memory to the agent
  const checkpointer = new MongoDBSaver({ client, dbName }); // Save the state of conversation to MongoDB

  // This complies it into a LangChain Runnable.
  // Note that we're passing the memory when compiling the graph
  const app = workflow.compile({ checkpointer });

  // Use the Runnable - Run the agent
  const finalState = await app.invoke(
    {
      messages: [new HumanMessage(query)],
    },
    { recursionLimit: 15, configurable: { thread_id: thread_id } }
  );

  console.log(finalState.messages[finalState.messages.length - 1].content);

  return finalState.messages[finalState.messages.length - 1].content;
}
