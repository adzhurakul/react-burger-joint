import { CheckMarkIcon } from '@krgaa/react-developer-burger-ui-components';

import styles from './order-details.module.css';

type OrderDetailsProps = {
  orderNumber: number;
};

export const OrderDetails = ({ orderNumber }: OrderDetailsProps): React.JSX.Element => {
  return (
    <div className={`${styles.order_details}`}>
      <p className={`text text_type_digits-large pt-10`}>{orderNumber}</p>
      <p className={`${styles.order_label} text text_type_main-medium pt-8`}>
        идентификатор заказа
      </p>
      <CheckMarkIcon type="primary" className={`${styles.icon} pt-15`} />
      <p className="text text_type_main-default pt-15">Ваш заказ начали готовить</p>
      <p className={`${styles.text_muted} text text_type_main-default pt-2 pb-10`}>
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};
