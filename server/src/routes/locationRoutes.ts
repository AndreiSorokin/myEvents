import { Router } from "express";
<<<<<<< HEAD
import { createLocation, getLocationById } from "../controllers/locationController";
import multer from 'multer';

=======

import {
  createLocation,
  getLocationById,
  getAllLocations,
  getLocationsByAddressInfo,
  updateLocation,
  deleteLocation,
} from "../controllers/locationController";

import multer from "multer";
>>>>>>> bf8d1929c1fe4de8844d3656e0b7f12f3121bc7d

const router = Router();
const upload = multer();

<<<<<<< HEAD

router.post("/locations", upload.none(), createLocation);
router.get("/locations/:id", getLocationById);

export default router;
=======
router.post("/", upload.none(), createLocation);
router.get("/", getAllLocations);
router.get("/by-address", getLocationsByAddressInfo);
router.get("/:id", getLocationById);
router.put("/:id", updateLocation);
router.delete("/:id", deleteLocation);

export default router;
>>>>>>> bf8d1929c1fe4de8844d3656e0b7f12f3121bc7d
