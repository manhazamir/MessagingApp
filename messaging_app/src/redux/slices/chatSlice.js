import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  // connection set
  socketConnection: null,

  // broadcast
  broadcastResponse: null,
  loading: false,
  error: false,
};

export const sendBroadcastMessage = createAsyncThunk(
  "chat/broadcast",
  async (data, thunkAPI) => {
    try {
      const auth = localStorage.getItem("token");
      console.log("auth token", auth);
      const response = await axios.post(
        process.env.REACT_APP_SERVER_API + "/broadcast-message/",
        data,
        {
          headers: {
            Authorization: `Token ${auth}`,
          },
        }
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

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    reset: (state) => {
      state.broadcastResponse = {};
      state.loading = false;
      state.error = false;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(sendBroadcastMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendBroadcastMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.broadcastResponse = action.payload;
      })
      .addCase(sendBroadcastMessage.rejected, (state, action) => {
        state.loading = false;
        state.broadcastResponse = action.payload;
        state.error = true;
      });
  },
});

export const { reset } = chatSlice.actions;
export default chatSlice.reducer;
