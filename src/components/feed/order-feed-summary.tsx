import { useSelector } from '@services/store.ts';

import type { TWSOrder } from '@utils/types.ts';

import styles from './order-feed-summary.module.css';

type OrderFeedSummaryProps = {
  loading: boolean;
};

export const OrderFeedSummary = (props: OrderFeedSummaryProps): React.JSX.Element => {
  const orders = useSelector((state) => state.feed.orders);
  const total = useSelector((state) => state.feed.total);
  const totalToday = useSelector((state) => state.feed.totalToday);
  const pendingOrders = orders.filter((order: TWSOrder) => order.status === 'pending');

  return (
    <>
      <div className={`${styles.flex}`}>
        <div className={`${styles.w_50} mr-9`}>
          <h1 className="text text_type_main-medium mb-6">Готовы:</h1>

          <ul className={`${styles.order_list}`}>
            {props.loading ? (
              <p className="text text_type_main-default">Все заказы готовы!</p>
            ) : (
              <>
                {orders.slice(0, 20).map(
                  (order: TWSOrder, index: number) =>
                    order.status === 'done' && (
                      <li
                        key={index}
                        className={`${styles.order_item} text text_type_digits-default mb-2`}
                      >
                        {order.number}
                      </li>
                    )
                )}
              </>
            )}
          </ul>
        </div>

        <div className={styles.w_50}>
          <h1 className="text text_type_main-medium mb-6">В работе:</h1>

          {pendingOrders.length > 0 ? (
            orders.slice(0, 50).map(
              (order: TWSOrder, index: number) =>
                order.status !== 'done' && (
                  <li
                    key={index}
                    className={`${styles.order_item} ${styles.color_white} text text_type_digits-default mb-2`}
                  >
                    {order.number}
                  </li>
                )
            )
          ) : (
            <p className="text text_type_main-small">Все текущие заказы готовы!</p>
          )}
        </div>
      </div>

      <div className="mt-10">
        <p className="text text_type_main-medium">Выполнено за все время:</p>

        <p className={`text text_type_digits-large`}>{total}</p>
      </div>

      <div className="mt-10">
        <p className="text text_type_main-medium">Выполнено за сегодня:</p>

        <p className={`text text_type_digits-large`}>{totalToday}</p>
      </div>
    </>
  );
};
