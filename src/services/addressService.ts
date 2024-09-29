import { isValidObjectId } from "mongoose";
import { BadRequestError, NotFoundError } from "../errors/ApiError";
import { IAddress } from "../interfaces/IAddress";
import { AddressModel } from "../models/address";
import {
  validateCity,
  validateCountry,
  validateDistrict,
  validatePostcode,
  validateWard,
} from "../utils/addressValidation";

const createAddress = async (addressData: IAddress): Promise<IAddress> => {
  try {
    const { country, city, post_code, district, ward } = addressData;

    if (!country || !(await validateCountry(country))) {
      throw new BadRequestError("Invalid or missing country.");
    }

    if (!city || !(await validateCity(country, city))) {
      throw new BadRequestError(
        "Invalid or missing city for the given country."
      );
    }

    if (post_code && !(await validatePostcode(country, city, post_code))) {
      throw new BadRequestError(
        "Invalid postcode for the given country and city."
      );
    }

    if (district && !(await validateDistrict(country, city, district))) {
      throw new BadRequestError(
        "Invalid district for the given country and city."
      );
    }

    if (ward && !(await validateWard(country, city, district, ward))) {
      throw new BadRequestError(
        "Invalid ward for the given country, city, and district."
      );
    }

    const newAddress = new AddressModel(addressData);
    return await newAddress.save();
  } catch (error: any) {
    if (error.name === "ValidationError") {
      throw new BadRequestError(error.message);
    }
    throw error;
  }
};

const getAllAddresses = async (): Promise<IAddress[]> => {
  return await AddressModel.find();
};

const getAddressById = async (id: string): Promise<IAddress> => {
  if (!id) {
    throw new Error("Address ID is required");
  }

  if (!isValidObjectId(id)) {
    throw new BadRequestError("Invalid Address ID format");
  }

  const foundAddress = await AddressModel.findById(id);

  if (!foundAddress) {
    throw new NotFoundError(`Address with id ${id} cannot be found`);
  }

  return foundAddress;
};

const updateAddress = async (
  id: string,
  addressData: IAddress
): Promise<IAddress | null> => {
  if (!id) {
    throw new BadRequestError("Address ID is required");
  }

  if (!isValidObjectId(id)) {
    throw new BadRequestError("Invalid Address ID format");
  }

  const { country, city, post_code, district, ward } = addressData;

  if (country && !(await validateCountry(country))) {
    throw new BadRequestError("Invalid country.");
  }

  if (city && !(await validateCity(country, city))) {
    throw new BadRequestError("Invalid city for the given country.");
  }

  if (post_code && !(await validatePostcode(country, city, post_code))) {
    throw new BadRequestError(
      "Invalid postcode for the given country and city."
    );
  }

  if (district && !(await validateDistrict(country, city, district))) {
    throw new BadRequestError(
      "Invalid district for the given country and city."
    );
  }

  if (ward && !(await validateWard(country, city, district, ward))) {
    throw new BadRequestError(
      "Invalid ward for the given country, city, and district."
    );
  }

  const updatedAddress = await AddressModel.findByIdAndUpdate(id, addressData, {
    new: true,
  });

  if (!updatedAddress) {
    throw new NotFoundError(`Address with ID ${id} not found`);
  }

  return updatedAddress;
};

const deleteAddress = async (id: string): Promise<IAddress | null> => {
  if (!id) {
    throw new BadRequestError("Address ID is required");
  }

  const deletedAddress = await AddressModel.findByIdAndDelete(id);

  if (!deletedAddress) {
    throw new NotFoundError(`Address with ID ${id} not found`);
  }

  return deletedAddress;
};

export default {
  createAddress,
  getAllAddresses,
  getAddressById,
  updateAddress,
  deleteAddress,
};