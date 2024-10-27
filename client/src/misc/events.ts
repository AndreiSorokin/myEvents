import { Organizer } from "./user";

export enum EventType {
  Conference = "conference",
  Workshop = "workshop",
  Meetup = "meetup",
  Concert = "concert",
  Webinar = "webinar",
  Networking = "networking",
  Hackathon = "hackathon",
  Exhibition = "exhibition",
  Festival = "festival",
  Seminar = "seminar",
}

export type Location = {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  post_code: string;
};

export type Event = {
  id: string;
  name: string;
  description: string;
  location: Location;
  organizer: Organizer;
  date: Date;
  price: number;
  event_link: string;
  event_type: EventType;
  attendees: string[];
  images: string[];
  summary: string;
};

export type Events = {
  events: Event[];
};
