import { Request, Response } from "express";
import { LocationService } from "../services/locationService";

export const createLocation = async (req: Request, res: Response) => {
  try {
    console.log("Create location request body:", req.body);
    const { latitude, longitude, address } = req.body;
    const location = await LocationService.createLocation(
      latitude,
      longitude,
      address
    );
    res.status(201).json(location);
  } catch (error: any) {
    console.error("Error creating location:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getLocation = async (req: Request, res: Response) => {
  try {
    const location = await LocationService.getLocationById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.status(200).json(location);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
