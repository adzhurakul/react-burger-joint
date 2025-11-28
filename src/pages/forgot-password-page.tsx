import { Button, EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { useNavigate } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header.tsx';

import type React from 'react';

import styles from './all-pages.module.css';

export const ForgotPasswordPage = (): React.JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className={styles.app}>
      <AppHeader />
      <div className={styles.container}>
        <div className="text text_type_main-default mb-6">Восстановление пароля</div>
        <div className="mb-6">
          <EmailInput
            isIcon
            name="email"
            onChange={function fee() {
              /* empty */
            }}
            placeholder="Укажите e-mail"
            value={''}
          />
        </div>
        <div className="mb-20">
          <Button
            onClick={function fee() {
              /* empty */
            }}
            size="small"
            type="primary"
            htmlType={'button'}
          >
            Восстановить
          </Button>
        </div>
        <div className={`${styles.actions} mb-4`}>
          <div className="text text_type_main-default text_color_inactive">
            Вспомнили пароль?
          </div>
          <Button
            onClick={(): void => void navigate('/register')}
            size="medium"
            type="secondary"
            htmlType={'button'}
          >
            Войти
          </Button>
        </div>
      </div>
    </div>
  );
};
