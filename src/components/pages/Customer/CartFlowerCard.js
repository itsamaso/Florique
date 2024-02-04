import React from 'react';
import { Card, CardMedia, CardContent, Typography, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const CartFlowerCard = ({ flower,onQuantityChange,withbuttons=false  }) => {

  const handleQuantityChange = (change) => {
    onQuantityChange(flower.id, flower.quantity + change);
  };

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <CardMedia
        component="img"
        sx={{ width: 100, height: 100 }} // Adjust size as needed
        image={flower.image}
        alt={flower.name}
      />
      <CardContent sx={{ flex: '1 0 auto' }}>
        <Typography variant="h6">
          {flower.name}
        </Typography>
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
         Price:{flower.price}
        </Typography>
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
          Quantity: {flower.quantity}


          {withbuttons && (
            <>
              <IconButton onClick={() => handleQuantityChange(-1)} disabled={flower.quantity <= 1}>
                <RemoveIcon />
              </IconButton>
              <IconButton onClick={() => handleQuantityChange(1)}>
                <AddIcon />
              </IconButton>
            </>
          )}
       
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CartFlowerCard;
