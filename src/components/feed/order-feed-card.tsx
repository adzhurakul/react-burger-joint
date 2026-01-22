import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { setCurrentOrder } from '@services/feed-slice.ts';
import { useSelector } from '@services/store.ts';

import type { TIngredient, TWSOrder } from '@utils/types.ts';

import styles from './order-feed-card.module.css';

export const OrderFeedCard = ({
  order,
  showStatus,
}: {
  order: TWSOrder;
  showStatus: boolean;
}): React.JSX.Element => {
  const { allIngredients } = useSelector((state) => state.ingredients);

  const [data, setData] = useState<TIngredient[]>([]);
  const location = useLocation();

  useEffect(() => {
    if (order?.ingredients) {
      const items: TIngredient[] = order.ingredients.map(
        (item) =>
          allIngredients.find(
            (newIngredient: { _id: string }) => newIngredient._id === item
          )!
      );

      setData(items);
    }
  }, [allIngredients, order]);

  const date = order.createdAt && new Date(order.createdAt).toLocaleString();

  const calculateOrderPrice = (orderIngredients: string[]): number => {
    let totalPrice = 0;

    orderIngredients.forEach((ingredientId) => {
      const ingredient = allIngredients.find(
        (ing: { _id: string }) => ing._id === ingredientId
      );

      if (ingredient) {
        totalPrice += ingredient.price;
      }
    });

    return totalPrice;
  };

  const getOrderStatus = (orderStatus: string): string => {
    let orderTextStatus = '';

    switch (orderStatus) {
      case 'done':
        orderTextStatus = 'Выполнен';
        break;
      case 'pending':
        orderTextStatus = 'Отменён';
        break;
      case 'created':
        orderTextStatus = 'Готовится';
        break;
      default:
        orderTextStatus = 'Новый статус?';
        break;
    }

    return orderTextStatus;
  };

  const handleClick = (): void => {
    setCurrentOrder(order);
  };

  return (
    <Link
      to={`${order.number}`}
      state={{ background: location }}
      key={order._id}
      className={`${styles.link} mb-5 mr-6`}
      onClick={handleClick}
    >
      <div className={`${styles.order_card} ${styles.link}`}>
        <div
          className={`${styles.flex} ${styles.flex_content_between} ${styles.flex_align_center} ${styles.card_item} mb-6`}
        >
          <p className="text text_type_digits-default">#{order.number}</p>

          <p className="text text_type_main-default text_color_inactive">{date}</p>
        </div>

        <div
          className={`${styles.flex} ${styles.card_item} ${showStatus ? 'mb-2' : 'mb-6'}`}
        >
          <p className="text text_type_main-medium mb-2">{order.name}</p>
        </div>

        {showStatus && (
          <div className={`${styles.flex} ${styles.card_item} mb-6`}>
            {getOrderStatus(order.status) === 'Выполнен' ? (
              <p className={`text text_type_main-default`}>
                {getOrderStatus(order.status)}
              </p>
            ) : getOrderStatus(order.status) === 'Отменён' ? (
              <p className={`text text_type_main-default`}>
                {getOrderStatus(order.status)}
              </p>
            ) : (
              <p className="text text_type_main-default">
                {getOrderStatus(order.status)}
              </p>
            )}
          </div>
        )}

        <div
          className={`${styles.flex} ${styles.flex_content_between} ${styles.flex_align_center} ${styles.card_item}`}
        >
          <ul className={styles.ingredient_list}>
            {data?.slice(0, 6).map((item, index: number) => (
              <li key={index} className={`${styles.order_item}`}>
                <img src={item?.image} alt={item?.name} />
                {index === 5 && order.ingredients.length > 6 && (
                  <div className={`${styles.remaining_ingredients}`}>
                    <p className="text text_type_digits-default">
                      +{order.ingredients.length - 6}
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div
            className={`${styles.flex} ${styles.flex_content_between} ${styles.flex_align_center}`}
          >
            <p className="text text_type_digits-default mr-2">
              {calculateOrderPrice(order.ingredients)}
            </p>

            <CurrencyIcon type="primary" />
          </div>
        </div>
      </div>
    </Link>
  );
};
