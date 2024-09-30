import {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} from "../errors/ApiError";
import { ILocation } from "../interfaces/ILocation";
import { AddressModel } from "../models/address";
import { LocationModel } from "../models/location";
import mongoose from "mongoose";

const createLocation = async (locationData: ILocation): Promise<ILocation> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(locationData.address as string)) {
      throw new BadRequestError("Invalid Address ID format.");
    }

    const addressExists = await AddressModel.findById(locationData.address);
    if (!addressExists) {
      throw new NotFoundError(
        `Address with id ${locationData.address} not found.`
      );
    }

    const newLocation = await LocationModel.create(locationData);
    return newLocation.populate("address");
  } catch (error: any) {
    throw new InternalServerError("Internal Server Error" + error.message);
  }
};

const getAllLocations = async (): Promise<ILocation[]> => {
  return await LocationModel.find().populate("address");
};

// TODO: Get Location by random address's information (i.e. country, city, postal code, district, etc)
const getLocationsByAddressInfo = async (
  address: string
): Promise<ILocation[]> => {
  if (!address) {
    throw new BadRequestError("Address information is required");
  }

  // Split the address into components using common delimiters (e.g., commas, spaces, hyphens)
  const addressParts = address.split(/[\s,_-]+/).map((part) => part.trim());

  // Construct the $and query to match all parts against different fields
  const searchConditions = addressParts.map((part) => ({
    $or: [
      { country: new RegExp(part, "i") },
      { city: new RegExp(part, "i") },
      { post_code: new RegExp(part, "i") },
      { district: new RegExp(part, "i") },
      { ward: new RegExp(part, "i") },
      { street: new RegExp(part, "i") },
      { address_number: new RegExp(part, "i") },
    ],
  }));

  // Search based on different address fields using the constructed regex
  const locations = await LocationModel.find({
    address: { $ne: null },
  }).populate({
    path: "address",
    match: {
      $and: searchConditions, // Ensure all address parts match one of the fields
    },
  });

  const filteredLocations = locations.filter(
    (location) => location.address !== null
  );

  return filteredLocations;
};

const getLocationById = async (id: string): Promise<ILocation> => {
  if (!id) {
    throw new BadRequestError("Location ID is required");
  }

  const foundLocation = await LocationModel.findById(id).populate("address");

  if (!foundLocation) {
    throw new NotFoundError(`Location with id ${id} cannot be found`);
  }

  return foundLocation;
};

const updateLocation = async (
  id: string,
  locationData: Partial<ILocation>
): Promise<ILocation | null> => {
  if (!id) {
    throw new BadRequestError("Location ID is required");
  }

  if (
    locationData.address &&
    !mongoose.Types.ObjectId.isValid(locationData.address as string)
  ) {
    throw new BadRequestError("Invalid Address ID format.");
  }

  const addressExists = await AddressModel.findById(locationData.address);
  if (!addressExists) {
    throw new NotFoundError(
      `Address with ID ${locationData.address} not found.`
    );
  }

  // TODO: Find and update the location (coordinates will be auto-updated)
  const updatedLocation = await LocationModel.findByIdAndUpdate(
    id,
    locationData,
    { new: true }
  ).populate("address");

  if (!updatedLocation) {
    throw new NotFoundError(`Location with ID ${id} not found`);
  }

  return updatedLocation;
};

const deleteLocation = async (id: string): Promise<ILocation | null> => {
  if (!id) {
    throw new BadRequestError("Location ID is required");
  }

  const deletedLocation = await LocationModel.findByIdAndDelete(id).populate(
    "address"
  );

  if (!deletedLocation) {
    throw new NotFoundError(`Location with ID ${id} not found`);
  }

  return deletedLocation;
};

export default {
  createLocation,
  getLocationById,
  getAllLocations,
  getLocationsByAddressInfo,
  updateLocation,
  deleteLocation,
};
