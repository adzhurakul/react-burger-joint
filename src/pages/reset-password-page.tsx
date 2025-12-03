import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header.tsx';

import { resetPassword } from '../services/api';

import type { AppDispatch } from '@services/store.ts';
import type React from 'react';

import styles from './all-pages.module.css';

export const ResetPasswordPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const togglePasswordVisibility = (): void => setShowPassword((prev) => !prev);

  const handleResetPassword = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const result = await dispatch(resetPassword({ password, token })).unwrap();

      if (result.success) {
        setMessage(result.message);
        setTimeout(() => void navigate('/login'), 1500);
      }
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <div className={styles.container}>
        <div className="text text_type_main-default mb-6">Сброс пароля</div>

        <div className="mb-6">
          <Input
            errorText="Ошибка"
            icon={showPassword ? 'HideIcon' : 'ShowIcon'}
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            onIconClick={togglePasswordVisibility}
            placeholder="Введите новый пароль"
            size="default"
            type={showPassword ? 'text' : 'password'}
            value={password}
          />
        </div>

        <div className="mb-6">
          <Input
            errorText="Ошибка"
            name="token"
            onChange={(e) => setToken(e.target.value)}
            placeholder="Введите код из письма"
            size="default"
            type="text"
            value={token}
          />
        </div>

        {error && (
          <div className="text text_type_main-default text_color_error mb-4">
            {error}
          </div>
        )}
        {message && (
          <div className="text text_type_main-default text_color_success mb-4">
            {message}
          </div>
        )}

        <div className="mb-20">
          <Button
            onClick={() => void handleResetPassword()}
            size="small"
            type="primary"
            htmlType="button"
            disabled={loading || !password || !token}
          >
            {loading ? 'Отправка...' : 'Сохранить'}
          </Button>
        </div>

        <div className={`${styles.actions} mb-4`}>
          <div className="text text_type_main-default text_color_inactive">
            Вспомнили пароль?
          </div>
          <Button
            onClick={() => void navigate('/login')}
            size="medium"
            type="secondary"
            htmlType="button"
          >
            Войти
          </Button>
        </div>
      </div>
    </div>
  );
};
