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

describe("AddressService", () => {
  let mockAddressSave: sinon.SinonStub;

  beforeEach(() => {
    mockAddressSave = sinon.stub(AddressModel.prototype, "save");
  });

  afterEach(() => {
    mockAddressSave.restore();
    sinon.restore();
  });

  describe("createAddress", () => {
    it("Should create an address successfully", async () => {
      const savedAddress = { ...addressData, _id: addressId };

      mockAddressSave.resolves(savedAddress);

      const result = await addressService.createAddress(addressData);

      expect(result).toEqual(savedAddress);
      expect(result.city).toEqual("Helsinki");
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
      ).rejects.toThrow("Country is required");
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
      ).rejects.toThrow("City is required");
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
    it("Should update an address successfully", async () => {
      const updatedAddress = {
        country: "Finland",
        city: "Vaasa",
        district: "Centrum",
        post_code: "65100",
        street: "Olympiakatu",
      } as IAddress;

      const mockUpdate = sinon
        .stub(AddressModel, "findByIdAndUpdate")
        .resolves(updatedAddress);

      const result = await addressService.updateAddress(addressId, addressData);

      expect(result).toEqual(updatedAddress);
      expect(result?.city).toEqual("Vaasa");
      expect(result?.district).toEqual("Centrum");
      expect(mockUpdate.calledOnce).toBeTruthy();
      expect(mockUpdate.calledWith(addressId, addressData)).toBeTruthy();
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

    it("should throw NotFoundError if the address with the given ID is not found", async () => {
      const mockFindByIdAndUpdate = sinon
        .stub(AddressModel, "findByIdAndUpdate")
        .resolves(null);

      await expect(
        addressService.updateAddress(addressId, addressData)
      ).rejects.toThrow(NotFoundError);

      expect(mockFindByIdAndUpdate.calledOnce).toBeTruthy();
      expect(mockFindByIdAndUpdate.calledWith(addressId, addressData)).toBeTruthy();
    });
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
    })
  });
});
