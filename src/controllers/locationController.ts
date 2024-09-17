import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

import { LocationModel } from "../models/location";
import locationService from "../services/locationService";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../errors/ApiError";

// TODO: Create a location
export const createLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { latitude, longitude, address } = req.body;
    const location = new LocationModel({
      latitude,
      longitude,
      address,
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
    if (error instanceof mongoose.Error.CastError) {
      res.status(404).json({
        message: "Wrong format id",
      });
      return;
    } else {
      next(new InternalServerError(error.message));
    }
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
    const updatedLocation = await locationService.updateLocation(
      locationId,
      req.body
    );
    res
      .status(200)
      .json({ message: "Location updated successfully.", updatedLocation });
  } catch (error: any) {
    if (error instanceof mongoose.Error.CastError) {
      res.status(404).json({ message: "Invalid ID format." });
    } else {
      next(new InternalServerError(error.message));
    }
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
    if (error instanceof mongoose.Error.CastError) {
      res.status(404).json({ message: "Invalid ID format." });
    } else if (error instanceof NotFoundError) {
      res.status(404).json({ message: error.message });
    } else {
      next(new InternalServerError());
    }
  }
};
