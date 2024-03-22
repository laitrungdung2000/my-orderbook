import { CircularProgress, Container, Grid, TableContainer } from '@mui/material';
import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import OrderBookHeader from './components/OrderBookHeader';
import { addAsks, addBids, addExistingState, selectAsks, selectBids } from '../../redux/slice/orderBookSlice';
import { ORDERBOOK_LEVELS, CryptoPair, WSS_CRYPTO_FACILITIES } from '../../utils/constants';
import useWebSocket from 'react-use-websocket';
import { formatNumber } from '../../utils/helpers';
import OrderBookBody from './components/OrderBookBody';
import { Delta, OrderBookProps, OrderType } from '../../interfaces/OrderBookInterfaces';

let currentBids: number[][] = []
let currentAsks: number[][] = []

const OrderBook:FC<OrderBookProps> = ({ CryptoId, isFeedKilled }) => {
  const bids: number[][] = useAppSelector(selectBids);
  const asks: number[][] = useAppSelector(selectAsks);
  const dispatch = useAppDispatch();
  const { sendJsonMessage, getWebSocket } = useWebSocket(WSS_CRYPTO_FACILITIES, {
    onOpen: () => console.log('WebSocket connection opened.'),
    onClose: () => console.log('WebSocket connection closed.'),
    shouldReconnect: (closeEvent) => true,
    onMessage: (event: WebSocketEventMap['message']) =>  processMessages(event)
  });

  const processMessages = (event: { data: string; }) => {
    const response = JSON.parse(event.data);

    if (response.numLevels) {
      dispatch(addExistingState(response));
    } else {
      process(response);
    }
  };

  useEffect(() => {
    function connect(product: string) {
      const unSubscribeMessage = {
        event: 'unsubscribe',
        feed: 'book_ui_1',
        product_ids: [CryptoPair[product]]
      };
      sendJsonMessage(unSubscribeMessage);

      const subscribeMessage = {
        event: 'subscribe',
        feed: 'book_ui_1',
        product_ids: [product]
      };
      sendJsonMessage(subscribeMessage);
    }

    if (isFeedKilled) {
      getWebSocket()?.close();
    } else {
      connect(CryptoId);
    }
  }, [isFeedKilled, CryptoId, sendJsonMessage, getWebSocket]);

  const process = (data: Delta) => {
    if (data?.bids?.length > 0) {
      currentBids = [...currentBids, ...data.bids];

      if (currentBids.length > ORDERBOOK_LEVELS) {
        dispatch(addBids(currentBids));
        currentBids = [];
        currentBids.length = 0;
      }
    }
    if (data?.asks?.length >= 0) {
      currentAsks = [...currentAsks, ...data.asks];

      if (currentAsks.length > ORDERBOOK_LEVELS) {
        dispatch(addAsks(currentAsks));
        currentAsks = [];
        currentAsks.length = 0;
      }
    }
  };

  const formatPrice = (arg: number): string => {
    return arg.toLocaleString("en", { useGrouping: true, minimumFractionDigits: 2 })
  };

  const buildOrderBookList = (levels: number[][], orderType: OrderType = OrderType.BIDS): React.ReactNode => {
    const sortedLevelsByPrice: number[][] = [ ...levels ].sort(
      (currentLevel: number[], nextLevel: number[]): number => {
        let result: number = orderType === OrderType.BIDS ? nextLevel[0] - currentLevel[0]: currentLevel[0] - nextLevel[0];
        return result;
      }
    );

    return (
      sortedLevelsByPrice.map((level, idx) => {
        const calculatedTotal: number = level[2];
        const total: string = formatNumber(calculatedTotal);
        const size: string = formatNumber(level[1]);
        const price: string = formatPrice(level[0]);

        return (
          <div key={idx + level[3]}>
            <OrderBookBody key={size + total}
                           total={total}
                           size={size}
                           price={price}
                           reversedTableCell={orderType === OrderType.ASKS}/>
          </div>
        );
      })
    );
  };
    return <Container>
      {bids.length && asks.length ?
        <Grid container spacing={2}>
          <Grid item sm={6}>
            <TableContainer>
              <OrderBookHeader reversedTableCell={false} />
              <div>{buildOrderBookList(bids, OrderType.BIDS)}</div>
            </TableContainer>
          </Grid>
          <Grid item sm={6}>
            <TableContainer>
              <OrderBookHeader reversedTableCell={true} />
              <div>
                {buildOrderBookList(asks, OrderType.ASKS)}
              </div>
            </TableContainer>
          </Grid>
        </Grid> :
        <Grid
          sx={{mb:2}}
          container
          direction="row"
          justifyContent="center"
          alignItems="center">
          <CircularProgress />
        </Grid>
      }
  </Container>
}

export default OrderBook;