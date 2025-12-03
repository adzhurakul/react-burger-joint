import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header.tsx';

import { forgotPassword } from '../services/api';

import type { AppDispatch } from '../services/store';

import styles from './all-pages.module.css';

export const ForgotPasswordPage = (): React.JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleForgotPassword = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const result = await dispatch(forgotPassword(email)).unwrap();
      if (result.success) {
        setMessage(result.message);
        setTimeout(() => void navigate('/reset-password'), 1500);
      }
    } catch (err) {
      setError(err as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <div className={styles.container}>
        <div className="text text_type_main-default mb-6">Восстановление пароля</div>

        <div className="mb-6">
          <Input
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Укажите e-mail"
            value={email}
          />
        </div>

        {error && (
          <div className="text text_type_main-default text_color_error mb-4">
            {error}
          </div>
        )}
        {message && (
          <div className="text text_type_main-default text_color_success mb-4">
            {message}
          </div>
        )}

        <div className="mb-20">
          <Button
            onClick={() => void handleForgotPassword()}
            size="small"
            type="primary"
            htmlType="button"
            disabled={loading || !email}
          >
            {loading ? 'Отправка...' : 'Восстановить'}
          </Button>
        </div>

        <div className={`${styles.actions} mb-4`}>
          <div className="text text_type_main-default text_color_inactive">
            Вспомнили пароль?
          </div>
          <Button
            onClick={() => void navigate('/login')}
            size="medium"
            type="secondary"
            htmlType="button"
          >
            Войти
          </Button>
        </div>
      </div>
    </div>
  );
};
