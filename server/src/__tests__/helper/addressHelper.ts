import mongoose from "mongoose";
import { IAddress } from "../../interfaces/IAddress";

export const addressId = "66f810ce766adcd06ab40c12";

export const addressData = {
  _id: addressId,
  country: "Finland",
  city: "Vaasa",
  district: "Palosaari",
  post_code: "65200",
  street: "Tapiolankatu",
  address_number: "1",
} as IAddress;

export const fakeId = "invalid-id";
