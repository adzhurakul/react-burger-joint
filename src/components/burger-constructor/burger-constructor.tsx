import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';

import type { TIngredient } from '@utils/types';
import type { JSX } from 'react';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  ingredients: TIngredient[];
};

export const BurgerConstructor = ({
  ingredients,
}: TBurgerConstructorProps): React.JSX.Element => {
  console.log(ingredients);

  const elems = ingredients
    .filter((ing) => ing.type !== 'bun')
    .map((ingredient) => {
      return (
        <li
          key={ingredient._id}
          className={`${styles.burger_constructor_element} mt-2 mb-2`}
        >
          <DragIcon type={'primary'} className={`mr-6`} />
          <ConstructorElement
            text={ingredient.name}
            thumbnail={ingredient.image}
            price={ingredient.price}
            isLocked={false}
          />
        </li>
      );
    });

  const totalPrice = ingredients.reduce((sum, ingredient) => sum + ingredient.price, 0);
  const bun = ingredients.find((ing) => ing.type === 'bun');

  const bunElement = (
    type: 'top' | 'bottom',
    bun: TIngredient,
    extraText?: string
  ): JSX.Element => {
    return (
      <div className={`ml-8 pr-4 pl-6 ${type === 'top' ? 'pb-2' : 'pt-2'}`}>
        <ConstructorElement
          text={extraText === undefined ? bun.name : bun.name + '\n' + extraText}
          thumbnail={bun.image}
          price={bun.price}
          type={type}
          isLocked={true}
        />
      </div>
    );
  };

  return (
    <section className={styles.burger_constructor}>
      <div>
        {bun && bunElement('top', bun, '(верх)')}

        <div className={`${styles.burger_constructor_scroll} pr-4 pl-4`}>
          <ul className={styles.burger_constructor_list}>{elems}</ul>
        </div>

        {bun && bunElement('bottom', bun, '(низ)')}

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
