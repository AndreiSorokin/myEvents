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

// TODO: Get locations by address's country
const getLocationsByCountry = async (country: string): Promise<ILocation[]> => {
  if (!country) {
    throw new BadRequestError("Country is required");
  }

  // Normalize the country name: remove special characters and multiple spaces
  const normalizedCountry = country
    .replace(/[\W_]+/g, " ") // Replace non-alphanumeric characters (hyphens, underscores) with spaces
    .trim(); // Remove any leading or trailing spaces

  // Use regex for case-insensitive match and ensure only locations with addresses are returned
  const locations = await LocationModel.find({
    address: { $ne: null }, // Exclude locations with null addresses
  }).populate({
    path: "address",
    match: { country: { $regex: new RegExp(`^${normalizedCountry}$`, "i") } }, // Case-insensitive country match
  });

  // Filter out any locations where the address doesn't match (in case populate fails)
  const filteredLocations = locations.filter(
    (location) => location.address !== null
  );

  return filteredLocations;
};

// TODO: Get locations by address's city
const getLocationsByCity = async (city: string): Promise<ILocation[]> => {
  if (!city) {
    throw new BadRequestError("City is required");
  }

  // Normalize the city name: remove special characters and multiple spaces
  const normalizedCity = city
    .replace(/[\W_]+/g, " ") // Replace non-alphanumeric characters (hyphens, underscores) with spaces
    .trim(); // Remove any leading or trailing spaces

  // Use regex for case-insensitive match and ensure only locations with addresses are returned
  const locations = await LocationModel.find({
    address: { $ne: null }, // Exclude locations with null addresses
  }).populate({
    path: "address",
    match: { city: { $regex: new RegExp(`^${normalizedCity}$`, "i") } }, // Case-insensitive city match
  });

  // Filter out any locations where the address doesn't match (in case populate fails)
  const filteredLocations = locations.filter(
    (location) => location.address !== null
  );

  return filteredLocations;
};

// TODO: Get locations by address's postal code
// TODO: Get locations by address's district
// TODO: Get locations by address's ward
// TODO: Get locations by address's street

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
  getLocationsByCountry,
  getLocationsByCity,
  updateLocation,
  deleteLocation,
};
