import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { OrderFeedCard } from '@components/feed/order-feed-card.tsx';
import { OrderNotFound } from '@components/feed/order-not-found.tsx';
import { getLocal } from '@services/auth-slice.ts';
import { wsConnect, wsDisconnect } from '@services/feed-slice.ts';
import { ACCESS_TOKEN_NAME } from '@utils/types.ts';

import type { AppDispatch, RootState } from '@services/store.ts';
import type { TWSOrder } from '@utils/types.ts';
import type React from 'react';

import styles from './profile-orders.module.css';

export const ProfileOrdersPage = (): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const userOrders: TWSOrder[] = useSelector((state: RootState) => state.feed.orders);

  useEffect(() => {
    const token = getLocal<string>(ACCESS_TOKEN_NAME);
    const cleanedToken = token?.replace('Bearer ', '');

    if (!cleanedToken) return;

    dispatch(
      wsConnect(`wss://norma.education-services.ru/orders?token=${cleanedToken}`)
    );

    return (): void => {
      dispatch(wsDisconnect());
    };
  }, [dispatch]);

  return (
    <div className={`${styles.content} ${styles.content_height}`}>
      <div className={`${styles.w100} ${styles.scrollable} mt-15`}>
        {userOrders ? (
          userOrders.map((order, index: number) => (
            <OrderFeedCard key={index} order={order} showStatus={true} />
          ))
        ) : (
          <div className={`${styles.error_container}`}>
            <OrderNotFound />
          </div>
        )}
      </div>
    </div>
  );
};
