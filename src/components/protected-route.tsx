import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { ACCESS_TOKEN_NAME } from '@utils/types.ts';

import { getUser } from '../services/api';
import { getLocal } from '../services/auth-slice';
import { useDispatch, useSelector } from '../services/store';

import type React from 'react';
import type { ReactElement } from 'react';

type ProtectedRouteProps = {
  element: ReactElement;
};

export const ProtectedRouteElement = ({
  element,
}: ProtectedRouteProps): React.JSX.Element => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [isUserLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    const init = async (): Promise<void> => {
      const token = getLocal<string>(ACCESS_TOKEN_NAME);
      if (token) {
        await dispatch(getUser(token)).then((res) => {
          if (res.payload && typeof res.payload !== 'string') {
            console.log('ProtectedRouteElement getUser ' + res.payload.user.name);
          }
        });
      }
      setUserLoaded(true);
    };

    void init();
  }, [dispatch]);

  if (!isUserLoaded) return <></>;

  return user ? element : <Navigate to="/login" replace />;
};
