import { BadRequestError, NotFoundError } from "../errors/ApiError";
import { ILocation } from "../interfaces/ILocation";
import { LocationModel } from "../models/location";

const createLocation = async (locationData: ILocation): Promise<ILocation> => {
  return await locationData.save();
};

const getAllLocations = async (): Promise<ILocation[]> => {
  return await LocationModel.find();
};

const getLocationById = async (id: string): Promise<ILocation> => {
  if (!id) {
    throw new BadRequestError("Location ID is required");
  }

  const foundLocation = await LocationModel.findById(id);

  if (!foundLocation) {
    throw new NotFoundError(`Location with id ${id} cannot be found`);
  }

  return foundLocation;
};

const updateLocation = async (
  id: string,
  locationData: ILocation
): Promise<ILocation | null> => {
  if (!id) {
    throw new BadRequestError("Location ID is required");
  }

  const updatedLocation = await LocationModel.findByIdAndUpdate(
    id,
    locationData,
    { new: true }
  );

  if (!updatedLocation) {
    throw new NotFoundError(`Location with ID ${id} not found`);
  }

  return updatedLocation;
};

const deleteLocation = async (id: string): Promise<ILocation | null> => {
  if (!id) {
    throw new BadRequestError("Location ID is required");
  }

  const deletedLocation = await LocationModel.findByIdAndDelete(id);

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
