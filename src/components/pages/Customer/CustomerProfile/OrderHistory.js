import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText } from '@mui/material';

const OrderHistory = ({ orderHistory }) => {
  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
      <Typography variant="h6" gutterBottom>Order History</Typography>
      <List>
        {orderHistory.map((order, index) => (
          <ListItem key={index}>
            <ListItemText primary={order} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default OrderHistory;
