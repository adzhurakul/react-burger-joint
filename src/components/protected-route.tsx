import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { getUser } from '../services/api';
import { getCookie } from '../services/auth-slice';

import type { RootState, AppDispatch } from '../services/store';
import type React from 'react';
import type { ReactElement } from 'react';

type ProtectedRouteProps = {
  element: ReactElement;
};

export const ProtectedRouteElement = ({
  element,
}: ProtectedRouteProps): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [isUserLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    const init = async (): Promise<void> => {
      const token = getCookie('refreshToken');
      if (token) {
        await dispatch(getUser(token));
      }
      setUserLoaded(true);
    };

    void init();
  }, [dispatch]);

  if (!isUserLoaded) return <></>;

  return user ? element : <Navigate to="/login" replace />;
};
