import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import type { RootState } from '@services/store.ts';

type ResetPasswordRouteProps = {
  element: React.JSX.Element;
};

export const ResetPasswordRouteElement = ({
  element,
}: ResetPasswordRouteProps): React.JSX.Element => {
  const canReset = useSelector((state: RootState) => state.auth.canResetPassword);

  return canReset ? element : <Navigate to="/forgot-password" replace />;
};
