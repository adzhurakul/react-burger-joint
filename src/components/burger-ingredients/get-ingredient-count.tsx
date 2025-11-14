import type { TIngredient } from '@utils/types.ts';

export const getIngredientCount = (
  constructorIngredients: TIngredient[],
  id: string
): number => {
  const ingredient = constructorIngredients.find((i) => i._id === id);

  if (!ingredient) return 0;

  if (ingredient.type === 'bun') return 2;

  return constructorIngredients.filter((i) => i._id === id).length;
};
