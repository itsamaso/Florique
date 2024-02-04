import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, CardActions, Button, Box, useTheme, useMediaQuery } from '@mui/material';

const FlowerCardClient = ({ flower, onAddToCart }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { image, name, description, price } = flower;

  return (
    <Card sx={{ maxWidth: 345, ':hover': { boxShadow: theme.shadows[10] }, m: 2 }}>
      <Box
        sx={{
          height: isMobile ? 200 : 300, // Responsive height
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden'
        }}
      >
        {/* Image with label */}
        <Typography variant="caption" display="block" gutterBottom>
        </Typography>
        <img
          src={image}
          alt={name}
          style={{
            height: '100%',
            width: 'auto',
            objectFit: 'contain',
          }}
          loading="lazy"
        />
      </Box>
      <CardContent>
        {/* Name with label */}
        <Typography gutterBottom variant="h6" component="div">
          Name: {name}
        </Typography>
        {/* Description with label */}
        <Typography variant="body2" color="text.secondary" paragraph>
          Description: {description.length > 100 ? `${description.substring(0, 100)}...` : description} {/* Truncate long text */}
        </Typography>
        {/* Price with label */}
        <Typography variant="body2" color="text.secondary" paragraph>
          <strong>Price:</strong> ${price}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <Button size="small" onClick={onAddToCart} variant="contained" color="primary" fullWidth>
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};

FlowerCardClient.propTypes = {
  flower: PropTypes.shape({
    image: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired, // Ensure price is included and properly typed
  }).isRequired,
  onAddToCart: PropTypes.func,
};

FlowerCardClient.defaultProps = {
  onAddToCart: () => {}, // Default function for onAddToCart
};

export default FlowerCardClient;
