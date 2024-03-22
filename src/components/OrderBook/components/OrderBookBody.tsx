import { FC } from 'react';
import { Grid, TableCell } from '@mui/material';
import { OrderBookBodyProps } from '../../../interfaces/OrderBookInterfaces';

const OrderBookBody: FC<OrderBookBodyProps> = ({
                                                total,
                                                size,
                                                price,
                                                reversedTableCell = false
                                                }) => {
  return (
    <Grid container spacing={2}>
      {reversedTableCell ?
        <>
            <Grid item xs={4}>
                <TableCell sx={{color: 'error.main'}}>{price}</TableCell>
            </Grid>
            <Grid item xs={4}>
                <TableCell>{size}</TableCell>
            </Grid>
            <Grid item xs={4}>
                <TableCell>{total}</TableCell>
            </Grid>
        </> :
        <>
            <Grid item xs={4}>
                <TableCell>{total}</TableCell>
            </Grid>
            <Grid item xs={4}>
                <TableCell>{size}</TableCell>
            </Grid>
            <Grid item xs={4}>
                <TableCell sx={{color: 'success.main'}}>{price}</TableCell>
            </Grid>
        </>}
    </Grid>
  );
};

export default OrderBookBody;
