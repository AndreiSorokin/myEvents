import mongoose from 'mongoose';
import app from "./app";

const port = process.env.PORT as string;
const mongoUrl = process.env.MONGO_DB_URL as string;

mongoose
   .connect(mongoUrl, {
      dbName: "myEvents"
   })
   .then(() => {
      app.listen(port, () => {
         console.log(`Server is running on port ${port}`);
      })
   })
   .catch((error: Error) => {
      process.exit(1);
   })