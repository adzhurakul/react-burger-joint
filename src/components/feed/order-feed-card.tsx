import type { TWSOrder } from '@utils/types.ts';

import styles from './order-feed-card.module.css';

export const OrderFeedCard = ({ order }: { order: TWSOrder }): React.JSX.Element => {
  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <span className="text text_type_digits-default">#{order.number}</span>
        <span className="text text_type_main-default text_color_inactive">
          {order.createdAt && new Date(order.createdAt).toLocaleString()}
        </span>
      </div>

      <h2 className="text text_type_main-medium mt-2">{order.name}</h2>

      <div className={styles.ingredients} />
    </article>
  );
};
