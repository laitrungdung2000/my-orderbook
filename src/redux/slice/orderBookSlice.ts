import { createSlice, current } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { addDepths, addTotalSums, applyDeltas, getHighestTotal, groupByTicketSize } from "../../utils/helpers";
import { ORDERBOOK_LEVELS } from "../../utils/constants";
import { OrderbookState } from '../../interfaces/OrderBookInterfaces';

const initialState: OrderbookState = {
  rawBids: [],
  bids: [],
  highestTotalBids: 0,
  rawAsks: [],
  asks: [],
  market: 'PI_XBTUSD',
  highestTotalAsks: 0,
  groupTicketSize: 0.5
};

export const orderbookSlice = createSlice({
  name: 'orderbook',
  initialState,
  reducers: {
    addBids: (state, { payload }) => {
      const currentTicketSize: number = current(state).groupTicketSize;
      const groupedCurrentBids: number[][] = groupByTicketSize(payload, currentTicketSize);
      const updatedBids: number[][] = addTotalSums(
        applyDeltas(
          groupByTicketSize(current(state).rawBids, currentTicketSize),
          groupedCurrentBids
        )
      );

      state.highestTotalBids = getHighestTotal(updatedBids);
      state.bids = addDepths(updatedBids, current(state).highestTotalBids);
    },
    addAsks: (state, { payload }) => {
      const currentTicketSize: number = current(state).groupTicketSize;
      const groupedCurrentAsks: number[][] = groupByTicketSize(payload, currentTicketSize);
      const updatedAsks: number[][] = addTotalSums(
        applyDeltas(
          groupByTicketSize(current(state).rawAsks, currentTicketSize),
          groupedCurrentAsks
        )
      );

      state.highestTotalAsks = getHighestTotal(updatedAsks);
      state.asks = addDepths(updatedAsks, current(state).highestTotalAsks);
    },
    addExistingState: (state, { payload }) => {
      const rawBids: number[][] = payload.bids;
      const rawAsks: number[][] = payload.asks;
      const bids: number[][] = addTotalSums(groupByTicketSize(rawBids, current(state).groupTicketSize));
      const asks: number[][] = addTotalSums(groupByTicketSize(rawAsks, current(state).groupTicketSize));

      state.market = payload['product_id'];
      state.rawBids = rawBids;
      state.rawAsks = rawAsks;
      state.highestTotalBids = getHighestTotal(bids);
      state.highestTotalAsks = getHighestTotal(asks);
      state.bids = addDepths(bids, current(state).highestTotalBids);
      state.asks = addDepths(asks, current(state).highestTotalAsks);
    },
    changeGroupTicketSize: (state, { payload }) => {
      state.groupTicketSize = payload;
    },
    clearOrdersState: (state) => {
      state.bids = [];
      state.rawBids = [];   
      state.highestTotalBids = 0;
      state.asks = [];
      state.rawAsks = [];
      state.highestTotalAsks = 0;
    }
  }
});

export const { addBids, addAsks, addExistingState, changeGroupTicketSize, clearOrdersState } = orderbookSlice.actions;

export const selectBids = (state: RootState): number[][] => state.orderbook.bids;
export const selectAsks = (state: RootState): number[][] => state.orderbook.asks;
export const selectGrouping = (state: RootState): number => state.orderbook.groupTicketSize;
export const selectMarket = (state: RootState): string => state.orderbook.market;

export default orderbookSlice.reducer;
