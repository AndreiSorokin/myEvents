import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { MongoClient } from "mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import mongoose from "mongoose";
import { z } from "zod";
import { createEventSummary } from "../langchain/summarizeService";
import { EventType } from "../enums/EventType";
import "dotenv/config";
import { connectMongoose, MONGO_DB_URL } from "./connectMongoose";

const client = new MongoClient(MONGO_DB_URL);

// Define LLM configuration
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-pro-latest",
  apiKey: process.env.GOOGLE_API_KEY as string,
  temperature: 0.5,
});

// Location IDs (Collect after implement command `npm run seedLocation`)
const locationIds = [
  "670be26b9803890eedec5bcb",
  "670be26b9803890eedec5bce",
  "670be26c9803890eedec5bd0",
  "670be26d9803890eedec5bd2",
  "670be26d9803890eedec5bd4",
  "670be26e9803890eedec5bd6",
  "670be26e9803890eedec5bd8",
];

// Organizer IDs (Collect after implement command `npm run seedUser`)
const organizerIds = [
  "670be2709803890eedec5bdb",
  "670be2709803890eedec5bdd",
  "670be2709803890eedec5bdf",
];

// Define the schema for event data (Using zod to easier prompting and parsing)
const EventSchema = z.object({
  name: z.string(),
  description: z.string(),
  location: z.string(), // locationId
  organizer: z.string(), // userId (Who has organizer role)
  date: z.string(), // Date as string for simplicity
  price: z.number(),
  event_link: z.string().optional(),
  event_type: z.enum(Object.values(EventType) as [string, ...string[]]),
  images: z.array(z.string()),
  attendees: z.array(z.string()),
});

export type Event = z.infer<typeof EventSchema>;

const parser = StructuredOutputParser.fromZodSchema(z.array(EventSchema));

// TODO: Generate synthetic event data
async function generateSyntheticEvents(
  locationId: string,
  organizerId: string
): Promise<Event[]> {
  const prompt = `You are a helpful assistant that generates event data. Generate 10 fictional event records with realistic values. Each record should include the following fields: name, description, location, organizer, date, price, event_link, event_type, images and attendees. Ensure variety in the data. 
  For the location and organizer fields, use the provided location and organizer IDs respectively, without generating any extra fields. Use these IDs exactly as provided: location = ${locationId}, organizer = ${organizerId}, images and attendees fields should be in empty array. 
  Do not generate any additional fields like locationId or organizerId. ${parser.getFormatInstructions()}`;
  console.log("Generating synthetic events...");
  const response = await llm.invoke(prompt);
  return parser.parse(response.content as string); // Parse the response content
}

// TODO: Main Function to seed the database
async function seedEventDatabase(): Promise<void> {
  try {
    await connectMongoose();

    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB Atlas!"
    );
    const db = client.db("myEvents");
    const collection = db.collection("events");

    await collection.deleteMany({});

    const locationId =
      locationIds[Math.floor(Math.random() * locationIds.length)];
    const organizerId =
      organizerIds[Math.floor(Math.random() * organizerIds.length)];

    const syntheticEvents = await generateSyntheticEvents(
      locationId,
      organizerId
    ); // Generate synthetic event data

    const recordsWithSummaries = await Promise.all(
      syntheticEvents.map(async (record) => {
        // Create a summary using specific location and organizer
        const summary = await createEventSummary(
          record,
          locationId,
          organizerId
        );

        return {
          pageContent: summary,
          metadata: {
            ...record,
            location: new mongoose.Types.ObjectId(locationId),
            organizer: new mongoose.Types.ObjectId(organizerId),
          },
        };
      })
    );

    for (const record of recordsWithSummaries) {
      await MongoDBAtlasVectorSearch.fromDocuments(
        // To insert each of these documents
        [record],
        new GoogleGenerativeAIEmbeddings(), // Create vector embedding for the summary of record
        {
          collection, // Pass as a collection where to store the embeddings
          indexName: "vector_index",
          textKey: "summary", // Field that contains the summary text
          embeddingKey: "summary_embedding", // Where to store the vector embeddings
        }
      );

      console.log(
        "Successfully processed & saved record:",
        record.metadata.name,
        "with locationId:",
        record.metadata.location,
        "and organizerId:",
        record.metadata.organizer
      );
    }
    console.log("Database seeding completed");
  } catch (err) {
    console.error("Error seeding the database", err);
    process.exit(1);
  } finally {
    await client.close();
    await mongoose.connection.close();
  }
}

seedEventDatabase().catch(console.error);
