import { Button, EmailInput, Input } from '@krgaa/react-developer-burger-ui-components';

import type React from 'react';

import styles from './login-page.module.css';

export const LoginPage = (): React.JSX.Element => {
  return (
    <div className={styles.container}>
      <div className="text text_type_main-default mb-6">Вход</div>
      <div className="mb-6">
        <EmailInput
          isIcon
          name="email"
          onChange={function fee() {
            /* empty */
          }}
          placeholder="Логин"
          value="bob@example.com"
        />
      </div>
      <div className="mb-6">
        <Input
          /*          ref={{
            current: '[Circular]',
          }}*/
          errorText="Ошибка"
          icon="CurrencyIcon"
          name="name"
          onChange={function fee() {
            /* empty */
          }}
          onIconClick={function fee() {
            /* empty */
          }}
          placeholder="placeholder"
          size="default"
          type="text"
          value="value"
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
      <div className={`${styles.actions} mb-4`}>
        <div className="text text_type_main-default text_color_inactive">
          Вы - новый пользователь?
        </div>
        <Button
          onClick={function fee() {
            /* empty */
          }}
          size="medium"
          type="secondary"
          htmlType={'button'}
        >
          Зарегистрироваться
        </Button>
      </div>
      <div className={styles.actions}>
        <div className="text text_type_main-default text_color_inactive">
          Забыли пароль?
        </div>
        <Button
          onClick={function fee() {
            /* empty */
          }}
          size="medium"
          type="secondary"
          htmlType={'button'}
        >
          Восстановить пароль
        </Button>
      </div>
    </div>
  );
};
