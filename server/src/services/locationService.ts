import {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} from "../errors/ApiError";
import { ILocation } from "../interfaces/ILocation";
import { LocationModel } from "../models/location";
import { isValidObjectId } from "mongoose";
import {
  validateCity,
  validateCountry,
  validateDistrict,
  validatePostcode,
  validateWard,
} from "../utils/locationValidation";

const createLocation = async (locationData: ILocation): Promise<ILocation> => {
  try {
    const { country, city, post_code, district, ward } = locationData;

    if (!country || !(await validateCountry(country))) {
      throw new InternalServerError(" - Invalid or missing COUNTRY.");
    }

    if (!city || !(await validateCity(country, city))) {
      throw new InternalServerError(
        " - Invalid or missing CITY for the given country."
      );
    }

    if (post_code && !(await validatePostcode(country, city, post_code))) {
      throw new InternalServerError(
        " - Invalid POSTCODE for the given country and city."
      );
    }

    if (district && !(await validateDistrict(country, city, district))) {
      throw new InternalServerError(
        " - Invalid DISTRICT for the given country and city."
      );
    }

    if (ward && !(await validateWard(country, city, district, ward))) {
      throw new InternalServerError(
        " - Invalid WARD for the given country, city, and district."
      );
    }

    const newLocation = await LocationModel.create(locationData);
    return newLocation;
  } catch (error: any) {
    throw new InternalServerError("Internal Server Error" + error.message);
  }
};

const getAllLocations = async (): Promise<ILocation[]> => {
  return await LocationModel.find();
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

  try {
    // Search for locations directly within the LocationModel using the constructed regex
    const locations = await LocationModel.find({
      $and: searchConditions, // Ensure all parts match at least one of the fields
    });

    if (!locations.length) {
      throw new NotFoundError(
        "No locations found matching the given address information."
      );
    }

    return locations;
  } catch (error: any) {
    throw new InternalServerError(
      "Error retrieving locations: " + error.message
    );
  }
};

// TODO: Get Location by coordinates
const getLocationByCoordinates = async (
  latitude?: number,
  longitude?: number
): Promise<ILocation[]> => {
  if (!latitude && !longitude) {
    throw new BadRequestError("Latitude or longitude is required");
  }

  // Define the tolerance value for the search (you can adjust this as needed)
  const tolerance = 0.5;

  // Build query conditions based on provided lattitude and longtitude
  const searchConditions: any = {};

  if (latitude) {
    searchConditions.latitude = {
      $gte: latitude - tolerance, // greater than or equal to.
      $lte: latitude + tolerance, // less than or equal to.
    };
  }

  if (longitude) {
    searchConditions.longitude = {
      $gte: longitude - tolerance,
      $lte: longitude + tolerance,
    };
  }

  // Fetch matching locations
  const locations = await LocationModel.find(searchConditions);

  return locations;
};

const getLocationById = async (id: string): Promise<ILocation> => {
  if (!id) {
    throw new BadRequestError("Location ID is required");
  }

  if (!isValidObjectId(id)) {
    throw new BadRequestError("Invalid Location ID format");
  }

  const foundLocation = await LocationModel.findById(id);

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

  if (!isValidObjectId(id)) {
    throw new BadRequestError("Invalid Location ID format");
  }

  const { country, city, post_code, district, ward } = locationData;

  if (country && !(await validateCountry(country))) {
    throw new InternalServerError("Invalid COUNTRY.");
  }

  if (country && city && !(await validateCity(country, city))) {
    throw new InternalServerError("Invalid CITY for the given country.");
  }

  if (
    country &&
    city &&
    post_code &&
    !(await validatePostcode(country, city, post_code))
  ) {
    throw new InternalServerError(
      "Invalid POSTCODE for the given country and city."
    );
  }

  if (
    country &&
    city &&
    district &&
    !(await validateDistrict(country, city, district))
  ) {
    throw new InternalServerError(
      "Invalid DISTRICT for the given country and city."
    );
  }

  if (
    country &&
    city &&
    district &&
    ward &&
    !(await validateWard(country, city, district, ward))
  ) {
    throw new InternalServerError(
      "Invalid WARD for the given country, city, and district."
    );
  }

  // TODO: Find and update the location (coordinates will be auto-updated)
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
  getLocationsByAddressInfo,
  getLocationByCoordinates,
  updateLocation,
  deleteLocation,
};
