import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { User } from "../../types/user.interface";
import { AuthService } from "../../services/auth.service";

// Inside a slice of the redux we will have

// 1. Interface to define those variable that store inside the redux store
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// 2. Intitial state of those state
const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// 3. Creating slice for those action that doesn't require API call
// Note that if some actions need performing API call -> use createAsyncThunk

export const loginThunk = createAsyncThunk(
  // thunk name 
  "auth/login",
  async (
    // Value of payload
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const data = await AuthService.login(email, password);
      return data.user;
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed!");
    }
  },
);

export const getUserProfileThunk = createAsyncThunk(
  "auth/getUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const user = await AuthService.getProfileFromToken();
      return user;
    } catch (error: any) {
      return rejectWithValue(error.message || "There's no user profile");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    logoutAction: (state) => {
      AuthService.logout();
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // LoginThunk processing
    builder.addCase(loginThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.loading = false;
      // action.payload is the data returned from the thunk
      state.user = action.payload;
    });

    builder.addCase(loginThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // getUserProfileThunk processing
    builder.addCase(getUserProfileThunk.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getUserProfileThunk.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.user = action.payload;
        state.isAuthenticated = true;
      } else {
        state.user = null;
        state.isAuthenticated = false;
      }
    });

    builder.addCase(getUserProfileThunk.rejected, (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    });
  },
});

// 4. Export
export const { logoutAction } = authSlice.actions;
export default authSlice.reducer;
