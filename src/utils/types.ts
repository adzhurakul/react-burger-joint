export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v: number;
};

export type FetchApiResponse = {
  success: boolean;
  data: TIngredient[];
};

export type ResetPasswordResponse = {
  success: boolean;
  message: string;
};

export const ItemTypes = {
  INGREDIENT: 'ingredient',
  CONSTRUCTOR_ITEM: 'CONSTRUCTOR_ITEM',
};

export type CreateOrderResponse = {
  success: boolean;
  name: string;
  order: {
    number: number;
  };
};
