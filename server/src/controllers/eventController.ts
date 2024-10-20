import { Request, Response, NextFunction } from "express";
import eventService from "../services/eventService";
import { uploadImageToCloudinary } from "../services/imageUpload";
import { MongoClient } from "mongodb";
import { callAgent } from "../langchain/agent";
import { FilterQuery } from "mongoose";
import { IEvent } from "../interfaces/IEvent";

const client = new MongoClient(process.env.MONGO_DB_URL as string);

// Create a new event
export const createEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let imageUrls = [];
    if (req.files) {
      const files = req.files as Express.Multer.File[];
      for (const file of files) {
        const imageUrl = await uploadImageToCloudinary(
          file.buffer,
          file.originalname
        );
        imageUrls.push(imageUrl);
      }
    } else {
      imageUrls = req.body.images || [];
    }
    const newEvent = await eventService.createEvent(req.body);
    res.status(201).json(newEvent);
  } catch (error) {
    next(error);
  }
};

// Get events with AI (Start thread)
export const getEventsWithAI = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const initialMessage = req.body.message;
  const threadId = Date.now().toString();
  try {
    const response = await callAgent(client, initialMessage, threadId);
    res.json({ threadId, response });
  } catch (error) {
    console.error("Error starting conversation:", error);
    next(error);
  }
};

// Continue thread with AI
export const continueThread = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { threadId } = req.params;
  const { message } = req.body;
  try {
    const response = await callAgent(client, message, threadId);
    res.json({ response });
  } catch (error) {
    console.error("Error in chat:", error);
    next(error);
  }
};

// Get event by ID
export const getEventById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const event = await eventService.findEventById(req.params.id);
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

// Fetch all events (with optional pagination)
export const getAllEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const searchQuery = req.query.search as string || "";

  try {
    const { events, total } = await eventService.fetchAllEvents(page, limit, searchQuery);
    res.status(200).json({ events, total, page, limit });
  } catch (error) {
    next(error);
  }
};

// Update event by ID
export const updateEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updatedEvent = await eventService.updateEvent(
      req.params.id,
      req.body
    );
    res.status(200).json(updatedEvent);
  } catch (error) {
    next(error);
  }
};

// Delete an event by ID
export const deleteEvent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await eventService.deleteEvent(req.params.id);
    res.status(200).json({ message: "Event successfully deleted." });
  } catch (error) {
    next(error);
  }
};

export default {
  createEvent,
  getEventById,
  getAllEvents,
  updateEvent,
  deleteEvent,
  getEventsWithAI,
  continueThread,
};
