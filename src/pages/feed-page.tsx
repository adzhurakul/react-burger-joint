import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppHeader } from '@components/app-header/app-header';
import { OrderFeedCard } from '@components/feed/order-feed-card';
import { wsConnect } from '@services/feed-slice.ts';

import type { RootState, AppDispatch } from '@services/store.ts';
import type { TWSOrder } from '@utils/types.ts';
import type React from 'react';

import styles from './all-pages.module.css';
import feedStyles from './feed-page.module.css';

export const FeedPage = (): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();

  // Получаем state из wsSlice
  const orders: TWSOrder[] = useSelector((state: RootState) => state.feed.orders);
  const total: number = useSelector((state: RootState) => state.feed.total);
  const totalToday: number = useSelector((state: RootState) => state.feed.totalToday);

  // Открываем WS при монтировании
  useEffect(() => {
    dispatch(wsConnect('wss://norma.education-services.ru/orders/all'));

    return (): void => {
      //dispatch(wsSlice.actions.connectionClosed()); todo
    };
  }, [dispatch]);

  // Разделяем заказы по статусу
  const readyOrders = orders.filter((order) => order.status === 'done');
  const workOrders = orders.filter((order) => order.status !== 'done');

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Лента заказов
      </h1>

      <main className={styles.main}>
        <div className={styles.main}>
          {/* Левая колонка — лента */}
          <section className={feedStyles.feed}>
            {orders.map((order) => (
              <OrderFeedCard key={order._id} order={order} />
            ))}
          </section>

          {/* Правая колонка — статистика */}
          <aside className={feedStyles.stats}>
            <div className={feedStyles.statusBlock}>
              <div>
                <p className="text text_type_main-medium mb-2">Готовы:</p>
                <ul className={feedStyles.readyList}>
                  {readyOrders.map((order) => (
                    <li key={order._id} className="text text_type_digits-default">
                      {order.number}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text text_type_main-medium mb-2">В работе:</p>
                <ul className={feedStyles.workList}>
                  {workOrders.map((order) => (
                    <li key={order._id} className="text text_type_digits-default">
                      {order.number}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="text text_type_main-medium mt-10">Выполнено за всё время:</p>
            <p className="text text_type_digits-large">{total || 0}</p>

            <p className="text text_type_main-medium mt-10">Выполнено за сегодня:</p>
            <p className="text text_type_digits-large">{totalToday || 0}</p>
          </aside>
        </div>
      </main>
    </div>
  );
};
