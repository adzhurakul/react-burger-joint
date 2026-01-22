import { Navigate } from 'react-router-dom';

import { useSelector } from '@services/store.ts';

type ResetPasswordRouteProps = {
  element: React.JSX.Element;
};

export const ResetPasswordRouteElement = ({
  element,
}: ResetPasswordRouteProps): React.JSX.Element => {
  const canReset = useSelector((state) => state.auth.canResetPassword);

  return canReset ? element : <Navigate to="/forgot-password" replace />;
};
