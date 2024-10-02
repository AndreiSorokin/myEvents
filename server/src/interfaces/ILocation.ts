import { IAddress } from "./IAddress";
import { Document } from "mongoose";

export interface ILocation extends Document {
  latitude: number;
  longitude: number;
  address: IAddress["_id"];
}