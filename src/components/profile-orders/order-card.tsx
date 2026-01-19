import type { TWSOrder } from '@utils/types.ts';

import styles from './order-card.module.css';

type Props = {
  order: TWSOrder;
};

export const OrderCard = ({ order }: Props): React.JSX.Element => {
  const statusText =
    order.status === 'done'
      ? 'Выполнен'
      : order.status === 'pending'
        ? 'Готовится'
        : 'Создан';

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <span className="text text_type_digits-default">#{order.number}</span>
        <span className="text text_type_main-default text_color_inactive">
          {order.createdAt && new Date(order.createdAt).toLocaleString()}
        </span>
      </header>

      <h2 className="text text_type_main-medium mt-2">{order.name}</h2>

      <p
        className={`text text_type_main-default mt-2 ${
          order.status === 'done' ? styles.done : ''
        }`}
      >
        {statusText}
      </p>

      <footer className={styles.footer}>
        <div className={styles.ingredients}>{/* здесь будут иконки ингредиентов */}</div>

        <span className="text text_type_digits-default">420 ₽</span>
      </footer>
    </article>
  );
};
