import { Button, Input, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header.tsx';

import { logoutUser, getUser, updateUser } from '../services/api';
import { getCookie } from '../services/auth-slice';

import type { AppDispatch, RootState } from '../services/store';
import type React from 'react';

import styles from './all-pages.module.css';

export const ProfilePage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const refreshToken = useSelector((state: RootState) => state.auth.refreshToken);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [originalName, setOriginalName] = useState('');
  const [originalEmail, setOriginalEmail] = useState('');

  useEffect(() => {
    const token = getCookie('refreshToken');
    if (token) {
      void dispatch(getUser(token)).then((res) => {
        if (res.payload && typeof res.payload !== 'string') {
          setName(res.payload.user.name);
          setEmail(res.payload.user.email);
          setOriginalName(res.payload.user.name);
          setOriginalEmail(res.payload.user.email);
        }
      });
    }
  }, [dispatch]);

  const handleLogout = (): void => {
    if (!refreshToken) return;
    void dispatch(logoutUser(refreshToken)).then(() => void navigate('/'));
  };

  const handleSave = (): void => {
    const token = getCookie('refreshToken');
    if (!token) return;

    void dispatch(updateUser({ accessToken: token, name, email, password })).then(() => {
      // после сохранения обновляем оригинальные значения
      setOriginalName(name);
      setOriginalEmail(email);
      setPassword('');
    });
  };

  const handleCancel = (): void => {
    setName(originalName);
    setEmail(originalEmail);
    setPassword('');
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <main className={`${styles.main} pl-5 pr-5`}>
        <div className={`${styles.left_container}`}>
          <h1 className={`text text_type_main-medium mt-10 mb-5 pl-5`}>Профиль</h1>
          <h1
            className={`text text_type_main-medium mt-10 mb-5 pl-5 text_color_inactive`}
          >
            История заказов
          </h1>
          <h1
            className={`text text_type_main-medium mt-10 mb-5 pl-5 text_color_inactive`}
          >
            Выход
          </h1>
        </div>
        <div className={styles.container}>
          <div className="mb-6">
            <Input
              name="name"
              placeholder="Имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              size="default"
              type="text"
            />
          </div>

          <div className="mb-6">
            <EmailInput
              name="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isIcon={false}
            />
          </div>

          <div className="mb-6">
            <Input
              name="password"
              placeholder="Новый пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="default"
              type={showPassword ? 'text' : 'password'}
              icon={showPassword ? 'HideIcon' : 'ShowIcon'}
              onIconClick={() => setShowPassword((prev) => !prev)}
            />
          </div>

          <div className={styles.actions}>
            <Button onClick={handleSave} size="medium" type="primary" htmlType="button">
              Сохранить
            </Button>
            <Button
              onClick={handleCancel}
              size="medium"
              type="secondary"
              htmlType="button"
            >
              Отмена
            </Button>
            <Button
              onClick={handleLogout}
              size="medium"
              type="secondary"
              htmlType="button"
            >
              Выйти
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
