import {
  addIngredientToConstructor,
  removeIngredientFromConstructor,
} from '@/app/ingredients-slice';
import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';

import { ItemTypes } from '@utils/types';

import type { RootState } from '@/app/store.ts';
import type { TIngredient } from '@utils/types';
import type { JSX } from 'react';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  ingredients: TIngredient[];
  onOrderClick: (value: number) => void;
  onIngredientClick: (value: TIngredient | null) => void;
};

export const BurgerConstructor = ({
  ingredients,
  onOrderClick,
  onIngredientClick,
}: TBurgerConstructorProps): React.JSX.Element => {
  console.log(ingredients);

  const dispatch = useDispatch();
  const constructorIngredients = useSelector(
    (state: RootState) => state.ingredients.constructorIngredients
  );

  const [, dropRef] = useDrop({
    accept: ItemTypes.INGREDIENT,
    drop: (item: TIngredient) => {
      if (item.type === 'bun') {
        dispatch(
          removeIngredientFromConstructor(
            constructorIngredients.find((i) => i.type === 'bun')?._id ?? ''
          )
        );
      }
      dispatch(addIngredientToConstructor(item));
    },
  });

  const handleRemove = (id: string): void => {
    dispatch(removeIngredientFromConstructor(id));
  };

  const elems = ingredients
    .filter((ing) => ing.type !== 'bun')
    .map((ingredient) => {
      return (
        <li
          key={ingredient._id}
          className={`${styles.burger_constructor_element} mt-2 mb-2`}
          onClick={() => {
            onIngredientClick(ingredient);
          }}
        >
          <DragIcon type={'primary'} className={`mr-6`} />
          <ConstructorElement
            text={ingredient.name}
            thumbnail={ingredient.image}
            price={ingredient.price}
            isLocked={false}
            handleClose={() => handleRemove(ingredient._id)}
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
      <div
        className={`ml-8 pr-4 pl-6 ${type === 'top' ? 'pb-2' : 'pt-2'}`}
        onClick={() => {
          onIngredientClick(bun);
        }}
      >
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
