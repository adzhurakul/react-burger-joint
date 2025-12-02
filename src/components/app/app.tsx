import {
  BurgerConstructorPage,
  ForgotPasswordPage,
  LoginPage,
  RegisterPage,
  ResetPasswordPage,
  ProfilePage,
} from '@/pages';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { GuestRouteElement } from '../guest-route'; // пути под твои файлы
import { ProtectedRouteElement } from '../protected-route'; // пути под твои файлы
import { ResetPasswordRouteElement } from '../reset-password-route'; // пути под твои файлы

export const App = (): React.JSX.Element => (
  <BrowserRouter>
    <Routes>
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
      />
    </Routes>
  </BrowserRouter>
);
