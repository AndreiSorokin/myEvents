import { Schema, model } from "mongoose";
import { IEvent } from "../interfaces/IEvent";
import { EventType } from "../enums/EventType";
import { LocationModel } from "./location";

const eventSchema = new Schema<IEvent>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  location: { type: LocationModel.schema, required: true },
  organizer: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the User (organizer)
  date: { type: Date, required: true },
  price: { type: Number, required: true },
  event_link: { type: String },
  event_type: {
    type: String,
    enum: Object.values(EventType),
    required: true,
  },
  attendees: [{ type: Schema.Types.ObjectId, ref: "User" }], // Array of User IDs (many-to-many)
});

// JSON serialization for eventSchema
eventSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const EventModel = model<IEvent>("Event", eventSchema);
