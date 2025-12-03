import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header.tsx';

import { loginUser } from '../services/api';

import type { AppDispatch } from '../services/store';

import styles from './all-pages.module.css';

export const LoginPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (): Promise<void> => {
    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      if (result.success) {
        void navigate('/');
      }
    } catch (err) {
      console.error('Ошибка авторизации:', err);
    }
  };

  const togglePasswordVisibility = (): void => setShowPassword((prev) => !prev);

  return (
    <div className={styles.app}>
      <AppHeader />
      <div className={styles.container}>
        <div className="text text_type_main-default mb-6">Вход</div>

        <div className="mb-6">
          <Input
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
            value={email}
          />
        </div>

        <div className="mb-6">
          <Input
            errorText="Ошибка"
            icon={showPassword ? 'HideIcon' : 'ShowIcon'}
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            onIconClick={togglePasswordVisibility}
            placeholder="Пароль"
            size="default"
            type={showPassword ? 'text' : 'password'}
            value={password}
          />
        </div>

        <div className="mb-20">
          <Button
            onClick={() => void handleLogin()}
            size="small"
            type="primary"
            htmlType="button"
          >
            Войти
          </Button>
        </div>

        <div className={`${styles.actions} mb-4`}>
          <div className="text text_type_main-default text_color_inactive">
            Вы - новый пользователь?
          </div>
          <Button
            onClick={() => void navigate('/register')}
            size="medium"
            type="secondary"
            htmlType="button"
          >
            Зарегистрироваться
          </Button>
        </div>

        <div className={styles.actions}>
          <div className="text text_type_main-default text_color_inactive">
            Забыли пароль?
          </div>
          <Button
            onClick={() => void navigate('/forgot-password')}
            size="medium"
            type="secondary"
            htmlType="button"
          >
            Восстановить пароль
          </Button>
        </div>
      </div>
    </div>
  );
};
