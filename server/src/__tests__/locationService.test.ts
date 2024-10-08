import sinon from "sinon";
import { expect } from "@jest/globals";
import locationService from "../services/locationService";
import { LocationModel } from "../models/location";
import { ILocation } from "../interfaces/ILocation";
import { BadRequestError, NotFoundError } from "../errors/ApiError";
import {
  locationId,
  locationData,
  fakeId,
} from "../__tests__/helper/locationHelper";

describe("LocationService", () => {
  let mockLocationSave: sinon.SinonStub;

  beforeEach(() => {
    mockLocationSave = sinon.stub(LocationModel.prototype, "save");
  });

  afterEach(() => {
    mockLocationSave.restore();
    sinon.restore();
  });

  describe("createLocation", () => {
    it("should create a new location successfully", async () => {
      // Arrange: Mock the save behavior to return the location data
      mockLocationSave.resolves(locationData);

      // Act: Create a new location
      const result = await locationService.createLocation(locationData);

      // Assert: Check if the location was created successfully
      expect(result.city).toEqual("Vaasa");
    });
  });
});
