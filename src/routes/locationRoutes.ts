import { Router } from "express";
import { createLocation, getLocation } from "../controllers/locationController";

const router = Router();

router.post("/locations", createLocation);
router.get("/locations/:id", getLocation);

export default router;