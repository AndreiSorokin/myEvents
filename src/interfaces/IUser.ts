import { Document } from "mongoose";
import { UserRole } from "../enums/UserRole";
import { IEvent } from "./IEvent";

// User Interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  events: IEvent["_id"][]; // Array of event IDs (many-to-many relationship)
}
