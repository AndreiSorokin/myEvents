import { Schema, Document, model } from "mongoose";
import { AddressModel } from "./address";
import { ILocation } from "../interfaces/ILocation";

const LocationSchema = new Schema<ILocation>({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  address: {
    country: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String },
    post_code: { type: String, required: true },
  },
});

LocationSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const LocationModel = model<ILocation>("Location", LocationSchema);
