import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "../interfaces/IUser";
import { UserRole } from "../enums/UserRole";

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [2, "Name must be at least 2 characters long"],
    maxlength: [50, "Name cannot exceed 50 characters"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    maxlength: [100, "Password cannot exceed 100 characters"],
    validate: {
      validator: function (value: string) {
        // Custom validator to ensure the password contains numbers and letters
        return /[a-zA-Z]/.test(value) && /[0-9]/.test(value);
      },
      message: "Password must contain at least one letter and one number",
    },
  },
  role: {
    type: String,
    enum: {
      values: Object.values(UserRole),
      message: "{VALUE} is not a valid role",
    },
    default: UserRole.User,
  },
  events: [{ type: Schema.Types.ObjectId, ref: "Event" }],
});

// Password hashing middleware before saving a new user or updating password
userSchema.pre("save", async function (next) {
  const user = this as IUser;

  // Only hash the password if it's new or modified
  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
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
