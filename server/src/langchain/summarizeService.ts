import { IEvent } from "../interfaces/IEvent";
import { ILocation } from "../interfaces/ILocation";

// TODO: Summarize Event
export const summarizeEvent = (
  event: Partial<IEvent>,
  location: ILocation,
  organizerName: string
): string => {
  return `${event.name} is a ${event.event_type} taking place at ${location.address_number} ${location.street}, ${location.ward}, ${location.district}, ${location.city}, ${location.country} on ${event.date}. 
  This event is organized by ${organizerName}. The event costs ${event.price} EUR and more details can be found at ${event.event_link}.`;
};
