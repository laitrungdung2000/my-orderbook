import { useState } from 'react';
import './App.css';
import Header from './components/Header';
import { CryptoIds, CryptoPair, options } from './utils/constants';
import OrderBook from './components/OrderBook';
import { useAppDispatch } from './redux/hooks';
import { clearOrdersState, changeGroupTicketSize } from "./redux/slice/orderBookSlice";
import GroupFunctionButton from './components/GroupFunctionButton';

function App() {
  const [cryptoId, setCryptoId] = useState(CryptoIds.XBTUSD);
  const [isFeedKilled, setIsFeedKilled] = useState(false);
  const dispatch = useAppDispatch();

  const toggleCryptoId = (): void => {
    dispatch(clearOrdersState());
    setCryptoId(CryptoPair[cryptoId]);
    dispatch(changeGroupTicketSize(options[CryptoPair[cryptoId]][0]));
  };

  const killFeed = (): void => {
    setIsFeedKilled(!isFeedKilled);
  }

  return (
    <div>
      <Header options={options[cryptoId]}/>
      <OrderBook CryptoId={cryptoId} isFeedKilled={isFeedKilled}/>
      <GroupFunctionButton switchFeed={toggleCryptoId} killFeed={killFeed} isFeedKilled={isFeedKilled} />
    </div>
  );
}

export default App;
