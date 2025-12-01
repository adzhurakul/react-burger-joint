import { createSlice } from '@reduxjs/toolkit';

import {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  refreshToken as refreshTokenThunk,
} from './api.ts';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser, AccessToken } from '@utils/types.ts';

type AuthState = {
  user: AuthUser | null;
  accessToken: AccessToken | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  message: string | null;
};

const REFRESH_TOKEN_NAME = 'refreshToken';

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: getCookie(REFRESH_TOKEN_NAME) ?? null,
  loading: false,
  error: null,
  message: null,
};

type CookieProps = {
  expires?: number | Date | string;
  path?: string;
  domain?: string;
  secure?: boolean;
  [key: string]: string | number | boolean | Date | undefined;
};

export function setCookie(name: string, value: string, props?: CookieProps): void {
  props = props ?? {};
  let exp = props.expires;

  if (typeof exp === 'number' && exp) {
    const d = new Date();
    d.setTime(d.getTime() + exp * 1000);
    exp = props.expires = d;
  }

  if (exp instanceof Date) {
    props.expires = exp.toUTCString();
  }

  const encodedValue = encodeURIComponent(value);
  let updatedCookie = `${name}=${encodedValue}`;

  for (const propName in props) {
    if (Object.prototype.hasOwnProperty.call(props, propName)) {
      updatedCookie += `; ${propName}`;
      const propValue = props[propName];
      if (propValue !== true) {
        updatedCookie += `=${propValue?.toString()}`;
      }
    }
  }

  document.cookie = updatedCookie;
}

export function getCookie(name: string): string | undefined {
  const matches = new RegExp(
    `(?:^|; )${name.replace(/([.$?*|{}()\\[\]\\/+^])/g, '\\$1')}=([^;]*)`
  ).exec(document.cookie);

  return matches ? decodeURIComponent(matches[1]) : undefined;
}

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
    const setPending = (state: AuthState): void => {
      state.loading = true;
      state.error = null;
      state.message = null;
    };

    // --- LOGOUT ---
    builder.addCase(logoutUser.pending, setPending);
    builder.addCase(
      logoutUser.fulfilled,
      (state, action: PayloadAction<{ message: string }>) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.message = action.payload.message;
        setCookie(REFRESH_TOKEN_NAME, '', { expires: -1 });
      }
    );
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Ошибка выхода из системы';
    });

    // --- LOGIN ---
    builder.addCase(loginUser.pending, setPending);
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      setCookie(REFRESH_TOKEN_NAME, state.refreshToken);
      state.message = 'Успешная авторизация';
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Ошибка авторизации';
    });

    // --- REFRESH TOKEN ---
    builder.addCase(refreshTokenThunk.pending, setPending);
    builder.addCase(refreshTokenThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      setCookie(REFRESH_TOKEN_NAME, state.refreshToken);
      state.message = 'Токен обновлён';
    });
    builder.addCase(refreshTokenThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Ошибка обновления токена';
    });

    // --- REGISTER ---
    builder.addCase(registerUser.pending, setPending);
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      setCookie(REFRESH_TOKEN_NAME, state.refreshToken);
      state.message = 'Успешная регистрация';
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Ошибка регистрации';
    });

    // --- FORGOT PASSWORD ---
    builder.addCase(forgotPassword.pending, setPending);
    builder.addCase(forgotPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Ошибка восстановления';
    });

    // --- RESET PASSWORD ---
    builder.addCase(resetPassword.pending, setPending);
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
