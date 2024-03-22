export interface OrderBookProps {
    CryptoId: string;
    isFeedKilled: boolean;
}

export enum OrderType {
    BIDS,
    ASKS
}

export interface Delta {
    bids: number[][];
    asks: number[][];
}

export interface OrderbookState {
    rawAsks: number[][];
    asks: number[][];
    highestTotalAsks: number;
    rawBids: number[][];
    bids: number[][];
    highestTotalBids: number;
    market: string;
    groupTicketSize: number;
}

export interface OrderBookBodyProps {
    total: string;
    size: string;
    price: string;
    reversedTableCell: boolean;
}

export interface OrderBookHeaderProps {
    reversedTableCell?: boolean;
}  
  