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
  locationData: ILocation
): Promise<ILocation | null> => {
  if (!id) {
    throw new BadRequestError("Location ID is required");
  }

  if (!mongoose.Types.ObjectId.isValid(locationData.address as string)) {
    throw new BadRequestError("Invalid Address ID format.");
  }

  const addressExists = await AddressModel.findById(locationData.address);
  if (!addressExists) {
    throw new NotFoundError(
      `Address with ID ${locationData.address} not found.`
    );
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
  updateLocation,
  deleteLocation,
};
