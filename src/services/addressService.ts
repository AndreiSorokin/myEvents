import { isValidObjectId } from "mongoose";
import { BadRequestError, NotFoundError } from "../errors/ApiError";
import { IAddress } from "../interfaces/IAddress";
import { AddressModel } from "../models/address";

const createAddress = async (addressData: IAddress): Promise<IAddress> => {
  try {
    if (!addressData.country) {
      throw new BadRequestError("Country is required");
    }

    if (!addressData.city) {
      throw new BadRequestError("City is required");
    }

    if (!addressData.post_code) {
      throw new BadRequestError("Post code is required");
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
