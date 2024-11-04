import express from "express";
import { EventModel } from "../models/event";

const router = express.Router();

router.put("/", async (req, res) => {
  const { eventId, message } = req.body;
  try {
    await EventModel.findByIdAndUpdate(eventId, {
      $push: { messages: message },
    });
    res.status(200).json({ success: true, message: "Message saved successfully" });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ success: false, error: "Error saving message" });
  }
});

export default router;