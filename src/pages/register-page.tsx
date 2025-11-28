import { Button, EmailInput, Input } from '@krgaa/react-developer-burger-ui-components';
import { useNavigate } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header.tsx';

import type React from 'react';

import styles from './all-pages.module.css';

export const RegisterPage = (): React.JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className={styles.app}>
      <AppHeader />
      <div className={styles.container}>
        <div className="text text_type_main-default mb-6">Регистрация</div>
        <div className="mb-6">
          <Input
            /*          ref={{
            current: '[Circular]',
          }}*/
            errorText="Ошибка"
            name="name"
            onChange={function fee() {
              /* empty */
            }}
            onIconClick={function fee() {
              /* empty */
            }}
            placeholder="Имя"
            size="default"
            type="text"
            value={''}
          />
        </div>
        <div className="mb-6">
          <EmailInput
            isIcon
            name="email"
            onChange={function fee() {
              /* empty */
            }}
            placeholder="E-mail"
            value={''}
          />
        </div>
        <div className="mb-6">
          <Input
            /*          ref={{
            current: '[Circular]',
          }}*/
            errorText="Ошибка"
            icon="ShowIcon" // todo: HideIcon
            name="name"
            onChange={function fee() {
              /* empty */
            }}
            onIconClick={function fee() {
              /* empty */
            }}
            placeholder="Пароль"
            size="default"
            type="text"
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
            Войти
          </Button>
        </div>
        <div className={styles.actions}>
          <div className="text text_type_main-default text_color_inactive">
            Уже зарегистрированы?
          </div>
          <Button
            onClick={(): void => void navigate('/login')}
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
