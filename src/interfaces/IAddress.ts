import { Document } from "mongoose";

export interface IAddress extends Document {
  country: string;
  city: string;
  district: string;
  ward: string;
  post_code: string;
  street: string;
  address_number: string;
}
