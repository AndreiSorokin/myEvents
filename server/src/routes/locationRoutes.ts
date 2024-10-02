import { Router } from "express";
import { createLocation, getLocationById } from "../controllers/locationController";
import multer from 'multer';


const router = Router();
const upload = multer();


router.post("/locations", upload.none(), createLocation);
router.get("/locations/:id", getLocationById);

export default router;