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

export type Event = {
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
};

export const InitialStateEvent: Event = {
   name: '',
   description: '',
   location: '',
   organizer: '',
   date: new Date(),
   price: 0,
   event_link: '',
   event_type: EventType.Conference,
   attendees: [],
   images: [],
};