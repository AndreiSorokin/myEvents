import { Router } from "express";
import {
  createLocation,
  getLocationById,
  getAllLocations,
  updateLocation,
  deleteLocation,
} from "../controllers/locationController";

const router = Router();

router.post("/locations", createLocation);
router.get("/locations", getAllLocations);
router.get("/locations/:id", getLocationById);
router.put("/locations/:id", updateLocation);
router.delete("/locations/:id", deleteLocation);

export default router;
