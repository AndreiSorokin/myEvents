import { Document } from "mongoose";

export interface IAddress extends Document {
  country: string;
  city: string;
  post_code: string;
  district: string;
  ward: string;
  street: string;
  address_number: string;
}
