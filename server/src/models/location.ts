import { Schema, model } from "mongoose";
import { ILocation } from "../interfaces/ILocation";
import { AddressModel } from "./address";
import { fetchCoordinates } from "../utils/geocoding";
import { BadRequestError, InternalServerError } from "../errors/ApiError";

const LocationSchema = new Schema<ILocation>({
  latitude: {
    type: Number,
  },
  longitude: {
    type: Number,
  },
  address: {
    type: Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },
});

// TODO: Pre-save hook for generating latitude and longitude when creating or updating a location
LocationSchema.pre("save", async function (next) {
  const location = this as ILocation;

  if (!location.address) {
    throw new BadRequestError("Address is required to generate coordinates.");
  }

  // TODO: Fetch the address from the database
  const address = await AddressModel.findById(location.address);
  if (!address) {
    throw new BadRequestError("The specified address does not exist.");
  }

  try {
    // TODO: Generate lattitude and longtitude from OpenCage API
    const { latitude, longitude } = await fetchCoordinates(address);

    // TODO: Set the location's lattitude and longtitude
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

  if (update.address) {
    const address = await AddressModel.findById(update.address);
    if (!address) {
      throw new BadRequestError("The specified address does not exist");
    }

    try {
      const { latitude, longitude } = await fetchCoordinates(address);
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
