import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { ACCESS_TOKEN_NAME } from '@utils/types.ts';

import { getUser } from '../services/api';
import { getLocal } from '../services/auth-slice';
import { useDispatch, useSelector } from '../services/store';

import type React from 'react';
import type { ReactElement } from 'react';

type GuestRouteProps = {
  element: ReactElement;
};

export const GuestRouteElement = ({ element }: GuestRouteProps): React.JSX.Element => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
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

  if (!isUserLoaded) return <></>;
  return user ? <Navigate to="/" replace /> : element;
};
