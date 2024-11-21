import { Location } from "../misc/events";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const locationsApi = createApi({
  reducerPath: "locationsApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    createLocation: builder.mutation<Location, Partial<Location>>({
      query: (locationData) => ({
        url: "/locations",
        method: "POST",
        body: locationData,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        const { data } = await queryFulfilled;

        if (data.id) {
          // Save location id to localStorage
          localStorage.setItem("locationId", data.id);
        }
      },
    }),

    getLocations: builder.query<
      Location[],
      { limit?: number; page?: number; searchQuery?: string }
    >({
      query: ({ limit, page, searchQuery }) => ({
        url: "/locations",
        params: { limit, page, searchQuery },
      }),
    }),

    getLocationById: builder.query<Location, string>({
      query: (id) => `/locations/${id}`,
    }),

    updateLocation: builder.mutation<
      Location,
      { id: string; body: Partial<Location> }
    >({
      query: ({ id, body }) => ({
        url: `/locations/${id}`,
        method: "PUT",
        body,
      }),
    }),

    deleteLocation: builder.mutation<void, string>({
      query: (id) => ({
        url: `/locations/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateLocationMutation,
  useGetLocationsQuery,
  useGetLocationByIdQuery,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
} = locationsApi;
