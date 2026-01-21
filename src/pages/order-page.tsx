import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { AppHeader } from '@components/app-header/app-header.tsx';
import { OrderDetails } from '@pages/order-details.tsx';
import { fetchOrder } from '@services/api.ts';
import { useDispatch } from '@services/store.ts';

import type { TWSOrder } from '@utils/types.ts';
import type { JSX } from 'react';

type OrderPageProps = {
  showHeader: boolean;
};

export const OrderPage = ({ showHeader }: OrderPageProps): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const [orderData, setOrderData] = useState<TWSOrder | null>(null);

  useEffect(() => {
    const getOrderData = async (): Promise<void> => {
      const data = await dispatch(fetchOrder(id ?? '')).unwrap();
      setOrderData(data);
    };

    void getOrderData();
  }, [dispatch]);

  if (!orderData) {
    return <div>Заказ не найден</div>;
  }

  return (
    <>
      {showHeader && <AppHeader />}
      <div className="pl-5 pr-5 mt-10">
        <OrderDetails isModal={false} orderData={orderData} />
      </div>
    </>
  );
};
