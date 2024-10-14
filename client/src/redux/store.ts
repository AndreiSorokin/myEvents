import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../api/apiSlice";
import addressReducer from "./slices/addressesSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { authApi } from "../api/authSlice";
import { userApi } from "@/api/userSlice";

const store = configureStore({
  reducer: {
    address: addressReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      apiSlice.middleware,
      authApi.middleware,
      userApi.middleware
    ),
});

export type AppState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export default store;
