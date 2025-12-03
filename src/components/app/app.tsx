import {
  BurgerConstructorPage,
  ForgotPasswordPage,
  IngredientPage,
  LoginPage,
  OrdersPage,
  ProfilePage,
  RegisterPage,
  ResetPasswordPage,
} from '@/pages';
import { useSelector } from 'react-redux';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { IngredientDetails } from '@components/burger-ingredients/details/ingredient-details.tsx';
import { GuestRouteElement } from '@components/guest-route.tsx';
import { Modal } from '@components/modal/modal.tsx';
import { ProtectedRouteElement } from '@components/protected-route.tsx';
import { ResetPasswordRouteElement } from '@components/reset-password-route.tsx';

import type { RootState } from '@services/store.ts';
import type { LocationState } from '@utils/types.ts';
import type React from 'react';

export const App = (): React.JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const background = state?.background;

  const currentIngredient = useSelector(
    (state: RootState) => state.ingredients.currentIngredient
  );

  return (
    <>
      <Routes location={background ?? location}>
        <Route path="/" element={<BurgerConstructorPage />} />
        <Route path="/login" element={<GuestRouteElement element={<LoginPage />} />} />
        <Route
          path="/register"
          element={<GuestRouteElement element={<RegisterPage />} />}
        />
        <Route
          path="/forgot-password"
          element={<GuestRouteElement element={<ForgotPasswordPage />} />}
        />
        <Route
          path="/reset-password"
          element={<ResetPasswordRouteElement element={<ResetPasswordPage />} />}
        />

        <Route
          path="/profile"
          element={<ProtectedRouteElement element={<ProfilePage />} />}
        >
          <Route path="orders" element={<OrdersPage />} />
        </Route>
        <Route path="/ingredients/:id" element={<IngredientPage />} />
      </Routes>

      {background && currentIngredient && (
        <Routes>
          <Route
            path="/ingredients/:id"
            element={
              <Modal onClose={() => void navigate(-1)} header="Детали ингредиента">
                <IngredientDetails ingredient={currentIngredient} />
              </Modal>
            }
          />
        </Routes>
      )}
    </>
  );
};
