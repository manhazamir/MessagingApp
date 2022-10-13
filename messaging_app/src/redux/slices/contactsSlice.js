import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  contactsResponse: null,
  loading: false,
  error: false,
};

// const auth = localStorage.getItem("token");

export const getContacts = createAsyncThunk(
  "contacts/getUsers",
  async (thunkAPI) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_SERVER_API + "/get-contacts/"
        // {
        //   headers: {
        //     Authorization: `Token ${auth}`,
        //   },
        // }
      );
      return response.data;
    } catch (error) {
      const message =
        (error.response && error.response.data) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    reset: (state) => {
      state.contactsResponse = {};
      state.loading = false;
      state.error = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getContacts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getContacts.fulfilled, (state, action) => {
        state.loading = false;
        state.contactsResponse = action.payload;
      })
      .addCase(getContacts.rejected, (state, action) => {
        state.loading = false;
        state.contactsResponse = action.payload;
        state.error = true;
      });
  },
});

export const { reset } = contactsSlice.actions;
export default contactsSlice.reducer;
