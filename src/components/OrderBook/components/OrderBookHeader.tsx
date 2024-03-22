import { FC } from 'react';
import { Grid, TableCell } from '@mui/material';
import { OrderBookHeaderProps } from '../../../interfaces/OrderBookInterfaces';

const OrderBookHeader: FC<OrderBookHeaderProps> = ({reversedTableCell = false}) => {
  return (
    <Grid container spacing={2}>
      {reversedTableCell ?
        <>
            <Grid item xs={4}>
                <TableCell>PRICE</TableCell>
            </Grid>
            <Grid item xs={4}>
            <TableCell>SIZE</TableCell>
            </Grid>
            <Grid item xs={4}>
            <TableCell>TOTAL</TableCell>
            </Grid>
        </> :
        <>
            <Grid item xs={4}>
                <TableCell>TOTAL</TableCell>
            </Grid>
            <Grid item xs={4}>
                <TableCell>SIZE</TableCell>
            </Grid>
            <Grid item xs={4}>
                <TableCell>PRICE</TableCell>
            </Grid>
        </>}
    </Grid>
  );
};

export default OrderBookHeader;
