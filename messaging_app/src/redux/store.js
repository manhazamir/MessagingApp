import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import contactsSlice from "./slices/contactsSlice";
export const store = configureStore({
  reducer: {
    auth: authSlice,
    contacts: contactsSlice,
  },
  middleware: [
    ...getDefaultMiddleware({
      serializableCheck: false,
    }),
  ],
});
