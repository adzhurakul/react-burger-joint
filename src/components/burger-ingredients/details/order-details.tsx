import { CheckMarkIcon } from '@krgaa/react-developer-burger-ui-components';

import styles from './order-details.module.css';

type OrderDetailsProps = {
  orderNumber: number;
};

export const OrderDetails = ({ orderNumber }: OrderDetailsProps): React.JSX.Element => {
  return (
    <div className={`${styles.order_details} pt-30 pb-30`}>
      <p className={`text text_type_digits-large mt-10 mb-4`}>{orderNumber}</p>
      <p className={`${styles.order_label} text text_type_main-medium mb-15`}>
        идентификатор заказа
      </p>
      <CheckMarkIcon type="primary" className={styles.icon} />
      <p className="text text_type_main-default mt-15 mb-2">Ваш заказ начали готовить</p>
      <p className={`${styles.text_muted} text text_type_main-default`}>
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};
