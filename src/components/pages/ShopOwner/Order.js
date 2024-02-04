import React from 'react';
import { ListItem, ListItemAvatar, Avatar, ListItemText, Typography } from "@mui/material";

const Order = ({ flower, }) => (
  <ListItem alignItems="flex-start" divider>
    <ListItemAvatar>
      <Avatar alt={flower.name} src={flower.image} variant="square" sx={{ width: 56, height: 56, marginRight: 2 }} />
    </ListItemAvatar>
    <ListItemText
      primary={`${flower.name} - $${flower.price}`} // Include the price in the primary text
      secondary={
        <>
          <Typography
            sx={{ display: 'inline' }}
            component="span"
            variant="body2"
            color="text.primary"
          >
            Quantity: {flower.quantity}

          </Typography>
          
        </>
      }
    />
  </ListItem>
);

export default Order;
