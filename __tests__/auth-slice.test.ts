import authSlice, { clearAuthState } from '../src/services/auth-slice';
import type { AuthUser, AccessToken } from '@utils/types';

jest.mock('../src/services/api', () => ({
  loginUser: { pending: 'loginUserPending', fulfilled: 'loginUserFulfilled', rejected: 'loginUserRejected' },
  logoutUser: { pending: 'logoutUserPending', fulfilled: 'logoutUserFulfilled', rejected: 'logoutUserRejected' },
  registerUser: { pending: 'registerUserPending', fulfilled: 'registerUserFulfilled', rejected: 'registerUserRejected' },
  getUser: { pending: 'getUserPending', fulfilled: 'getUserFulfilled', rejected: 'getUserRejected' },
  updateUser: { pending: 'updateUserPending', fulfilled: 'updateUserFulfilled', rejected: 'updateUserRejected' },
  refreshToken: { pending: 'refreshTokenPending', fulfilled: 'refreshTokenFulfilled', rejected: 'refreshTokenRejected' },
  forgotPassword: { pending: 'forgotPasswordPending', fulfilled: 'forgotPasswordFulfilled', rejected: 'forgotPasswordRejected' },
  resetPassword: { pending: 'resetPasswordPending', fulfilled: 'resetPasswordFulfilled', rejected: 'resetPasswordRejected' },
}));


describe('authSlice', () => {
  const initialState = authSlice.getInitialState();

  const userMock: AuthUser = { name: 'John', email: 'john@example.com' };
  const accessTokenMock: AccessToken = 'Bearer testAccessToken';
  const refreshTokenMock = 'refreshToken';

  // --- sync reducer ---
  it('clearAuthState resets loading, error, message', () => {
    const state = authSlice.reducer(
      { ...initialState, loading: true, error: 'err', message: 'msg' },
      clearAuthState()
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.message).toBeNull();
  });

  // --- helper to test pending action ---
  const testPending = (type: string) => {
    const state = authSlice.reducer(initialState, { type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.message).toBeNull();
  };

  it('sets loading true for all pending actions', () => {
    [
      'loginUserPending',
      'logoutUserPending',
      'registerUserPending',
      'getUserPending',
      'updateUserPending',
      'refreshTokenPending',
      'forgotPasswordPending',
      'resetPasswordPending',
    ].forEach(testPending);
  });

  // --- fulfilled actions ---
  it('loginUser.fulfilled sets user, tokens, message, loading=false', () => {
    const state = authSlice.reducer(initialState, {
      type: 'loginUserFulfilled',
      payload: { user: userMock, accessToken: accessTokenMock, refreshToken: refreshTokenMock },
    });
    expect(state.user).toEqual(userMock);
    expect(state.accessToken).toBe(accessTokenMock);
    expect(state.refreshToken).toBe(refreshTokenMock);
    expect(state.message).toBe('Успешная авторизация');
    expect(state.loading).toBe(false);
  });

  it('logoutUser.fulfilled clears user and tokens, sets message', () => {
    const state = authSlice.reducer(
      { ...initialState, user: userMock, accessToken: accessTokenMock, refreshToken: refreshTokenMock },
      { type: 'logoutUserFulfilled', payload: { message: 'Выход успешен' } }
    );
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.refreshToken).toBeNull();
    expect(state.message).toBe('Выход успешен');
    expect(state.loading).toBe(false);
  });

  it('registerUser.fulfilled sets user, tokens, message', () => {
    const state = authSlice.reducer(initialState, {
      type: 'registerUserFulfilled',
      payload: { user: userMock, accessToken: accessTokenMock, refreshToken: refreshTokenMock },
    });
    expect(state.user).toEqual(userMock);
    expect(state.accessToken).toBe(accessTokenMock);
    expect(state.refreshToken).toBe(refreshTokenMock);
    expect(state.message).toBe('Успешная регистрация');
  });

  it('getUser.fulfilled sets user and message', () => {
    const state = authSlice.reducer(initialState, {
      type: 'getUserFulfilled',
      payload: { user: userMock },
    });
    expect(state.user).toEqual(userMock);
    expect(state.message).toBe('Данные пользователя загружены');
  });

  it('updateUser.fulfilled sets user, tokens, message', () => {
    const state = authSlice.reducer(initialState, {
      type: 'updateUserFulfilled',
      payload: { user: userMock, accessToken: accessTokenMock, refreshToken: refreshTokenMock },
    });
    expect(state.user).toEqual(userMock);
    expect(state.accessToken).toBe(accessTokenMock);
    expect(state.refreshToken).toBe(refreshTokenMock);
    expect(state.message).toBe('Данные пользователя обновлены');
  });

  it('refreshTokenThunk.fulfilled sets tokens and message', () => {
    const payload = { accessToken: accessTokenMock, refreshToken: refreshTokenMock };
    const state = authSlice.reducer(initialState, { type: 'refreshTokenFulfilled', payload: payload });

    expect(state.accessToken).toBe(payload.accessToken);
    expect(state.refreshToken).toBe(payload.refreshToken);
    expect(state.message).toBe('Токен обновлён');
  });

  it('forgotPassword.fulfilled sets message and canResetPassword=true', () => {
    const state = authSlice.reducer(initialState, {
      type: 'forgotPasswordFulfilled',
      payload: { message: 'Проверьте почту' },
    });
    expect(state.message).toBe('Проверьте почту');
    expect(state.canResetPassword).toBe(true);
  });

  it('resetPassword.fulfilled sets message and canResetPassword=false', () => {
    const state = authSlice.reducer(initialState, {
      type: 'resetPasswordFulfilled',
      payload: { message: 'Пароль сброшен' },
    });
    expect(state.message).toBe('Пароль сброшен');
    expect(state.canResetPassword).toBe(false);
  });

  // --- rejected actions ---
  const testRejected = (type: string, defaultError: string) => {
    const state = authSlice.reducer(initialState, { type });
    expect(state.loading).toBe(false);
    expect(state.error).toBe(defaultError);
  };

  it('sets default error for all rejected actions without payload', () => {
    [
      ['loginUserRejected', 'Ошибка авторизации'],
      ['logoutUserRejected', 'Ошибка выхода из системы'],
      ['registerUserRejected', 'Ошибка регистрации'],
      ['getUserRejected', 'Ошибка загрузки данных пользователя'],
      ['updateUserRejected', 'Ошибка обновления данных пользователя'],
      ['refreshTokenRejected', 'Ошибка обновления токена'],
      ['forgotPasswordRejected', 'Ошибка восстановления'],
      ['resetPasswordRejected', 'Ошибка сброса пароля'],
    ].forEach(([type, defaultError]) => testRejected(type, defaultError));
  });

  it('sets error from payload if provided', () => {
    const state = authSlice.reducer(initialState, {
      type: 'loginUserRejected',
      payload: 'Сервер недоступен',
    });
    expect(state.error).toBe('Сервер недоступен');
  });
});
