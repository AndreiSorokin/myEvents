import { Document } from "mongoose";

export interface ILocation extends Document {
  latitude: number;
  longitude: number;
  country: string;
  city: string;
  post_code: string;
  district: string;
  ward: string;
  street: string;
  address_number: string;
}
