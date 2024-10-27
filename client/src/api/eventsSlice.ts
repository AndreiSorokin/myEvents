import { Events, Event, EventType } from "../misc/events";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:3003/api/v1";

export const eventsApi = createApi({
  reducerPath: "eventsApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({

    
    getEvents: builder.query<
      Events,
      {
        limit?: number;
        page?: number;
        searchQuery?: string;
        eventTypeQuery?: EventType;
        date?: string;
        minPrice?: number;
        maxPrice?: number;
      }
    >({
      query: ({
        limit,
        page,
        searchQuery,
        eventTypeQuery,
        date,
        minPrice,
        maxPrice,
      }) => ({
        url: "/events",
        params: {
          limit,
          page,
          searchQuery,
          eventTypeQuery,
          date,
          minPrice,
          maxPrice,
        },
      }),
    }),


    getEventById: builder.query<Event, string>({
      query: (id) => `/events/${id}`,
    }),

    // Mutation to start AI chat
    aiChat: builder.mutation<
      { threadId: string; response: string },
      { message: string }
    >({
      query: ({ message }) => ({
        url: `/events/ai`,
        method: "POST",
        body: { message },
      }),
    }),

    // Mutation to continue AI chat thread
    continueAiChat: builder.mutation<
      { response: string },
      { message: string; threadId: string }
    >({
      query: ({ message, threadId }) => ({
        url: `/events/ai/${threadId}`,
        method: "POST",
        body: { message },
      }),
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventByIdQuery,
  useAiChatMutation,
  useContinueAiChatMutation,
} = eventsApi;
