import { Schema, Document, model } from "mongoose";
import { AddressModel } from "./address";
import { ILocation } from "../interfaces/ILocation";

const LocationSchema = new Schema<ILocation>({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  address: {
    type: AddressModel.schema,
    required: true,
  },
});

export const LocationModel = model<ILocation>("Location", LocationSchema);
