import {
  reorderConstructorIngredients,
  removeIngredientFromConstructor,
} from '@/app/ingredients-slice';
import {
  DragIcon,
  ConstructorElement,
} from '@krgaa/react-developer-burger-ui-components';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';

import { ItemTypes } from '@utils/types';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor-item.module.css';

type BurgerConstructorItemProps = {
  ingredient: TIngredient;
  index: number;
};

export const BurgerConstructorItem = ({
  ingredient,
  index,
}: BurgerConstructorItemProps): React.JSX.Element => {
  const dispatch = useDispatch();
  const ref = useRef<HTMLLIElement>(null);

  const [, drop] = useDrop({
    accept: ItemTypes.CONSTRUCTOR_ITEM,
    hover(item: { index: number }) {
      if (!ref.current || item.index === index) return;
      dispatch(
        reorderConstructorIngredients({ dragIndex: item.index, hoverIndex: index })
      );
      item.index = index;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CONSTRUCTOR_ITEM,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <li
      ref={ref}
      className={`${isDragging ? styles.dragging : styles.burger_constructor_element} mt-2 mb-2`}
    >
      <DragIcon type="primary" className="mr-6" />
      <ConstructorElement
        text={ingredient.name}
        thumbnail={ingredient.image}
        price={ingredient.price}
        isLocked={false}
        handleClose={() => dispatch(removeIngredientFromConstructor(ingredient._id))}
      />
    </li>
  );
};
