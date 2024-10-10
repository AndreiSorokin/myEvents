import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import { Address, InitialStateAddress } from "../../misc/types";


const initialState: Address[] = [InitialStateAddress];

export const fetchAllAddresses = createAsyncThunk(
   "fetchAllAddresses",
   async (_, { rejectWithValue }) => {
      try {
         const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/addresses`);
         const addresses = response.data;
         return addresses;
      } catch (error) {
         if (axios.isAxiosError(error) && error.response) {
            return rejectWithValue(error.response.data);
         } else {
            return rejectWithValue({ message: "Internal error" });
         }
      }
   }
)

const addressesSlice = createSlice({
   name: "addresses",
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(fetchAllAddresses.fulfilled, (state, action) => {
            return action.payload;
         })
         .addCase(fetchAllAddresses.rejected, (state, action) => {
            console.error("Failed to fetch addresses:", action.payload);
         });
   },
});

const addressReducer = addressesSlice.reducer;
export default addressReducer;