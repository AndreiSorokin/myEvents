import { BadRequestError, NotFoundError } from "../errors/ApiError";
import { ILocation } from "../interfaces/ILocation";
import { LocationModel } from "../models/location";

const getLocationById = async(id: string): Promise<ILocation> => {
  if(!id) {
    throw new Error("Location ID is required");
  }

  const foundLocation = await LocationModel.findById(id).populate('address');

  if(!foundLocation) {
    throw new NotFoundError();
  }

  return foundLocation;
}

const createLocation = async(locationData: ILocation): Promise<ILocation> => {
  const { latitude, longitude, address } = locationData;

  if(!latitude ||!longitude || !address) {
    throw new BadRequestError();
  }

  return await locationData.save();
}

export default { getLocationById, createLocation };