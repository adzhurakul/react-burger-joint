import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { ACCESS_TOKEN_NAME } from '@utils/types.ts';

import { getUser } from '../services/api';
import { getLocal } from '../services/auth-slice';

import type { RootState, AppDispatch } from '../services/store';
import type React from 'react';
import type { ReactElement } from 'react';

type GuestRouteProps = {
  element: ReactElement;
};

export const GuestRouteElement = ({ element }: GuestRouteProps): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isUserLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    const init = async (): Promise<void> => {
      const token = getLocal<string>(ACCESS_TOKEN_NAME);

      if (token) {
        await dispatch(getUser(token));
      }

      setUserLoaded(true);
    };

    void init();
  }, [dispatch]);

  // Пока не загрузили инфу о пользователе — ничего не рендерим
  if (!isUserLoaded) return <></>;

  // Если пользователь уже авторизован — не пускаем на страницу (логин/рег)
  return user ? <Navigate to="/" replace /> : element;
};
