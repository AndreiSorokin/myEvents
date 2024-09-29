import { Schema, model } from "mongoose";
import { IAddress } from "../interfaces/IAddress";
import {
  validateCity,
  validateCountry,
  validateDistrict,
  validatePostcode,
  validateWard,
} from "../utils/addressValidation";

const AddressSchema = new Schema<IAddress>({
  country: {
    type: String,
    required: [true, "Country name is required"],
    validate: {
      validator: async function (value: string) {
        return await validateCountry(value);
      },
      message: (props) => `${props.value} is not a valid country`,
    },
  },
  city: {
    type: String,
    required: [true, "City name is required"],
    validate: {
      validator: async function (value: string) {
        return await validateCity(this.country, value);
      },
      message: (props) =>
        `${props.value} is not a valid city for the given country.`,
    },
  },
  post_code: {
    type: String,
    validate: {
      validator: async function (value: string) {
        return await validatePostcode(this.country, this.city, value);
      },
      message: (props) =>
        `${props.value} is not a valid postcode for the given country and city.`,
    },
  },
  district: {
    type: String,
    validate: {
      validator: async function (value: string) {
        return await validateDistrict(
          this.country,
          this.city,
          value
        );
      },
      message: (props) =>
        `${props.value} is not a valid district for the given country, city and postcode.`,
    },
  },
  ward: {
    type: String,
    validate: {
      validator: async function (value: string) {
        return await validateWard(
          this.country,
          this.city,
          this.district,
          value
        );
      },
      message: (props) =>
        `${props.value} is not a valid ward for the given country,city, postcode and district.`,
    },
  },
  street: { type: String },
  address_number: { type: String },
});

AddressSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const AddressModel = model<IAddress>("Address", AddressSchema);
