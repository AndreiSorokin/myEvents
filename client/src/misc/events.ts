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
  latitude?: number;
  longitude?: number;
  city: string;
  country: string;
  post_code?: string;
  district?: string;
  ward?: string;
  street?: string;
  address_number?: string;
  id?: string;
};

export type Event = {
  id: string;
  name: string;
  description: string;
  location: string;
  organizer: string;
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
