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
  temperature: 0.7,
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

// Helper function to get a random item from an array
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// TODO: Generate synthetic event data
async function generateSyntheticEvent(
  locationId: string,
  organizerId: string,
  retryCount: number = 0
): Promise<Event> {
  const prompt = `You are a helpful assistant that generates event data. Generate 1 random event record. The record should include the following fields: name, description, location, organizer, date, price, event_link, event_type, images and attendees. Ensure variety in the data. 
  For the location and organizer fields, use the provided location and organizer IDs respectively, without generating any extra fields. Use these IDs exactly as provided: location = ${locationId}, organizer = ${organizerId}, images and attendees fields should be in empty array. And event type can be one of the values in the enum list: [conference, workshop, meetup, concert, webinar, networking, hackathon, exhibition, festival, seminar].
  Do not generate any additional fields like locationId or organizerId. ${parser.getFormatInstructions()}`;
  console.log(`Generating synthetic event... (Attempt ${retryCount + 1})`);
  const response = await llm.invoke(prompt);
  const events = await parser.parse(response.content as string);
  let event = events[0];

  // Add a counter to the name if it's a retry
  if (retryCount > 0) {
    event.name = `${event.name} (${retryCount})`;
  }

  return event;
}

async function insertEventWithRetry(
  collection: any,
  event: Event,
  embeddings: GoogleGenerativeAIEmbeddings,
  maxRetries: number = 10
): Promise<void> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const summary = await createEventSummary(
        event,
        event.location,
        event.organizer
      );

      const record = {
        pageContent: summary,
        metadata: {
          ...event,
          location: new mongoose.Types.ObjectId(event.location),
          organizer: new mongoose.Types.ObjectId(event.organizer),
        },
      };

      await MongoDBAtlasVectorSearch.fromDocuments([record], embeddings, {
        collection,
        indexName: "vector_index",
        textKey: "summary",
        embeddingKey: "summary_embedding",
      });

      console.log(
        "Successfully processed & saved record:",
        event.name,
        "with locationId:",
        event.location,
        "and organizerId:",
        event.organizer
      );
      return;
    } catch (error: any) {
      if (error.code === 11000 && i < maxRetries - 1) {
        console.log(
          `Duplicate key error for event: ${event.name}. Retrying...`
        );
        event = await generateSyntheticEvent(
          event.location,
          event.organizer,
          i + 1
        );
      } else {
        throw error;
      }
    }
  }
  throw new Error(`Failed to insert event after ${maxRetries} attempts`);
}

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

    const embeddings = new GoogleGenerativeAIEmbeddings();

    for (let i = 0; i < 10; i++) {
      const locationId = getRandomItem(locationIds);
      const organizerId = getRandomItem(organizerIds);
      const event = await generateSyntheticEvent(locationId, organizerId);
      await insertEventWithRetry(collection, event, embeddings);
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
