import sinon from "sinon";
import { expect } from "@jest/globals";
import eventService from "../services/eventService";
import { EventModel } from "../models/event";
import { UserModel } from "../models/user";
import { BadRequestError, InternalServerError } from "../errors/ApiError";
import { IEvent } from "../interfaces/IEvent";
import { EventType } from "../enums/EventType";

describe("createEvent", () => {
  let userFindStub: sinon.SinonStub;
  let eventFindStub: sinon.SinonStub;
  let eventSaveStub: sinon.SinonStub;

  const mockEvent: Partial<IEvent> = {
    name: "Sample Event",
    description: "An amazing event",
    location: { latitude: 40.73061, longitude: -73.935242 } as any,
    organizer: "organizer_id",
    date: new Date(),
    price: 20,
    event_link: "http://example.com",
    event_type: EventType.Conference,
    attendees: [],
    images: [],
  };

  beforeEach(() => {
    userFindStub = sinon.stub(UserModel, "findById");
    eventFindStub = sinon.stub(EventModel, "findOne");
    eventSaveStub = sinon.stub(EventModel.prototype, "save");
  });

  afterEach(() => {
    sinon.restore(); // Restore all stubs and mocks
  });

  it("should create a new event successfully", async () => {
    userFindStub.resolves({ _id: "organizer_id" });
    eventFindStub.resolves(null); // No event with same name
    eventSaveStub.resolves(mockEvent);

    const result = await eventService.createEvent(mockEvent as IEvent);

    expect(result).toEqual(mockEvent);
    expect(userFindStub.calledOnce).toBeTruthy();
    expect(eventFindStub.calledOnce).toBeTruthy();
    expect(eventSaveStub.calledOnce).toBeTruthy();
  });

  it("should throw BadRequestError if organizer does not exist", async () => {
    userFindStub.resolves(null); // No organizer found

    await expect(eventService.createEvent(mockEvent as IEvent)).rejects.toThrow(
      BadRequestError
    );
  });

  it("should throw BadRequestError if event with the same name exists", async () => {
    userFindStub.resolves({ _id: "organizer_id" });
    eventFindStub.resolves(mockEvent); // Event with same name exists

    await expect(eventService.createEvent(mockEvent as IEvent)).rejects.toThrow(
      BadRequestError
    );
  });

  it("should throw BadRequestError if required fields are missing", async () => {
    const incompleteEventData = { name: "Incomplete Event" } as Partial<IEvent>; // Missing fields

    await expect(
      eventService.createEvent(incompleteEventData as IEvent)
    ).rejects.toThrow(BadRequestError);
  });
});

describe("findEventById", () => {
  let findByIdStub: sinon.SinonStub;

  const mockEvent: Partial<IEvent> = {
    name: "Sample Event",
    description: "An amazing event",
    location: { latitude: 40.73061, longitude: -73.935242 } as any,
    organizer: "organizer_id",
    date: new Date(),
    price: 20,
    event_link: "http://example.com",
    event_type: EventType.Conference,
    attendees: [],
    images: [],
  };

  beforeEach(() => {
    findByIdStub = sinon.stub(EventModel, "findById").returns({
      populate: sinon.stub().resolves(mockEvent),
    } as any);
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return an event by its ID", async () => {
    const result = await eventService.findEventById("event_id");

    expect(result).toEqual(mockEvent);
    expect(findByIdStub.calledOnce).toBeTruthy();
  });

  it("should throw InternalServerError if the event is not found", async () => {
    findByIdStub.returns({ populate: sinon.stub().resolves(null) });

    await expect(eventService.findEventById("invalid_id")).rejects.toThrow(
      InternalServerError
    );
  });
});

describe("updateEvent", () => {
  let findByIdAndUpdateStub: sinon.SinonStub;

  const mockEvent = {
    _id: "66f810ce766adcd06ab40c10",
    name: "Updated Event",
  };

  beforeEach(() => {
    findByIdAndUpdateStub = sinon
      .stub(EventModel, "findByIdAndUpdate")
      .resolves(mockEvent);
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should update the event successfully", async () => {
    const result = await eventService.updateEvent("66f810ce766adcd06ab40c10", {
      name: "Updated Event",
    });

    expect(result).toEqual(mockEvent);
    expect(findByIdAndUpdateStub.calledOnce).toBeTruthy();
  });

  it("should throw InternalServerError if the event is not found", async () => {
    findByIdAndUpdateStub.resolves(null);

    await expect(
      eventService.updateEvent("invalid_id", { name: "Updated Event" })
    ).rejects.toThrow(InternalServerError);
  });
});

describe("deleteEvent", () => {
  let findByIdAndDeleteStub: sinon.SinonStub;

  beforeEach(() => {
    findByIdAndDeleteStub = sinon.stub(EventModel, "findByIdAndDelete");
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should delete the event if it exists", async () => {
    // Simulate the case where the event is found and deleted
    findByIdAndDeleteStub.resolves({
      _id: "66f810ce766adcd06ab40c10",
      name: "Test Event",
    });

    await eventService.deleteEvent("66f810ce766adcd06ab40c10");

    expect(findByIdAndDeleteStub.calledOnce).toBeTruthy();
    expect(
      findByIdAndDeleteStub.calledWith("66f810ce766adcd06ab40c10")
    ).toBeTruthy();
  });

  it("should throw InternalServerError if the event is not found", async () => {
    // Simulate the case where the event isn't found
    findByIdAndDeleteStub.resolves(null);

    await expect(
      eventService.deleteEvent("invalid_66f810ce766adcd06ab40c10")
    ).rejects.toThrow(InternalServerError);
    expect(findByIdAndDeleteStub.calledOnce).toBeTruthy();
    expect(
      findByIdAndDeleteStub.calledWith("invalid_66f810ce766adcd06ab40c10")
    ).toBeTruthy();
  });
});

//TO-DO: add test case for fetch all events with pagination
