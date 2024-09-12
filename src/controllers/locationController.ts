import { NextFunction, Request, Response } from "express";
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
  }
};
