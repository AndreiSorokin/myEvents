import { Router } from "express";

import {
  createLocation,
  getLocationById,
  getAllLocations,
  updateLocation,
  deleteLocation,
} from "../controllers/locationController";

import multer from 'multer';

const router = Router();
const upload = multer();

router.post("/locations", upload.none(), createLocation);
router.get("/locations", getAllLocations);
router.get("/locations/:id", getLocationById);
router.put("/locations/:id", updateLocation);
router.delete("/locations/:id", deleteLocation);

export default router;
