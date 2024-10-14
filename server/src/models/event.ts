import { Schema, model } from "mongoose";
import { IEvent } from "../interfaces/IEvent";
import { EventType } from "../enums/EventType";
import { LocationModel } from "./location";

const eventSchema = new Schema<IEvent>({
  name: {
    type: String,
    required: [true, "Event name is required"],
    unique: true,
    minlength: [3, "Event name must be at least 3 characters long"],
    maxlength: [100, "Event name cannot exceed 100 characters"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Event description is required"],
    minlength: [10, "Description must be at least 10 characters long"],
    maxlength: [1000, "Description cannot exceed 1000 characters"],
  },
  location: {
    type: LocationModel.schema,
    required: [true, "Location is required"],
  },
  organizer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Organizer is required"],
  },
  date: {
    type: Date,
    required: [true, "Date is required"],
    validate: {
      validator: function (value: Date) {
        // Ensure the date is in the future
        return value >= new Date();
      },
      message: "Event date must be in the future",
    },
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
    validate: {
      validator: function (value: number) {
        // Ensure the price is a valid number
        return !isNaN(value);
      },
      message: "Price must be a valid number",
    },
  },
  event_link: {
    type: String,
    validate: {
      validator: function (value: string) {
        // Regular expression for URL validation
        return /^https?:\/\/[^\s$.?#].[^\s]*$/.test(value);
      },
      message: "Please enter a valid URL",
    },
  },
  event_type: {
    type: String,
    enum: {
      values: Object.values(EventType),
      message: "{VALUE} is not a valid event type",
    },
    required: [true, "Event type is required"],
  },
  attendees: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  images: {
    type: [String],
    validate: {
      validator: function (value: string[]) {
        // Validate that each item in the array is a URL
        return value.every((url) => /^https?:\/\/[^\s$.?#].[^\s]*$/.test(url));
      },
      message: "All images must be valid URLs",
    },
  },
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
