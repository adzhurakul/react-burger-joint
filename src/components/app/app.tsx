import {
  BurgerConstructorPage,
  ForgotPasswordPage,
  LoginPage,
  RegisterPage,
} from '@/pages';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import type React from 'react';

export const App = (): React.JSX.Element => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BurgerConstructorPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
};
