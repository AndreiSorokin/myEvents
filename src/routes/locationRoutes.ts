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

router.post("/", upload.none(), createLocation);
router.get("/", getAllLocations);
router.get("/:id", getLocationById);
router.put("/:id", updateLocation);
router.delete("/:id", deleteLocation);

export default router;
