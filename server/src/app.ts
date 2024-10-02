import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import cors from "cors";
import { errorHandler } from "./middleware/errorMiddleware";
import addressRoutes from "./routes/addressRoutes";
import locationRoutes from "./routes/locationRoutes";
import userRoutes from "./routes/userRoutes";
import eventRoutes from "./routes/eventRoutes";
import authRoutes from "./routes/authRoutes";

const app = express();

dotenv.config({ path: ".env" });

app.get("/", (req, res) => {
  res.send("API is running.");
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/addresses", addressRoutes);
app.use("/api/v1/locations", locationRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/events", eventRoutes);

// Global error handling middleware
app.use(errorHandler);

export default app;
