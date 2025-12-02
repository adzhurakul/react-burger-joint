import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import type { RootState } from '@services/store.ts';

type GuestRouteProps = {
  element: React.JSX.Element;
};

export const GuestRouteElement = ({ element }: GuestRouteProps): React.JSX.Element => {
  const user = useSelector((state: RootState) => state.auth.user);

  return user ? <Navigate to="/" replace /> : element;
};
