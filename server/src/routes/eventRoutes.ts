import express from "express";
import eventController from "../controllers/eventController";
import multer from 'multer';


const router = express.Router();
const upload = multer();


router.post("/", upload.array('images', 5), eventController.createEvent);
router.get("/:id", eventController.getEventById);
router.get("/", eventController.getAllEvents);
router.put("/:id", eventController.updateEvent);
router.delete("/:id", eventController.deleteEvent);

export default router;
