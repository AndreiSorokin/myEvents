import { EventModel } from "../models/event";
import { IEvent } from "../interfaces/IEvent";
import {
  NotFoundError,
  InternalServerError,
  BadRequestError,
} from "../errors/ApiError";
import { UserModel } from "../models/user";

// Create a new event
export const createEvent = async (
  eventData: Partial<IEvent>
): Promise<IEvent> => {
  const {
    name,
    description,
    location,
    organizer,
    date,
    price,
    event_link,
    event_type,
    attendees,
    images
  } = eventData;

  console.log(eventData)

  // Check if the organizer exists
  const isOrganizerExists = await UserModel.findById(organizer);
  if(!isOrganizerExists) {
    throw new BadRequestError("Organizer not found");
  }
  // Check if an event with the same name already exists
  const existingEvent = await EventModel.findOne({ name });
  if (existingEvent) {
    throw new BadRequestError("An event with this name already exists.");
  }

  //Check if all required fields are provided
  if(!name || !description || !location || !organizer || !date || !price ||!event_type) {
    throw new BadRequestError("Ensure you have added all necessary information")
  }

  try {
    // Create the new event
    const newEvent = new EventModel({
      name,
      description,
      location,
      organizer,
      date,
      price,
      event_link,
      event_type,
      attendees,
      images
    });

    // Save the new event to the database
    return await newEvent.save();
  } catch (error) {
    throw new InternalServerError("Error creating event");
  }
};

// Find event by ID
export const findEventById = async (id: string): Promise<IEvent> => {
  try {
    const event = await EventModel.findById(id).populate("organizer attendees");
    if (!event) {
      throw new NotFoundError("Event not found");
    }
    return event;
  } catch (error) {
    throw new InternalServerError("Error fetching event by ID");
  }
};

// Fetch all events (with optional pagination)
export const fetchAllEvents = async (
  page: number,
  limit: number
): Promise<{ events: IEvent[]; total: number }> => {
  try {
    const skip = (page - 1) * limit;
    const events = await EventModel.find()
      .skip(skip)
      .limit(limit)
      .populate("organizer attendees");
    const total = await EventModel.countDocuments();
    return { events, total };
  } catch (error) {
    throw new InternalServerError("Error fetching events");
  }
};

// Update an event by ID
export const updateEvent = async (
  id: string,
  updatedData: Partial<IEvent>
): Promise<IEvent> => {
  try {
    const updatedEvent = await EventModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!updatedEvent) {
      throw new NotFoundError("Event not found");
    }
    return updatedEvent;
  } catch (error) {
    throw new InternalServerError("Error updating event");
  }
};

// Delete an event by ID
export const deleteEvent = async (id: string): Promise<void> => {
  try {
    const event = await EventModel.findByIdAndDelete(id);
    if (!event) {
      throw new NotFoundError("Event not found");
    }
  } catch (error) {
    throw new InternalServerError("Error deleting event");
  }
};

export default {
  createEvent,
  findEventById,
  fetchAllEvents,
  updateEvent,
  deleteEvent,
};
