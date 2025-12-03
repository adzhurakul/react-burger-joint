import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header.tsx';

import { registerUser } from '../services/api';

import type { AppDispatch, RootState } from '../services/store';

import styles from './all-pages.module.css';

export const RegisterPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (): Promise<void> => {
    try {
      await dispatch(registerUser({ name, email, password })).unwrap();
      void navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <div className={styles.container}>
        <div className="text text_type_main-default mb-6">Регистрация</div>

        <div className="mb-6">
          <Input
            name="name"
            placeholder="Имя"
            size="default"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <Input
            name="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <Input
            name="password"
            placeholder="Пароль"
            size="default"
            type={showPassword ? 'text' : 'password'}
            icon={showPassword ? 'HideIcon' : 'ShowIcon'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onIconClick={() => setShowPassword((prev) => !prev)}
          />
        </div>

        {authState.error && (
          <div className="text text_type_main-default text_color_error mb-4">
            {authState.error}
          </div>
        )}

        <div className="mb-20">
          <Button
            onClick={() => void handleRegister()}
            size="small"
            type="primary"
            htmlType="button"
            disabled={!name || !email || !password || authState.loading}
          >
            {authState.loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
        </div>

        <div className={styles.actions}>
          <div className="text text_type_main-default text_color_inactive">
            Уже зарегистрированы?
          </div>
          <Button
            onClick={(): void => void navigate('/login')}
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
