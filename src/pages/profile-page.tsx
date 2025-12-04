import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header.tsx';
import { ACCESS_TOKEN_NAME, REFRESH_TOKEN_NAME } from '@utils/types.ts';

import { logoutUser, getUser, updateUser } from '../services/api';
import { getLocal } from '../services/auth-slice';

import type { AppDispatch } from '../services/store';

import styles from './all-pages.module.css';

export const ProfilePage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const isProfileActive = location.pathname === '/profile';
  const isOrdersActive = location.pathname.endsWith('/orders');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [originalEmail, setOriginalEmail] = useState('');

  useEffect(() => {
    const token = getLocal<string>(ACCESS_TOKEN_NAME);
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
    const token = getLocal<string>(REFRESH_TOKEN_NAME);
    if (token) {
      void dispatch(logoutUser(token)).then(() => void navigate('/login'));
    }
  };

  const handleSave = (): void => {
    void dispatch(updateUser({ name, email, password })).then(() => {
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

  const hasChanges = name !== originalName || email !== originalEmail || password !== '';

  return (
    <div className={styles.app}>
      <AppHeader />
      <main className={`${styles.main} pl-5 pr-5`}>
        <div className={styles.left_container}>
          <Link
            to="/profile"
            style={{ textDecoration: 'none', display: 'block' }}
            className={`text text_type_main-medium mt-10 mb-5 pl-5 ${
              isProfileActive ? 'text_color_primary' : 'text_color_inactive'
            }`}
          >
            Профиль
          </Link>

          <Link
            to="/profile/orders"
            style={{ textDecoration: 'none', display: 'block' }}
            className={`text text_type_main-medium mt-10 mb-5 pl-5 ${
              isOrdersActive ? 'text_color_primary' : 'text_color_inactive'
            }`}
          >
            История заказов
          </Link>

          <Button onClick={handleLogout} size="large" type="secondary" htmlType="button">
            Выход
          </Button>
        </div>

        <div className={styles.container}>
          {!isOrdersActive && (
            <form
              className={styles.form}
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <div className="mb-6">
                <EmailInput
                  isIcon
                  name="name"
                  placeholder="Имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  size="default"
                />
              </div>

              <div className="mb-6">
                <EmailInput
                  isIcon
                  name="email"
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-6">
                <EmailInput
                  isIcon
                  name="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  size="default"
                />
              </div>

              {hasChanges && (
                <div className={styles.actions}>
                  <Button size="medium" type="primary" htmlType="submit">
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
                </div>
              )}
            </form>
          )}

          <Outlet />
        </div>
      </main>
    </div>
  );
};
