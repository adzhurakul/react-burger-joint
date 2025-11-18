import {
  addIngredientToConstructor,
  removeIngredientFromConstructorById,
} from '@/services/ingredients-slice';
import {
  Button,
  ConstructorElement,
  CurrencyIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { ItemTypes } from '@utils/types';

import { BurgerConstructorItem } from './burger-constructor-item';

import type { RootState } from '@/services/store.ts';
import type { TIngredient } from '@utils/types';
import type { JSX } from 'react';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  onOrderClick: (value: number) => void;
};

export const BurgerConstructor = ({
  onOrderClick,
}: TBurgerConstructorProps): React.JSX.Element => {
  const dispatch = useDispatch();
  const constructorIngredients = useSelector(
    (state: RootState) => state.ingredients.constructorIngredients
  );

  const [, dropRef] = useDrop({
    accept: ItemTypes.INGREDIENT,
    drop: (item: TIngredient) => {
      if (item.type === 'bun') {
        dispatch(
          removeIngredientFromConstructorById(
            constructorIngredients.find((i) => i.type === 'bun')?._id ?? ''
          )
        );
      }
      dispatch(addIngredientToConstructor({ ...item, uuid: uuidv4() }));
    },
  });

  const elems = constructorIngredients
    .filter((ing) => ing.type !== 'bun')
    .map((ingredient, index) => (
      <BurgerConstructorItem
        key={ingredient.uuid}
        ingredient={ingredient}
        index={index}
      />
    ));

  const totalPrice = constructorIngredients.reduce(
    (sum, ingredient) =>
      sum + (ingredient.type === 'bun' ? ingredient.price * 2 : ingredient.price),
    0
  );
  const bun = constructorIngredients.find((ing) => ing.type === 'bun');

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
      <div
        ref={(node) => {
          dropRef(node);
        }}
      >
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
          <Button
            type="primary"
            htmlType="button"
            size="large"
            onClick={() => {
              onOrderClick(123456);
            }}
          >
            Оформить заказ
          </Button>
        </div>
      </div>
    </section>
  );
};
