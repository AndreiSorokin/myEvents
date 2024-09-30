import { NextFunction, Request, Response } from "express";
import { LocationModel } from "../models/location";
import locationService from "../services/locationService";
import { InternalServerError } from "../errors/ApiError";

// TODO: Create a location
export const createLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { address } = req.body;
    const location = new LocationModel({ address });
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
    const { address } = req.body;
    const updatedLocation = await locationService.updateLocation(locationId, {
      address,
    });
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
