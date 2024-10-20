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
import { DuckDuckGoSearch } from "@langchain/community/tools/duckduckgo_search";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { MongoClient } from "mongodb";
import "dotenv/config";
import { z } from "zod";

// Helper function to format event information
function formatEvent(event: any): string {
  return `
- Name: ${event.name}
  Date: ${event.date}
  Price: ${event.price} EUR
  Location: ${event.location}
  Type: ${event.event_type}
  URL: ${event.event_link || "N/A"}
  `;
}

export async function callAgent(
  client: MongoClient,
  query: string,
  thread_id: string
) {
  console.log("Starting agent with query:", query);

  // TODO: Define the MongoDB database and collection
  const dbName = "myEvents";
  const db = client.db(dbName);
  const collection = db.collection("events");

  // TODO: Define the graph state (Agent State)
  const GraphState = Annotation.Root({
    messages: Annotation<BaseMessage[]>({
      reducer: (x, y) => x.concat(y),
    }),
    current_thought: Annotation<string>(),
    tool_results: Annotation<Record<string, any>>({
      reducer: (x, y) => ({ ...x, ...y }),
    }),
  });

  // TODO: Define a tool for searching the information via DuckDuckGo
  const internetSearchingTool = tool(
    async ({ query }: { query: string }) => {
      console.log("Executing internet search for: ", query);
      const searchTool = new DuckDuckGoSearch();
      const results = await searchTool.invoke(query); // Perform the search
      return JSON.stringify(results); // Return results as JSON
    },
    {
      name: "internet_search",
      description:
        "Performs a web search using DuckDuckGo to retrieve relevant event's information from the internet.",
      schema: z.object({
        query: z.string().describe("The search query for the internet search."),
      }),
    }
  );

  // TODO: Define the tool for looking up information in the database
  const eventLookupTool = tool(
    async ({ query, n = 10 }: { query: string; n?: number }) => {
      console.log("Event lookup tool called for query: ", query);

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

  const tools = [eventLookupTool, internetSearchingTool]; // Can add more tools as needed

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

    // Log the LLM's reasoning process (thoughts)
    console.log("LLM's current thought:", state.current_thought);

    // If the LLM makes a tool call, then we route to the "tools" node
    if (lastMessage.tool_calls?.length) {
      console.log("LLM decided to call a tool.");
      return "tools";
    }

    // Otherwise, we stop (reply to the user)
    console.log("LLM decided to provide a final answer.");
    return "__end__";
  }

  const systemMessage = `You are a helpful AI specializing in event recommendations, collaborating with other assistants. Use the provided tools to progress towards answering the question. If you are unable to fully answer, that's OK, another assistant with different tools will help where you left off. Execute what you can to make progress. If you or any of the other assistants have the final answer or deliverable, prefix your response with FINAL ANSWER so the team knows to stop. You have access to the following tools: {tool_names}.

  When recommending events:
  1. Consider the user's preferences and budget.
  2. Provide a brief introduction (1-2 sentences).
  3. List events in a structured format of:
     {event_details}
  4. Conclude with a short summary or additional advice (1-2 sentences).
  5. If the query is some kinda basic conversation like "hi, hello, how are you,...", be polite with a response to greeting back also introduce yourself and ask how can you help the users.

  Current time: {time}.`;

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", systemMessage],
    new MessagesPlaceholder("messages"),
  ]);

  // TODO: Define the function that calls the model (Main entry point for the agent)
  async function callModel(state: typeof GraphState.State) {
    const formattedPrompt = await prompt.formatMessages({
      system_message: "You are helpful Event Guide Chatbot Agent named Ebot.",
      time: new Date().toISOString(),
      tool_names: tools.map((tool) => tool.name).join(", "),
      messages: state.messages,
      event_details: "The short details of the event based on event's summary",
    });

    console.log("Calling model with prompt:", formattedPrompt);
    const result = await model.invoke(formattedPrompt);
    console.log("Model response:", result);
    state.current_thought =
      typeof result.content === "string"
        ? result.content
        : JSON.stringify(result.content);

    // Format the response
    if (
      typeof result.content === "string" &&
      result.content.includes("FINAL ANSWER")
    ) {
      const formattedContent = result.content.replace(
        /\[EVENT_LIST\]([\s\S]*?)\[\/EVENT_LIST\]/g,
        (match, p1) => {
          const events = JSON.parse(p1);
          return events.map(formatEvent).join("\n");
        }
      );
      result.content = formattedContent;
    }

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

  console.log(
    "FINAL STATE MESSAGE:",
    finalState.messages[finalState.messages.length - 1].content
  );

  return finalState.messages[finalState.messages.length - 1].content;
}
