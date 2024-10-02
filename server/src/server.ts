import mongoose from "mongoose";
import app from "./app";

const port = process.env.PORT || 3003;
const mongoUrl = process.env.MONGO_DB_URL as string;

if (!mongoUrl) {
  throw new Error("MongoDB URL not found in .env");
}

mongoose
  .connect(mongoUrl, {
    dbName: "myEvents",
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error: Error) => {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  });
