import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
  token: string | null;
  nickname: string | null;
  profileImageUrl: string | null;
  userId: number | null;
  email: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  token: null,
  nickname: null,
  profileImageUrl: null,
  userId: null,
  email: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthState>) => {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.nickname = action.payload.nickname;
      state.profileImageUrl = action.payload.profileImageUrl;
      state.userId = action.payload.userId;
      state.email = action.payload.email;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.token = null;
      state.nickname = null;
      state.profileImageUrl = null;
      state.userId = null;
      state.email = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
