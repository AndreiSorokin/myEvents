import { BadRequestError, NotFoundError } from "../errors/ApiError";
import { ILocation } from "../interfaces/ILocation";
import { LocationModel } from "../models/location";

const createLocation = async (locationData: ILocation): Promise<ILocation> => {
  const { latitude, longitude, address } = locationData;

  if (!latitude || !longitude || !address) {
    throw new BadRequestError();
  }

  return await locationData.save();
};

const getAllLocations = async (): Promise<ILocation[]> => {
  return await LocationModel.find().populate("address");
};

const getLocationById = async (id: string): Promise<ILocation> => {
  if (!id) {
    throw new Error("Location ID is required");
  }

  const foundLocation = await LocationModel.findById(id).populate("address");

  if (!foundLocation) {
    throw new NotFoundError();
  }

  return foundLocation;
};

// TODO: Update a location
const updateLocation = async (
  id: string,
  locationData: ILocation
): Promise<ILocation | null> => {
  if (!id) {
    throw new Error("Location ID is required");
  }

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

// TODO: Delete a location
const deleteLocation = async (id: string): Promise<ILocation | null> => {
  if (!id) {
    throw new Error("Location ID is required");
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
  updateLocation,
  deleteLocation,
};
