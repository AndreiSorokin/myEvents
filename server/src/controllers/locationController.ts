import { NextFunction, Request, Response } from "express";
<<<<<<< HEAD
import mongoose from "mongoose";

import { LocationModel } from "../models/location";
import locationService from "../services/locationService";
import { BadRequestError, InternalServerError, NotFoundError } from "../errors/ApiError";

export const createLocation = async (req: Request, res: Response) => {
  try {
    console.log("Create location request body:", req.body);
    const { latitude, longitude, address } = req.body;

    if(!latitude ||!longitude ||!address) {
      throw new BadRequestError();
    }

    const location = new LocationModel({ 
      latitude,
      longitude,
      address 
    });

    const newLocation = await locationService.createLocation(location)
    res.status(201).json(newLocation);
  } catch (error: any) {
    console.error("Error creating location:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getLocationById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const locationId = req.params.id;

    if(!locationId) {
      throw new BadRequestError();
    }

    const location = await locationService.getLocationById(locationId);

    if (!location) {
      throw new NotFoundError();
    }
    
    res.status(200).json(location);
  } catch (error: any) {
    if(error instanceof mongoose.Error.CastError) {
      res.status(404).json({
        message: "Wrond format id"
      });
      return
    } else if (error instanceof NotFoundError) {
      res.status(404).json({ message: error.message });
    }

    next(new InternalServerError());
=======
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
>>>>>>> bf8d1929c1fe4de8844d3656e0b7f12f3121bc7d
  }
};
