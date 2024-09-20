import mongoose from "mongoose";
import { IAddress } from "../../interfaces/IAddress";

export const addressId = new mongoose.Types.ObjectId().toString();

export const addressData = {
  country: "Finland",
  city: "Helsinki",
  district: "Kallio",
  ward: "Hietalahti",
  post_code: "00530",
  street: "Tapiolankatu",
  address_number: "1",
} as IAddress;

export const fakeId = "invalid-id";
