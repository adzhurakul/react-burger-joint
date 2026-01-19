import { OrderCard } from '@components/profile-orders/order-card.tsx';

import type { TWSOrder } from '@utils/types.ts';
import type React from 'react';

import styles from './profile-orders.module.css';

export const OrdersPage = (): React.JSX.Element => {
  const orders: TWSOrder[] = [
    {
      _id: '1',
      number: 12345,
      name: 'Флюоресцентный бургер',
      status: 'done',
      ingredients: ['bun', 'sauce', 'main'],
      createdAt: '2026-01-14T10:40:00',
      updatedAt: '2026-01-14T10:45:00',
    },
    {
      _id: '2',
      number: 12346,
      name: 'Краторный бургер',
      status: 'pending',
      ingredients: ['bun', 'main'],
      createdAt: '2026-01-14T11:00:00',
      updatedAt: '2026-01-14T11:05:00',
    },
  ];

  return (
    <section className={styles.orders}>
      {orders.map((order) => (
        <OrderCard key={order._id} order={order} />
      ))}
    </section>
  );
};
