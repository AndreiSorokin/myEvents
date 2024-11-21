import { Schema, model } from "mongoose";
import { ILocation } from "../interfaces/ILocation";
import { fetchCoordinates } from "../utils/geocoding";
import { InternalServerError } from "../errors/ApiError";
import {
  validateCity,
  validateCountry,
  validateDistrict,
  validatePostcode,
  validateWard,
} from "../utils/locationValidation";

export const LocationSchema = new Schema<ILocation>({
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
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
        return await validateDistrict(this.country, this.city, value);
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
        `${props.value} is not a valid ward for the given country, city, postcode and district.`,
    },
  },
  street: { type: String },
  address_number: { type: String },
});

// TODO: Pre-save hook for generating latitude and longitude when creating or updating a location
LocationSchema.pre("save", async function (next) {
  const location = this as Partial<ILocation>;

  // Generate coordinates based on the address information
  try {
    const { latitude, longitude } = await fetchCoordinates(location);
    location.latitude = latitude;
    location.longitude = longitude;
    next();
  } catch (error: any) {
    next(
      new InternalServerError("Failed to fetch coordinates: " + error.message)
    );
  }
});

// TODO: Pre-update hook for updating lattitude and longtitude if address is updated
LocationSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as Partial<ILocation>;
  if (
    update.country ||
    update.city ||
    update.post_code ||
    update.district ||
    update.ward ||
    update.street ||
    update.address_number
  ) {
    try {
      const { latitude, longitude } = await fetchCoordinates(update);
      update.latitude = latitude;
      update.longitude = longitude;
    } catch (error: any) {
      next(
        new InternalServerError("Failed to fetch coordinates: " + error.message)
      );
    }
  }
  next();
});

LocationSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export const LocationModel = model<ILocation>("Location", LocationSchema);
