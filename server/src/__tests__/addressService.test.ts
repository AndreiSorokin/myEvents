import sinon from "sinon";
import { expect } from "@jest/globals";
import addressService from "../services/addressService";
import { AddressModel } from "../models/address";
import { IAddress } from "../interfaces/IAddress";
import { BadRequestError, NotFoundError } from "../errors/ApiError";
import {
  addressId,
  addressData,
  fakeId,
} from "../__tests__/helper/addressHelper";
import {
  validateCity,
  validateCountry,
  validateDistrict,
  validatePostcode,
  validateWard,
} from "../utils/addressValidation";

describe("AddressService", () => {
  let mockAddressSave: sinon.SinonStub;
  let mockUpdate: sinon.SinonStub;

  beforeEach(() => {
    mockAddressSave = sinon.stub(AddressModel.prototype, "save");
    mockUpdate = sinon.stub(AddressModel, "findByIdAndUpdate");
  });

  afterEach(() => {
    mockAddressSave.restore();
    mockUpdate.restore();
    sinon.restore();
  });

  describe("createAddress", () => {
    it("Should create an address successfully", async () => {
      const savedAddress = { ...addressData, _id: addressId };

      mockAddressSave.resolves(savedAddress);

      const result = await addressService.createAddress(addressData);

      expect(result).toEqual(savedAddress);
      expect(result.city).toEqual("Vaasa");
      expect(mockAddressSave.calledOnce).toBeTruthy();
    });

    it("Should throw an error when creating an address without country", async () => {
      const addressDataNoCountry = {
        city: "Helsinki",
        district: "Kallio",
        ward: "Hietalahti",
        post_code: "00530",
        street: "Tapiolankatu",
        address_number: "1",
      } as IAddress;

      expect(mockAddressSave.called).toBeFalsy();
      await expect(
        addressService.createAddress(addressDataNoCountry)
      ).rejects.toThrow("Invalid or missing country.");
    });

    it("Should throw an error when creating an address without city", async () => {
      const addressDataNoCity = {
        country: "Finland",
        district: "Kallio",
        ward: "Hietalahti",
        post_code: "00530",
        street: "Tapiolankatu",
        address_number: "1",
      } as IAddress;

      expect(mockAddressSave.called).toBeFalsy();
      await expect(
        addressService.createAddress(addressDataNoCity)
      ).rejects.toThrow("Invalid or missing city for the given country.");
    });

    it("Should throw an error as Invalid or missing city for the given country.", async () => {
      const addressDataNoCity = {
        country: "Finland",
        city: "Da Nang",
        post_code: "65100",
      } as IAddress;

      expect(mockAddressSave.called).toBeFalsy();
      await expect(
        addressService.createAddress(addressDataNoCity)
      ).rejects.toThrow("Invalid or missing city for the given country.");
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
    it("Should update an address successfully", async () => {});

    it("Should throw error invalid district for the given country, city, and postcode.", async () => {
      const updatedAddress = {
        country: "Finland",
        city: "Vaasa",
        district: "Kallio", // Assume invalid for this test
        post_code: "65100",
        street: "Olympiakatu",
      } as IAddress;

      await expect(
        addressService.updateAddress(addressId, updatedAddress)
      ).rejects.toThrow(
        "Invalid district for the given country, city, and postcode."
      );
    });

    it("should throw BadRequestError if the address ID is missing", async () => {
      await expect(
        addressService.updateAddress("", addressData)
      ).rejects.toThrow("Address ID is required");

      expect(mockAddressSave.called).toBeFalsy();
    });

    it("should throw BadRequestError if the address ID format is invalid", async () => {
      await expect(
        addressService.updateAddress(fakeId, addressData)
      ).rejects.toThrow("Invalid Address ID format");
      expect(mockAddressSave.called).toBeFalsy();
    });

    it("should throw NotFoundError if the address with the given ID is not found", async () => {});
  });

  describe("deleteAddress", () => {
    it("should delete an address successfully", async () => {
      const mockDelete = sinon
        .stub(AddressModel, "findByIdAndDelete")
        .resolves(addressData);

      const result = await addressService.deleteAddress(addressId);

      expect(result).toEqual(addressData);

      expect(mockDelete.calledOnce).toBeTruthy();
      expect(mockDelete.calledWith(addressId)).toBeTruthy();
    });
  });
});
