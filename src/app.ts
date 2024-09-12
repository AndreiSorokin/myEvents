import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import cors from "cors";

const app = express();

dotenv.config({ path: ".env" });

app.use(cors);
app.use(express.json());


export default app;