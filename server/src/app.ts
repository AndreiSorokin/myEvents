import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import { errorHandler } from "./middleware/errorMiddleware";
import locationRoutes from "./routes/locationRoutes";
import userRoutes from "./routes/userRoutes";
import eventRoutes from "./routes/eventRoutes";
import authRoutes from "./routes/authRoutes";
import { EventModel } from "./models/event";
import testRoute from "./routes/testRoute";


dotenv.config({ path: ".env" });

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT"],
  },
})

app.get("/", (req, res) => {
  res.send("API is running.");
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/locations", locationRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/events", eventRoutes);
app.use("/api/v1/test", testRoute)

// Global error handling middleware
app.use(errorHandler);

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("joinEvent", (eventId) => {
    socket.join(eventId);
    console.log(`User connected to event: ${eventId}`);
  });

  socket.on("message", async ({ eventId, message }) => {
    // Saves a message to a database
    console.log("message", message)
    try {
      await EventModel.findByIdAndUpdate(eventId, {
        $push: { messages: message },
      })
  
      // Shows a message on an event page
      io.to(eventId).emit("message", message);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  })
})

export { app, httpServer };
