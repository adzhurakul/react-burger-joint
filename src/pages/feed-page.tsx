import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { AppHeader } from '@components/app-header/app-header.tsx';
import { OrderFeedCard } from '@components/feed/order-feed-card.tsx';
import { OrderFeedSummary } from '@components/feed/order-feed-summary.tsx';
import { OrderNotFound } from '@components/feed/order-not-found.tsx';
import { WS_ORDERS_URL } from '@services/api.ts';
import { wsConnect, wsDisconnect } from '@services/feed-slice.ts';

import type { AppDispatch, RootState } from '@services/store.ts';
import type { TWSOrder } from '@utils/types.ts';
import type React from 'react';

import styles from './all-pages.module.css';
import feedStyles from './feed-page.module.css';

export const FeedPage = (): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const orders: TWSOrder[] = useSelector((state: RootState) => state.feed.orders);
  const [loading] = useState<boolean>(Boolean);

  const lastPart = location.pathname.split('/').pop();
  const isOrderActive = Number.isInteger(Number(lastPart));

  useEffect(() => {
    dispatch(wsConnect(WS_ORDERS_URL));

    return (): void => {
      dispatch(wsDisconnect());
    };
  }, [dispatch]);

  return (
    <>
      <AppHeader />
      <section className={styles.container}>
        {!isOrderActive && (
          <>
            <h1 className="text text_type_main-large mb-5 mt-10">Лента заказов</h1>

            <div className={feedStyles.wrapper}>
              <div className={`${feedStyles.w_100} ${feedStyles.scrollable}`}>
                {!loading ? (
                  orders.map((order) => (
                    <OrderFeedCard key={uuidv4()} order={order} showStatus={false} />
                  ))
                ) : (
                  <OrderNotFound />
                )}
              </div>

              <div className={feedStyles.w_100}>
                <OrderFeedSummary loading />
              </div>
            </div>
          </>
        )}

        <Outlet />
      </section>
    </>
  );
};
