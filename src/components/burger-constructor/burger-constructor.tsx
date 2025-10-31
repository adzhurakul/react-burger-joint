import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  ingredients: TIngredient[];
};

export const BurgerConstructor = ({
  ingredients,
}: TBurgerConstructorProps): React.JSX.Element => {
  console.log(ingredients);

  const elems = ingredients.map((ingredient, index) => {
    let elementType: 'top' | 'bottom' | undefined = undefined;

    if (index === 0) {
      elementType = 'top';
    } else if (index === ingredients.length - 1) {
      elementType = 'bottom';
    }

    const isEdgeIngredient = index === 0 || index === ingredients.length - 1;
    return (
      <li
        key={ingredient._id}
        className={`${styles.burger_constructor_element} mt-2 mb-2`}
      >
        <DragIcon
          type={'primary'}
          className={`${isEdgeIngredient ? styles.hidden : ''} mr-6`}
        />
        <ConstructorElement
          text={ingredient.name}
          thumbnail={ingredient.image}
          price={ingredient.price}
          type={elementType}
          isLocked={isEdgeIngredient}
        />
      </li>
    );
  });

  const totalPrice = ingredients.reduce((sum, ingredient) => sum + ingredient.price, 0);

  return (
    <section className={styles.burger_constructor}>
      <div style={{ overflowY: 'auto' }} className="pr-4 pl-4">
        <ul className={styles.burger_constructor_list}>{elems}</ul>
        <div
          className={`${styles.burger_constructor_summary} text text_type_digits-medium mt-10`}
        >
          {totalPrice}
          <CurrencyIcon type="primary" className="mr-10" />
          <Button type="primary" htmlType="button" size="large">
            Оформить заказ
          </Button>
        </div>
      </div>
    </section>
  );
};
