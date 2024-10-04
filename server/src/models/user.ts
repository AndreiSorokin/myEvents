import { Schema, model } from "mongoose";
import { IUser } from "../interfaces/IUser";
import { UserRole } from "../enums/UserRole";

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.User,
  },
  events: [{ type: Schema.Types.ObjectId, ref: "Event" }], // Reference to Event IDs (many-to-many)
});

// JSON serialization for userSchema
userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password; // Do not expose password
  },
});

export const UserModel = model<IUser>("User", userSchema);
