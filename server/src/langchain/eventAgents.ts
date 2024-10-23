import { ChatGroq } from "@langchain/groq";
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { Annotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import { MongoClient } from "mongodb";
import "dotenv/config";
import { eventLookupTool, internetSearchingTool } from "./tools";
import { SYSTEM_EVENT_TEMPLATE } from "./prompts";

function logStep(step: string, content: string) {
  console.log(`\n=== ${step.toUpperCase()} ===`);
  console.log(content.trim());
}

export async function callEventSearchAgent(
  client: MongoClient,
  query: string,
  thread_id: string
) {
  console.log("🤖 Starting agent with query: ", query);

  // TODO: Define the graph state (Agent State)
  const GraphState = Annotation.Root({
    messages: Annotation<BaseMessage[]>({
      reducer: (x, y) => x.concat(y),
    }),
    current_thought: Annotation<string>(),
    tool_results: Annotation<Record<string, any>>({
      reducer: (x, y) => ({ ...x, ...y }),
    }),
    reasoning_steps: Annotation<string[]>({
      reducer: (x, y) => [...x, ...y],
    }),
  });

  const tools = [eventLookupTool, internetSearchingTool];
  const toolNode = new ToolNode<typeof GraphState.State>(tools);

  // TODO: Define the function that determine whether to continue call a tool or stop and reply to the user
  function shouldContinue(state: typeof GraphState.State) {
    const messages = state.messages;
    const lastMessage = messages[messages.length - 1] as AIMessage;

    // If the LLM makes a tool call, then we route to the "tools" node
    if (lastMessage.tool_calls?.length) {
      console.log(`🔧 Using tool: ${lastMessage.tool_calls[0].name}`);
      return "tools";
    }

    console.log("✅ Providing final response");
    return "__end__";
  }

  const model = new ChatGroq({
    model: "llama-3.1-70b-versatile",
    apiKey: process.env.GROQ_API_KEY as string,
    temperature: 0.8,
  }).bindTools(tools);

  // TODO: Define the function that calls the model (Main entry point for the agent)
  async function callModel(state: typeof GraphState.State) {
    const prompt = ChatPromptTemplate.fromMessages([
      ["system", SYSTEM_EVENT_TEMPLATE],
      new MessagesPlaceholder("messages"),
    ]);

    const formattedPrompt = await prompt.formatMessages({
      time: new Date().toISOString(),
      tool_names: tools.map((tool) => tool.name).join(", "),
      messages: state.messages,
    });

    const result = await model.invoke(formattedPrompt);

    // Safe handling of result content
    if (!result || typeof result.content !== "string") {
      console.log("⚠️ Invalid response from model");
      return {
        messages: [
          new AIMessage({
            content:
              "I apologize, but I encountered an issue processing your request. Could you please try rephrasing your question?",
          }),
        ],
      };
    }

    // Track reasoning steps
    if (typeof result.content === "string") {
      // Extract reasoning steps and final response
      const parts = result.content.split("===");
      const reasoning = parts[0].trim();
      const finalResponse = parts[1]?.trim() || reasoning; // Fallback if separation fails

      // Extract and log reasoning steps
      const thoughtMatch = reasoning.match(/THOUGHT: (.*?)(?=ACTION:|$)/s);
      const actionMatch = reasoning.match(/ACTION: (.*?)(?=REFLECTION:|$)/s);
      const reflectionMatch = reasoning.match(
        /REFLECTION: (.*?)(?=(\n===|$))/s
      );

      if (thoughtMatch?.[1]) logStep("Thought", thoughtMatch[1]);
      if (actionMatch?.[1]) logStep("Action", actionMatch[1]);
      if (reflectionMatch?.[1]) logStep("Reflection", reflectionMatch[1]);

      // Store reasoning steps for state tracking
      state.reasoning_steps = [
        thoughtMatch?.[1] || "",
        actionMatch?.[1] || "",
        reflectionMatch?.[1] || "",
      ].filter(Boolean);

      // Return only the final response
      return {
        messages: [
          new AIMessage({
            content: finalResponse,
            tool_calls: result.tool_calls,
          }),
        ],
      };
    }

    return { messages: [result] };
  }

  // TODO: Define a new graph - Conversation Workflow
  const workflow = new StateGraph(GraphState)
    .addNode("agent", callModel)
    .addNode("tools", toolNode)
    .addEdge("__start__", "agent")
    .addConditionalEdges("agent", shouldContinue)
    .addEdge("tools", "agent");

  const app = workflow.compile({
    checkpointer: new MongoDBSaver({ client, dbName: "myEvents" }),
  });

  // Use the Runnable - Run the agent
  const finalState = await app.invoke(
    {
      messages: [new HumanMessage(query)],
    },
    { recursionLimit: 15, configurable: { thread_id: thread_id } }
  );

  return finalState.messages[finalState.messages.length - 1].content;
}
