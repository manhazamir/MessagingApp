import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  contactsResponse: null,
  loading: false,
  error: false,

  // thread
  threadResponse: null,

  //group

  fetchGroupResponse: null,
};

export const getContacts = createAsyncThunk(
  "contacts/getUsers",
  async (thunkAPI) => {
    try {
      const auth = localStorage.getItem("token");

      const response = await axios.get(
        process.env.REACT_APP_SERVER_API + "/get-contacts/",
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

export const createNewGroup = createAsyncThunk(
  "contacts/createGroup",
  async (groupData, thunkAPI) => {
    try {
      const auth = localStorage.getItem("token");
      const response = await axios.post(
        process.env.REACT_APP_SERVER_API + "/new-group/",
        groupData,
        {
          headers: {
            Authorization: `Token ${auth}`,
          },
        }
      );
      if (response) {
        console.log("group response", response?.data);
        return response.data;
      }
    } catch (error) {
      const message =
        (error.response && error.response.data) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getGroups = createAsyncThunk(
  "contacts/getGroups",
  async (thunkAPI) => {
    try {
      const auth = localStorage.getItem("token");
      const response = await axios.get(
        process.env.REACT_APP_SERVER_API +
          "/get-groups/" +
          localStorage.getItem("userID"),

        {
          headers: {
            Authorization: `Token ${auth}`,
          },
        }
      );
      if (response) {
        console.log("fetch group response", response?.data);
        return response.data;
      }
    } catch (error) {
      const message =
        (error.response && error.response.data) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createUsersThread = createAsyncThunk(
  "contacts/postThread",
  async (data, thunkAPI) => {
    try {
      const auth = localStorage.getItem("token");
      console.log("auth token", auth);
      const response = await axios.post(
        process.env.REACT_APP_SERVER_API + "/thread/",
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
      })
      .addCase(createNewGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNewGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.fetchGroupResponse = [
          ...state.fetchGroupResponse,
          action.payload,
        ];
      })
      .addCase(createNewGroup.rejected, (state, action) => {
        state.loading = false;

        state.error = true;
      })

      .addCase(getGroups.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.fetchGroupResponse = action.payload;
      })
      .addCase(getGroups.rejected, (state, action) => {
        state.loading = false;
        state.fetchGroupResponse = action.payload;
        state.error = true;
      })

      .addCase(createUsersThread.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUsersThread.fulfilled, (state, action) => {
        state.loading = false;
        state.threadResponse = action.payload;
      })
      .addCase(createUsersThread.rejected, (state, action) => {
        state.loading = false;
        state.threadResponse = action.payload;
        state.error = true;
      });
  },
});

export const { reset } = contactsSlice.actions;
export default contactsSlice.reducer;
