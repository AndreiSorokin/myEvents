import { NextFunction, Request, Response } from "express";
import { LocationModel } from "../models/location";
import locationService from "../services/locationService";
import { InternalServerError, NotFoundError } from "../errors/ApiError";

// TODO: Create a location
export const createLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { country, city, district, ward, post_code, street, address_number } =
      req.body;
    const location = new LocationModel({
      country,
      city,
      district,
      ward,
      post_code,
      street,
      address_number,
    });
    const newLocation = await locationService.createLocation(location);
    res.status(201).json(newLocation);
  } catch (error: any) {
    next(new InternalServerError(error.message));
  }
};

// TODO: Get all locations
export const getAllLocations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const locations = await locationService.getAllLocations();
    res.status(200).json(locations);
  } catch (error: any) {
    next(new InternalServerError(error.message));
  }
};

// TODO: Get locations by address information:
export const getLocationsByAddressInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const address = req.query.address as string;
    const locations = await locationService.getLocationsByAddressInfo(address);
    res.status(200).json(locations);
  } catch (error: any) {
    next(new InternalServerError(error.message));
  }
};

// TODO: Get location by coordinates
export const getLocationByCoordinates = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const latitude = req.query.lat
      ? parseFloat(req.query.lat as string)
      : undefined;
    const longitude = req.query.long
      ? parseFloat(req.query.long as string)
      : undefined;
    const locations = await locationService.getLocationByCoordinates(
      latitude,
      longitude
    );
    res.status(200).json(locations);
  } catch (error: any) {
    next(new InternalServerError(error.message));
  }
};

// TODO: Get a location by ID
export const getLocationById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const locationId = req.params.id;
    const location = await locationService.getLocationById(locationId);
    res.status(200).json(location);
  } catch (error: any) {
    next(new InternalServerError(error.message));
  }
};

// TODO: Update a location by ID
export const updateLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const locationId = req.params.id;
    if (!locationId) {
      throw new InternalServerError("Location ID is required.");
    }

    // If location id is not in database:
    const existedLocation = await locationService.getLocationById(locationId);
    if (!existedLocation) {
      throw new NotFoundError(`Location with ID ${locationId} not found.`);
    }

    const updatedLocation = await locationService.updateLocation(
      locationId,
      req.body
    );
    res
      .status(200)
      .json({ message: "Location updated successfully.", updatedLocation });
  } catch (error: any) {
    next(new InternalServerError(error.message));
  }
};

// TODO: Delete a location
export const deleteLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const locationId = req.params.id;
    const deletedLocation = await locationService.deleteLocation(locationId);
    res
      .status(200)
      .json({ message: "Location deleted successfully.", deletedLocation });
  } catch (error: any) {
    next(new InternalServerError(error.message));
  }
};
