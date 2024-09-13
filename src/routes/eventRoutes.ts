import express from "express";
import eventController from "../controllers/eventController";

const router = express.Router();

router.post("/events", eventController.createEvent);
router.get("/events/:id", eventController.getEventById);
router.get("/events", eventController.getAllEvents);
router.put("/events/:id", eventController.updateEvent);
router.delete("/events/:id", eventController.deleteEvent);

export default router;
