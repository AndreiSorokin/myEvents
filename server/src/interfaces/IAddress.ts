import { Document } from "mongoose";

export interface IAddress extends Document {
  country: string;
  city: string;
  district: string;
  post_code: string;
}
