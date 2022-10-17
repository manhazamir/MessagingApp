import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import contactsSlice from "./slices/contactsSlice";
import chatSlice from "./slices/chatSlice";
export const store = configureStore({
  reducer: {
    auth: authSlice,
    contacts: contactsSlice,
    chat: chatSlice,
  },
  middleware: [
    ...getDefaultMiddleware({
      serializableCheck: false,
    }),
  ],
});
