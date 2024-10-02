import axios from "axios";
import { IAddress } from "../interfaces/IAddress";
require("dotenv").config();

const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;
const BASE_URL = `https://api.opencagedata.com/geocode/v1/json?key=${OPENCAGE_API_KEY}`;

export const fetchCoordinates = async (address: IAddress) => {
  try {
    const { country, city, district, post_code, street, address_number, ward } =
      address;

    // Construct the address string
    const addressString = `
    ${address_number || ""},
    ${street || ""},
    ${ward || ""},
    ${district || ""},
    ${city},
    ${post_code},
    ${country}`;

    // TODO: OpenCage API Call
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        q: addressString,
      },
    });

    if (
      response.data &&
      response.data.results &&
      response.data.results.length > 0
    ) {
      const { lat, lng } = response.data.results[0].geometry;
      return {
        latitude: lat,
        longitude: lng,
      };
    } else {
      throw new Error("No results found for the provided address.");
    }
  } catch (error) {
    console.error("Error fetching coordinates from OpenCage API:", error);
    throw new Error("Unable to fetch coordinates.");
  }
};
