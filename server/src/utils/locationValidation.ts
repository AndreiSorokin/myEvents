import axios from "axios";
require("dotenv").config();

const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;
const BASE_URL = `https://api.opencagedata.com/geocode/v1/json?key=${OPENCAGE_API_KEY}`;

// TODO: Funtion to validate country using OpenCage API
const validateCountry = async (country: string): Promise<boolean> => {
  const response = await axios.get(
    `${BASE_URL}&q=${country}&no_annotations=1&limit=1`
  );
  return (
    response.data.results.length > 0 &&
    response.data.results[0].components.country === country
  );
};

// TODO: Function to validate city within a country
const validateCity = async (
  country: string,
  city: string
): Promise<boolean> => {
  const response = await axios.get(
    `${BASE_URL}&q=${city},${country}&no_annotations=1&limit=1`
  );
  const components = response.data.results[0]?.components || {};
  return (
    components.city === city ||
    components.town === city ||
    components.village === city
  );
};

// TODO: Function to validate postcode within country and city
const validatePostcode = async (
  country: string,
  city: string,
  postcode: string
): Promise<boolean> => {
  const response = await axios.get(
    `${BASE_URL}&q=${postcode},${country}&no_annotations=1&limit=1`
  );
  const components = response.data.results[0]?.components || {};
  return (
    components.postcode === postcode &&
    (components.city === city ||
      components.town === city ||
      components.village === city)
  );
};

// TODO: Function to validate district within city and country
const validateDistrict = async (
  country: string,
  city: string,
  district: string
): Promise<boolean> => {
  const response = await axios.get(
    `${BASE_URL}&q=${district},${city},${country}&no_annotations=1&limit=1`
  );
  const components = response.data.results[0]?.components || {};
  return (
    components.suburb === district || components.state_district === district
  );
};

// TODO: Function to validate ward within district
const validateWard = async (
  country: string,
  city: string,
  district: string,
  ward: string
): Promise<boolean> => {
  const response = await axios.get(
    `${BASE_URL}&q=${ward},${district},${city},${country}&no_annotations=1&limit=1`
  );
  const components = response.data.results[0]?.components || {};

  const matchedWard =
    components.suburb?.toLowerCase() === ward.toLowerCase() ||
    components.neighbourhood?.toLowerCase() === ward.toLowerCase() ||
    components.quarter?.toLowerCase() === ward.toLowerCase();
  if (!matchedWard) {
    console.log("OpenCage returned components:", components);
    return false;
  }

  return true;
};

export {
  validateCountry,
  validateCity,
  validatePostcode,
  validateDistrict,
  validateWard,
};
