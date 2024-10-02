import express from "express";
import eventController from "../controllers/eventController";
import multer from 'multer';


const router = express.Router();
const upload = multer();


router.post("/events", upload.array('images', 5), eventController.createEvent);
router.get("/events/:id", eventController.getEventById);
router.get("/events", eventController.getAllEvents);
router.put("/events/:id", eventController.updateEvent);
router.delete("/events/:id", eventController.deleteEvent);

export default router;
