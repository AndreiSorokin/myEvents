import { Schema, Document, model } from "mongoose";
import { IAddress } from "../interfaces/IAddress";

const AddressSchema = new Schema<IAddress>({
  country: { type: String, required: true },
  city: { type: String, required: true },
  district: { type: String },
  post_code: { type: String, required: true },
});

AddressSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const AddressModel = model<IAddress>("Address", AddressSchema);
