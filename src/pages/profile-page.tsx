import { Button, Input, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header.tsx';

import { logoutUser } from '../services/api';

import type { AppDispatch, RootState } from '../services/store';
import type React from 'react';

import styles from './profile-page.module.css';

export const ProfilePage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogout = (): void => {
    if (!user) return;
    const refreshToken = 'state.auth.refreshToken'; // todo
    void dispatch(logoutUser(refreshToken)).then(() => {
      void navigate('/');
    });
  };

  const handleSave = (): void => {
    // dispatch(updateUserProfile({ name, email, password })) ...
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <div className={styles.container}>
        <h2 className="text text_type_main-large mb-6">Профиль</h2>

        <div className={styles.field}>
          <Input
            name="name"
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="default"
            type="text"
          />
        </div>

        <div className={styles.field}>
          <EmailInput
            name="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isIcon={false}
          />
        </div>

        <div className={styles.field}>
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
            onClick={handleLogout}
            size="medium"
            type="secondary"
            htmlType="button"
          >
            Выйти
          </Button>
        </div>
      </div>
    </div>
  );
};
