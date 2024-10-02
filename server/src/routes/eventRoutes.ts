import express from "express";
import eventController from "../controllers/eventController";
import multer from 'multer';


const router = express.Router();
const upload = multer();


<<<<<<< HEAD
router.post("/events", upload.array('images', 5), eventController.createEvent);
router.get("/events/:id", eventController.getEventById);
router.get("/events", eventController.getAllEvents);
router.put("/events/:id", eventController.updateEvent);
router.delete("/events/:id", eventController.deleteEvent);
=======
router.post("/", upload.array('images', 5), eventController.createEvent);
router.get("/:id", eventController.getEventById);
router.get("/", eventController.getAllEvents);
router.put("/:id", eventController.updateEvent);
router.delete("/:id", eventController.deleteEvent);
>>>>>>> bf8d1929c1fe4de8844d3656e0b7f12f3121bc7d

export default router;
