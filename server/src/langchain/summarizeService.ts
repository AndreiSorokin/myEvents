import { IEvent } from "../interfaces/IEvent";
import { LocationModel } from "../models/location";
import { UserModel } from "../models/user";
import { Event } from "../utils/eventSeeding";

// TODO: Create embeddings for each event record
export async function createEventSummary(
  event: Partial<IEvent> | Event,
  locationId: string,
  organizerId: string
): Promise<string> {
  return new Promise(async (resolve) => {
    const location = await LocationModel.findById(locationId).lean().exec();
    const organizer = await UserModel.findById(organizerId).lean().exec();

    const eventDetails = `${event.name} is a ${event.event_type}`;
    const description = event.description;
    const eventDate = event.date;
    const eventPrice = event.price;
    const eventLink = event.event_link;

    const summary = `${eventDetails}. Description: ${description}. Country to host the event: ${location?.country}. City to host the event: ${location?.city} taking place at ${location?.address_number} ${location?.street}, ${location?.ward}, ${location?.district}. Organizer's name: ${organizer?.name}. Date to be organized: ${eventDate}. Cost per ticket: ${eventPrice} EUR. More information can be found at ${eventLink}`;

    resolve(summary);
  });
}
