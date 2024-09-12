import { Router } from "express";
import { createLocation, getLocationById } from "../controllers/locationController";

const router = Router();

router.post("/locations", createLocation);
router.get("/locations/:id", getLocationById);

export default router;