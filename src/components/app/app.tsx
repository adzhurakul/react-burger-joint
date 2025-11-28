import { BurgerConstructorPage, LoginPage } from '@/pages';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import type React from 'react';

export const App = (): React.JSX.Element => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BurgerConstructorPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};
