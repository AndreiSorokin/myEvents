import { IAddress } from "../interfaces/IAddress";
import { ILocation } from "../interfaces/ILocation";
import { LocationModel } from "../models/location";

export class LocationService {
  static async createLocation(
    latitude: number,
    longitude: number,
    address: IAddress
  ): Promise<ILocation> {
    const location = new LocationModel({
      latitude,
      longitude,
      address,
    });

    return location.save();
  }

  static async getLocationById(id: string): Promise<ILocation | null> {
    return LocationModel.findById(id).populate("address");
  }
}
