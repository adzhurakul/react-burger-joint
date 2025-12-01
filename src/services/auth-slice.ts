import { createSlice } from '@reduxjs/toolkit';

import {
  registerUser,
  forgotPassword,
  resetPassword,
  loginUser,
  refreshToken,
  logoutUser,
} from './api.ts';

import type { AccessToken, AuthUser } from '@utils/types.ts';

type AuthState = {
  user: AuthUser | null;
  accessToken: AccessToken | null;
  refreshToken: string | null;

  loading: boolean;
  error: string | null;
  message: string | null;
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,

  loading: false,
  error: null,
  message: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthState(state) {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },

  extraReducers: (builder) => {
    // --- LOGOUT ---
    builder.addCase(logoutUser.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    });

    builder.addCase(logoutUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.message = action.payload.message;
    });

    builder.addCase(logoutUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Ошибка выхода из системы';
    });

    // --- LOGIN ---
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    });

    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;

      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;

      state.message = 'Успешная авторизация';
    });

    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Ошибка авторизации';
    });

    // --- REFRESH TOKEN ---
    builder.addCase(refreshToken.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    });

    builder.addCase(refreshToken.fulfilled, (state, action) => {
      state.loading = false;

      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;

      state.message = 'Токен обновлён';
    });

    builder.addCase(refreshToken.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Ошибка обновления токена';
    });

    // --- REGISTER ---
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;

      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;

      state.message = 'Успешная регистрация';
    });

    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Ошибка регистрации';
    });

    // --- FORGOT PASSWORD ---
    builder.addCase(forgotPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    });

    builder.addCase(forgotPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    });

    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Ошибка восстановления';
    });

    // --- RESET PASSWORD ---
    builder.addCase(resetPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    });

    builder.addCase(resetPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    });

    builder.addCase(resetPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Ошибка сброса пароля';
    });
  },
});

export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;
