import { createSlice } from '@reduxjs/toolkit';

import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@utils/types.ts';

import {
  forgotPassword,
  getUser,
  loginUser,
  logoutUser,
  refreshToken as refreshTokenThunk,
  registerUser,
  resetPassword,
  updateUser,
} from './api.ts';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { AccessToken, AuthUser } from '@utils/types.ts';

type AuthState = {
  user: AuthUser | null;
  accessToken: AccessToken | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  message: string | null;
  canResetPassword: boolean | null;
};

const initialState: AuthState = {
  user: null,
  accessToken: getLocal(ACCESS_TOKEN_NAME) ?? null,
  refreshToken: getLocal(REFRESH_TOKEN_NAME) ?? null,
  loading: false,
  error: null,
  message: null,
  canResetPassword: false,
};

export type LocalStorageProps = {
  expires?: number | Date;
};

type LocalStorageRecord<T> = {
  value: T;
  expires: string | null;
};

export function setLocal<T>(name: string, value: T, props?: LocalStorageProps): void {
  props = props ?? {};
  let exp = props.expires;

  if (typeof exp === 'number' && exp) {
    const d = new Date();
    d.setTime(d.getTime() + exp * 1000);
    exp = d;
  }

  const record: LocalStorageRecord<T> = {
    value,
    expires: exp instanceof Date ? exp.toISOString() : null,
  };

  localStorage.setItem(name, JSON.stringify(record));
}

export function getLocal<T>(name: string): T | undefined {
  const raw = localStorage.getItem(name);
  if (!raw) return undefined;

  try {
    const record = JSON.parse(raw) as LocalStorageRecord<T>;

    if (record.expires) {
      const expDate = new Date(record.expires);
      if (Date.now() > expDate.getTime()) {
        localStorage.removeItem(name);
        return undefined;
      }
    }

    return record.value;
  } catch {
    return undefined;
  }
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

    // --- UPDATE USER ---
    builder.addCase(updateUser.pending, setPending);
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.message = 'Данные пользователя обновлены';

      if (state.refreshToken) {
        setLocal<string>(ACCESS_TOKEN_NAME, state.accessToken, { expires: 1200 });
        setLocal<string>(REFRESH_TOKEN_NAME, state.refreshToken);
      }
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Ошибка обновления данных пользователя';
    });

    // --- GET USER ---
    builder.addCase(getUser.pending, setPending);
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.message = 'Данные пользователя загружены';
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Ошибка загрузки данных пользователя';
    });

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

        setLocal<string>(ACCESS_TOKEN_NAME, '');
        setLocal<string>(REFRESH_TOKEN_NAME, '');
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

      setLocal<string>(ACCESS_TOKEN_NAME, state.accessToken, { expires: 1200 });
      setLocal<string>(REFRESH_TOKEN_NAME, state.refreshToken);

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

      setLocal<string>(ACCESS_TOKEN_NAME, state.accessToken, { expires: 1200 });
      setLocal<string>(REFRESH_TOKEN_NAME, state.refreshToken);

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

      setLocal<string>(ACCESS_TOKEN_NAME, state.accessToken, { expires: 1200 });
      setLocal<string>(REFRESH_TOKEN_NAME, state.refreshToken);

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
      state.canResetPassword = true;
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.loading = false;
      state.canResetPassword = false;
      state.error = action.payload ?? 'Ошибка восстановления';
    });

    // --- RESET PASSWORD ---
    builder.addCase(resetPassword.pending, setPending);
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.canResetPassword = false;
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload ?? 'Ошибка сброса пароля';
    });
  },
});

export const { clearAuthState } = authSlice.actions;
export default authSlice.reducer;
