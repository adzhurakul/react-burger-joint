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

export type SuccessMessageResponse = {
  success: boolean;
  message: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterUserRequest = {
  email: string;
  password: string;
  name: string;
};

export type AuthUser = {
  email: string;
  name: string;
};

export type AccessToken = `Bearer ${string}`;

export type AuthResponse = {
  success: boolean;
  user: AuthUser;
  accessToken: AccessToken;
  refreshToken: string;
};

export type TokenRefreshRequest = {
  token: string;
};

export type TokenRefreshResponse = {
  success: boolean;
  accessToken: `Bearer ${string}`;
  refreshToken: string;
};

export type LogoutRequest = {
  token: string;
};

export type LogoutResponse = {
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

export type LocationState = {
  background?: Location;
};
export const REFRESH_TOKEN_NAME = 'refreshToken';
export const ACCESS_TOKEN_NAME = 'accessToken';

export type TWSOrder = {
  ingredients: string[];
  name: string;
  _id: string;
  status: string;
  number: number;
  createdAt?: string;
  updatedAt: string;
};

export type IWSActions = {
  wsInit: string;
  onOpen: string;
  onClose: string;
  onError: string;
  onMessage: string;
};

export type IWSOrdersPayload = {
  success?: boolean;
  message?: string;
  orders: TWSOrder[];
  total: number;
  totalToday: number;
};

export enum WebsocketStatus {
  CONNECTING = 'CONNECTING...',
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}
