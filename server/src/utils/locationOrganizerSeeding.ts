import mongoose from "mongoose";
import { LocationModel } from "../models/location";
import { UserModel } from "../models/user";
import { UserRole } from "../enums/UserRole";
import bcrypt from "bcrypt";
import "dotenv/config";
import { connectMongoose } from "./connectMongoose";

// location Data
// Adjusted location data with realistic names
const locationData = [
  {
    country: "France",
    city: "Paris",
    post_code: "75008",
  },
  {
    country: "Germany",
    city: "Berlin",
    post_code: "10178",
  },
  {
    country: "Italy",
    city: "Rome",
    post_code: "00186",
  },
  {
    country: "Spain",
    city: "Madrid",
    post_code: "28014",
  },
  {
    country: "Sweden",
    city: "Stockholm",
    post_code: "114 32",
  },
  {
    country: "Finland",
    city: "Helsinki",
    post_code: "00500",
    district: "Kalasatama",
  },
];

// Organizer Data
const organizerData = [
  {
    name: "Binh Nguyen",
    email: "binh@example.com",
    password: "password123",
    role: UserRole.Organizer,
  },
  {
    name: "Viktoriia Shtyreva",
    email: "viktoriia@example.com",
    password: "password123",
    role: UserRole.Organizer,
  },
  {
    name: "Andrei Sorokin",
    email: "andrei@example.com",
    password: "password123",
    role: UserRole.Organizer,
  },
];

// TODO: Function to seed location data
const seedLocationData = async () => {
  try {
    const savedLocationIds = [];

    await LocationModel.deleteMany({});

    for (const location of locationData) {
      const newLocation = new LocationModel(location);

      const savedLocation = await newLocation.save();
      console.log("Location saved:", savedLocation);

      savedLocationIds.push(savedLocation._id);
    }

    console.log(
      "Data seeding completed. Saved Location IDs:",
      savedLocationIds
    );
  } catch (error) {
    console.error("Error during data seeding:", error);
  }
};

// TODO: Function to seed Organizer data
const seedOrganizerData = async () => {
  try {
    const savedOrganizerIds = [];

    await UserModel.deleteMany({});

    for (const organizer of organizerData) {
      const newOrganizer = new UserModel(organizer);
      const hashedPassword = await bcrypt.hash(organizer.password, 10);
      newOrganizer.password = hashedPassword;

      const savedOrganizer = await newOrganizer.save();
      console.log("Organizer saved:", savedOrganizer);
      savedOrganizerIds.push(savedOrganizer._id);
    }

    console.log(
      "Data seeding completed. Saved Organizer IDs:",
      savedOrganizerIds
    );
  } catch (error) {
    console.error("Error during data seeding:", error);
  }
};

// Main function to call seeding operations
const seedData = async () => {
  await connectMongoose(); // Ensure the database connection is established
  await seedLocationData(); // Seed location data
  await seedOrganizerData(); // Seed organizer data
  mongoose.connection.close(); // Close connection after all operations are done
};

// Run the seeding script
seedData();
