import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
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

// Password hashing middleware before saving a new user
userSchema.pre("save", async function (next) {
  const user = this as IUser;

  // Only hash the password if it's new or modified
  if (!user.isModified("password")) return next();

  try {
    // Hash the password with a salt round of 10
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    next();
  } catch (error) {
    return next(error as Error);
  }
});

// Password hashing middleware before updating user password
userSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as { $set: { password?: string } };
  if (!update.$set || !update.$set.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(update.$set.password, salt);
    update.$set.password = hashedPassword;
    next();
  } catch (error) {
    return next(error as Error);
  }
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
