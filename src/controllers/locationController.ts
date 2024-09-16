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
export const createLocation = async (req: Request, res: Response) => {
  try {
    console.log("Create location request body:", req.body);
    const { latitude, longitude, address } = req.body;

    if (!latitude || !longitude || !address) {
      throw new BadRequestError();
    }

    const location = new LocationModel({
      latitude,
      longitude,
      address,
    });

    const newLocation = await locationService.createLocation(location);
    res.status(201).json(newLocation);
  } catch (error: any) {
    console.error("Error creating location:", error);
    res.status(500).json({ message: error.message });
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
    next(new InternalServerError());
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

    if (!locationId) {
      throw new BadRequestError();
    }

    const location = await locationService.getLocationById(locationId);

    if (!location) {
      throw new NotFoundError();
    }

    res.status(200).json(location);
  } catch (error: any) {
    if (error instanceof mongoose.Error.CastError) {
      res.status(404).json({
        message: "Wrond format id",
      });
      return;
    } else if (error instanceof NotFoundError) {
      res.status(404).json({ message: error.message });
    }

    next(new InternalServerError());
  }
};

// TODO: Update a location
export const updateLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedLocation = await locationService.updateLocation(
      req.params.id,
      req.body
    );
    res.status(200).json(updatedLocation);
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

// TODO: Delete a location
export const deleteLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const locationId = req.params.id;

    if (!locationId) {
      throw new BadRequestError("Location ID is required.");
    }

    const deletedLocation = await locationService.deleteLocation(locationId);

    if (!deletedLocation) {
      throw new NotFoundError("Location not found.");
    }

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
