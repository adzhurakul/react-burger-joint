import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { fetchIngredients } from '@services/api.ts';

import type { AppDispatch } from '@services/store.ts';
import type { TIngredient, TWSOrder } from '@utils/types.ts';

import styles from './order-details-page.module.css';

type OrderDetailsProps = {
  isModal: boolean;
  orderData: TWSOrder;
};

export const OrderDetails = ({
  isModal,
  orderData,
}: OrderDetailsProps): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const [allIngredients, setAllIngredients] = useState<TIngredient[] | null>(null);

  useEffect(() => {
    const getIngredients = async (): Promise<void> => {
      const data = await dispatch(fetchIngredients()).unwrap();
      setAllIngredients(data);
    };

    void getIngredients();
  }, [dispatch]);

  const formattedDate = orderData?.createdAt;

  if (!allIngredients) {
    return <></>;
  }

  const orderIngredients = orderData?.ingredients
    .map((orderIngredient) =>
      allIngredients.find(
        (ingredient: { _id: string }) => ingredient._id === orderIngredient
      )
    )
    .filter(Boolean) as TIngredient[];

  const orderTotalCost = (ingredients: TIngredient[]): number =>
    ingredients.reduce((accum, current) => accum + current.price, 0);

  const toggleTitleNumber = !isModal ? styles.text_align_left : styles.m_auto;

  return (
    <>
      <section className={`${styles.container} ${!isModal && styles.position_fixed}`}>
        {orderData ? (
          <div className={`${styles.wrapper} ${styles.flex} ${styles.flex_column}`}>
            <h2 className={`${toggleTitleNumber} text text_type_digits-default`}>
              #{orderData?.number}
            </h2>

            <p className={`text text_type_main-medium mt-10 mb-3`}>{orderData?.name}</p>

            <p className={`text text_type_main-default mb-15`}>
              {orderData?.status === 'done' ? 'Выполнен' : 'В работе'}
            </p>

            <p className={`text text_type_main-medium mb-3`}>Состав:</p>

            <ul
              className={`${styles.scrollable} ${styles.w100} ${styles.ingredient_list} mb-10`}
            >
              {Object.entries(
                orderIngredients.reduce(
                  (ingredientCount, item) => {
                    if (!ingredientCount[item._id]) {
                      ingredientCount[item._id] = 0;
                    }

                    ingredientCount[item._id] += 1;

                    return ingredientCount;
                  },
                  {} as Record<string, number>
                )
              ).map(([itemId, itemCount]) => (
                <li key={uuidv4()} className="mb-4">
                  <div className={`${styles.item_image}`}>
                    <img
                      src={orderIngredients.find((item) => item._id === itemId)?.image}
                      alt={`${
                        orderIngredients.find((item) => item._id === itemId)?.name
                      } изображение`}
                    />
                  </div>

                  <div className={`${styles.item_name}`}>
                    <p className="text text_type_main-default">
                      {orderIngredients.find((item) => item._id === itemId)?.name}
                    </p>
                  </div>

                  <div className={`${styles.item_price}`}>
                    <p className="mr-2 text text_type_digits-default">
                      {itemCount} x{' '}
                      {orderIngredients.find((item) => item._id === itemId)?.price}
                    </p>

                    <CurrencyIcon type="primary" />
                  </div>
                </li>
              ))}
            </ul>

            <ul
              className={`${styles.flex} ${styles.flex_content_between} ${styles.flex_align_center} ${styles.w100}`}
            >
              <li className="text text_type_main-default text_color_inactive">
                {formattedDate}
              </li>

              <li className={`${styles.flex} ${styles.flex_align_center}`}>
                <p className="text text_type_digits-default mr-2">
                  {orderTotalCost(orderIngredients)}
                </p>

                <CurrencyIcon type="primary" />
              </li>
            </ul>
          </div>
        ) : (
          <div className={`${styles.wrapper} ${styles.flex} ${styles.flex_column}`}>
            <h2 className={`${toggleTitleNumber} text text_type_main-large`}>Ошибка!</h2>

            <p className={`text text_type_main-medium mt-10 mb-3`}>
              Данного заказа не существует
            </p>

            <p className={`text text_type_main-medium mb-3`}>
              Можете перейти на <NavLink to="/">главную страницу</NavLink>
            </p>
          </div>
        )}
      </section>
    </>
  );
};
