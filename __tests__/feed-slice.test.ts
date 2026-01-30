import { WebsocketStatus } from '@utils/types';

import feedSlice, {
  wsConnecting,
  wsOpen,
  wsClose,
  wsError,
  wsMessage,
  setCurrentOrder,
} from '../src/services/feed-slice';

const orderMock = {
  _id: '1',
  name: 'Order 1',
  ingredients: ['ingredient1', 'ingredient2'],
  status: 'done',
  number: 123,
  updatedAt: new Date().toISOString(),
};

const wsPayloadMock = {
  orders: [orderMock],
  total: 10,
  totalToday: 5,
};

jest.mock('@services/api', () => ({
  fetchOrder: {
    pending: 'fetchOrderPending',
    fulfilled: 'fetchOrderFulfilled',
    rejected: 'fetchOrderRejected',
  },
}));

describe('feed reducer (sync only)', () => {
  it('returns initial state', () => {
    expect(feedSlice.reducer(undefined, { type: 'UNKNOWN' })).toEqual({
      status: WebsocketStatus.OFFLINE,
      connectionError: null,
      orders: [],
      currentOrder: null,
      total: 0,
      totalToday: 0,
      loading: false,
      error: null,
    });
  });

  it('wsConnecting sets status to CONNECTING', () => {
    const state = feedSlice.reducer(undefined, wsConnecting());
    expect(state.status).toBe(WebsocketStatus.CONNECTING);
  });

  it('wsOpen sets status to ONLINE and clears connectionError', () => {
    const initialState = {
      ...feedSlice.reducer(undefined, { type: '' }),
      connectionError: 'err',
    };
    const state = feedSlice.reducer(initialState, wsOpen());
    expect(state.status).toBe(WebsocketStatus.ONLINE);
    expect(state.connectionError).toBeNull();
  });

  it('wsClose sets status to OFFLINE', () => {
    const state = feedSlice.reducer(undefined, wsClose());
    expect(state.status).toBe(WebsocketStatus.OFFLINE);
  });

  it('wsError sets connectionError', () => {
    const state = feedSlice.reducer(undefined, wsError('some error'));
    expect(state.connectionError).toBe('some error');
  });

  it('wsMessage sets orders, total, and totalToday', () => {
    const state = feedSlice.reducer(undefined, wsMessage(wsPayloadMock));
    expect(state.orders).toEqual(wsPayloadMock.orders);
    expect(state.total).toBe(wsPayloadMock.total);
    expect(state.totalToday).toBe(wsPayloadMock.totalToday);
  });

  it('setCurrentOrder sets currentOrder', () => {
    const state = feedSlice.reducer(undefined, setCurrentOrder(orderMock));
    expect(state.currentOrder).toEqual(orderMock);
  });
});
