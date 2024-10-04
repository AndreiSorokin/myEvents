import { Router } from "express";
import {
  createLocation,
  getLocationById,
  getAllLocations,
  getLocationsByAddressInfo,
  getLocationByCoordinates,
  updateLocation,
  deleteLocation,
} from "../controllers/locationController";

import multer from "multer";

const router = Router();
const upload = multer();


router.post("/locations", upload.none(), createLocation);
router.get("/locations/:id", getLocationById);

router.post("/", upload.none(), createLocation);
router.get("/", getAllLocations);
router.get("/by-address", getLocationsByAddressInfo);
router.get("/by-coordinates", getLocationByCoordinates);
router.get("/:id", getLocationById);
router.put("/:id", updateLocation);
router.delete("/:id", deleteLocation);

export default router;