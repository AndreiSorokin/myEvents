import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Address } from "../misc/types";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BASE_URL }),
  endpoints: (builder) => ({
    getAddresses: builder.query<Address[], void>({
      query: () => "/addresses",
    }),
  }),
});

export const { useGetAddressesQuery } = apiSlice;
