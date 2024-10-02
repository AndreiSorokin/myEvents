import { Document } from "mongoose";
import { IUser } from "./IUser";
import { ILocation } from "./ILocation";
import { EventType } from "../enums/EventType";

// Event Interface
export interface IEvent extends Document {
  name: string;
  description: string;
  location: ILocation;
  organizer: IUser["_id"]; // Reference to the User ID (organizer)
  date: Date;
  price: number;
  event_link: string;
  event_type: EventType;
  attendees: IUser["_id"][]; // Array of user IDs (many-to-many relationship)
  images: string[]; // Array of image URLs
}
