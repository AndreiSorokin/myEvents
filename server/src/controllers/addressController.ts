import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

import { AddressModel } from "../models/address";
import addressService from "../services/addressService";
import { InternalServerError } from "../errors/ApiError";

// TODO: Create an address
export const createAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { country, city, district, ward, post_code, street, address_number } =
      req.body;
    const address = new AddressModel({
      country,
      city,
      district,
      ward,
      post_code,
      street,
      address_number,
    });

    const newAddress = await addressService.createAddress(address);
    res.status(201).json(newAddress);
  } catch (error: any) {
    next(new InternalServerError(error.message));
  }
};

// TODO: Get all addresses
export const getAllAddresses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const addresses = await addressService.getAllAddresses();
    res.status(200).json(addresses);
  } catch (error: any) {
    next(new InternalServerError(error.message));
  }
};

// TODO: Get an address by ID
export const getAddressById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const addressId = req.params.id;
    const address = await addressService.getAddressById(addressId);
    res.status(200).json(address);
  } catch (error: any) {
    if (error instanceof mongoose.Error.CastError) {
      res.status(404).json({
        message: "Wrong format id",
      });
    } else {
      next(new InternalServerError(error.message));
    }
  }
};

// TODO: Update an address by ID
export const updateAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const addressId = req.params.id;
    const updatedAddress = await addressService.updateAddress(
      addressId,
      req.body
    );
    res
      .status(200)
      .json({ message: "Address updated successfully.", updatedAddress });
  } catch (error: any) {
    if (error instanceof mongoose.Error.CastError) {
      res.status(404).json({
        message: "Wrong format id",
      });
    } else {
      next(new InternalServerError(error.message));
    }
  }
};

// TODO: Delete an address by ID
export const deleteAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const addressId = req.params.id;
    const deletedAddress = await addressService.deleteAddress(addressId);
    res
      .status(200)
      .json({ message: "Address deleted successfully.", deletedAddress });
  } catch (error: any) {
    if (error instanceof mongoose.Error.CastError) {
      res.status(404).json({
        message: "Wrong format id",
      });
    } else {
      next(new InternalServerError(error.message));
    }
  }
};
