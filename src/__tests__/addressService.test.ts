import sinon from "sinon";
import { expect } from "@jest/globals";
import addressService from "../services/addressService";
import { AddressModel } from "../models/address";
import { IAddress } from "../interfaces/IAddress";
import mongoose from "mongoose";
import { BadRequestError, NotFoundError } from "../errors/ApiError";

describe("AddressService", () => {
  let mockAddressSave: sinon.SinonStub;

  beforeEach(() => {
    mockAddressSave = sinon.stub(AddressModel.prototype, "save");
  });

  afterEach(() => {
    mockAddressSave.restore();
    sinon.restore();
  });

  const addressId = new mongoose.Types.ObjectId().toString();

  describe("createAddress", () => {
    it("Should create an address successfully", async () => {
      const addressData = {
        country: "Finland",
        city: "Helsinki",
        district: "Kallio",
        ward: "Hietalahti",
        post_code: "00530",
        street: "Tapiolankatu",
        address_number: "1",
      } as IAddress;

      const savedAddress = { ...addressData, _id: addressId };

      mockAddressSave.resolves(savedAddress);

      const result = await addressService.createAddress(addressData);

      expect(result).toEqual(savedAddress);
      expect(result.city).toEqual("Helsinki");
      expect(mockAddressSave.calledOnce).toBeTruthy();
    });

    it("Should throw an error when creating an address without country", async () => {
      const addressData = {
        city: "Helsinki",
        district: "Kallio",
        ward: "Hietalahti",
        post_code: "00530",
        street: "Tapiolankatu",
        address_number: "1",
      } as IAddress;

      expect(mockAddressSave.called).toBeFalsy();
      await expect(addressService.createAddress(addressData)).rejects.toThrow(
        "Country is required"
      );
    });

    it("Should throw an error when creating an address without city", async () => {
      const addressData = {
        country: "Finland",
        district: "Kallio",
        ward: "Hietalahti",
        post_code: "00530",
        street: "Tapiolankatu",
        address_number: "1",
      } as IAddress;

      expect(mockAddressSave.called).toBeFalsy();
      await expect(addressService.createAddress(addressData)).rejects.toThrow(
        "City is required"
      );
    });
  });

  describe("fetchAddress", () => {
    it("should get all addresses", async () => {
      const addresses = [
        {
          country: "Finland",
          city: "Helsinki",
          district: "Kallio",
          post_code: "00530",
        },
        {
          country: "USA",
          city: "New York",
          district: "Manhattan",
          post_code: "10001",
        },
      ] as IAddress[];

      const mockFind = sinon.stub(AddressModel, "find").resolves(addresses);
      const result = await addressService.getAllAddresses();

      expect(result).toEqual(addresses);
      expect(mockFind.calledOnce).toBeTruthy();
    });

    it("should get an address by id", async () => {
      const address = {
        country: "Finland",
        city: "Helsinki",
        district: "Kallio",
        post_code: "00530",
      } as IAddress;

      const mockFindById = sinon
        .stub(AddressModel, "findById")
        .resolves(address);

      const result = await addressService.getAddressById(addressId);

      expect(result).toEqual(address);
      expect(mockFindById.calledOnce).toBeTruthy();
      expect(mockFindById.calledWith(addressId)).toBeTruthy();
    });

    it("should throw NotFoundError if address is not found", async () => {
      const mockFindById = sinon.stub(AddressModel, "findById").resolves(null);
      await expect(addressService.getAddressById(addressId)).rejects.toThrow(
        NotFoundError
      );

      expect(mockFindById.calledOnce).toBeTruthy();
      expect(mockFindById.calledWith(addressId)).toBeTruthy();
    });

    it("should throw BadRequestError if the address id is invalid", async () => {
      const fakeId = "invalid-id";
      await expect(addressService.getAddressById(fakeId)).rejects.toThrow(
        BadRequestError
      );

      expect(mockAddressSave.called).toBeFalsy();
    });

    it("should throw Error if address id is not provided", async () => {
      await expect(addressService.getAddressById("")).rejects.toThrow(
        "Address ID is required"
      );
    });
  });

  describe("updateAddress", () => {
    it("Should update an address successfully", async () => {

    });

    it("should throw BadRequestError if the address ID is missing", async () => {});

    it("should throw BadRequestError if the address ID format is invalid", async () => {});

    it("should throw NotFoundError if the address with the given ID is not found", async () => {});
  });

  describe("deleteAddress", () => {});
});
