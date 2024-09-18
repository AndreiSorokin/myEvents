import sinon from "sinon";
import { expect } from "@jest/globals";
import addressService from "../services/addressService";
import { AddressModel } from "../models/address";
import { IAddress } from "../interfaces/IAddress";

describe("AddressService", () => {
  let mockAddressSave: sinon.SinonStub;

  beforeEach(() => {
    mockAddressSave = sinon.stub(AddressModel.prototype, "save");
  });

  afterEach(() => {
    mockAddressSave.restore();
    sinon.restore();
  });

  it("should create an address", async () => {
    const addressData = {
      country: "Finland",
      city: "Helsinki",
      district: "Kallio",
      post_code: "00530",
    } as IAddress;

    const savedAddress = { ...addressData, _id: "someId" };

    mockAddressSave.resolves(savedAddress);

    const result = await addressService.createAddress(addressData);

    expect(result).toEqual(savedAddress);
    expect(mockAddressSave.calledOnce).toBeTruthy();
  });
});
