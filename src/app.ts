import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import cors from "cors";
import locationRoutes from "./routes/locationRoutes";

const app = express();

dotenv.config({ path: ".env" });

app.get("/", (req, res) => {
  res.send("API is running.");
});

app.use(cors());
app.use(express.json());

app.use("/api", locationRoutes);

export default app;
