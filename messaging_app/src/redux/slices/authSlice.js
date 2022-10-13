import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loggedInUser: null,
  loginResponse: null,
  signupResponse: null,
  loading: false,
  error: false,
};

export const login = createAsyncThunk("auth/login", async (data, thunkAPI) => {
  try {
    const response = await axios.post(
      process.env.REACT_APP_SERVER_API + "/login/",
      data
    );
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data) ||
      error.message ||
      error.toString();

    return thunkAPI.rejectWithValue(message);
  }
});

export const signup = createAsyncThunk(
  "auth/signup",
  async (data, thunkAPI) => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_SERVER_API + "/signup/",
        data
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

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.loginResponse = {};
      state.loading = false;
      state.error = false;
    },
    setUser: (state, action) => {
      state.loggedInUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.loginResponse = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;

        state.loginResponse = action.payload;
        state.error = true;
      })
      // signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.signupResponse = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;

        state.signupResponse = action.payload;
        state.error = true;
      });
  },
});

export const { reset, setUser } = authSlice.actions;
export default authSlice.reducer;
