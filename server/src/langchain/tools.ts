import { DuckDuckGoSearch } from "@langchain/community/tools/duckduckgo_search";
import { tool } from "@langchain/core/tools";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { z } from "zod";
import { MongoClient } from "mongodb";

// Initialize MongoDB client
const client = new MongoClient(process.env.MONGO_DB_URL as string);
client.connect();

// TODO: Define a tool for searching the information via DuckDuckGo
export const internetSearchingTool = tool(
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
export const eventLookupTool = tool(
  async ({ query, n }: { query: string; n?: number }) => {
    console.log("🔍 Database search for: ", query);

    try {
      const dbConfig = {
        collection: client.db("myEvents").collection("events"),
        indexName: "vector_index",
        textKey: "summary",
        embeddingKey: "summary_embedding",
      };

      const vectorstore = new MongoDBAtlasVectorSearch(
        new GoogleGenerativeAIEmbeddings(),
        dbConfig
      );

      const results = await vectorstore.similaritySearchWithScore(query, n);

      if (results.length === 0) {
        console.log(
          "❌ No results found in database. Suggesting internet search..."
        );
        return JSON.stringify({
          status: "no_results",
          message:
            "No matching events found in database. Switching to internet search.",
          shouldUseInternetSearch: true,
        });
      }

      console.log(`✅ Found ${results.length} results in database`);
      const processedResults = results.map(([doc, score]) => ({
        ...doc,
        similarity_score: score,
        formatted_date: new Date().toLocaleDateString(),
        source: "database",
      }));

      return JSON.stringify({
        status: "success",
        results: processedResults,
        count: processedResults.length,
        shouldUseInternetSearch: false,
      });
    } catch (error) {
      console.error("❌ Error in event lookup:", error);
      return JSON.stringify({
        status: "error",
        message: "An error occurred while searching for events.",
        error: error instanceof Error ? error.message : "Unknown error",
        shouldUseInternetSearch: true,
      });
    }
  },
  {
    name: "event_lookup",
    description:
      "Searches for events in the database matching user criteria. If no results found, suggests using internet search.",
    schema: z.object({
      query: z.string().describe("The search query for finding events"),
      n: z.number().optional().describe("The number of results to return"),
    }),
  }
);
