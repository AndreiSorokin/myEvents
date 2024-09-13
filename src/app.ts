import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import cors from "cors";
import { errorHandler } from "./middleware/errorMiddleware";
import locationRoutes from "./routes/locationRoutes";
import userRoutes from "./routes/userRoutes";
import eventRoutes from "./routes/eventRoutes";

const app = express();

dotenv.config({ path: ".env" });

app.get("/", (req, res) => {
  res.send("API is running.");
});

app.use(cors());
app.use(express.json());

app.use("/api", locationRoutes);
app.use("/api", userRoutes);
app.use("/api", eventRoutes);

// Global error handling middleware
app.use(errorHandler);

export default app;
