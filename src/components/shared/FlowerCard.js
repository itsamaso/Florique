import React from 'react';
import { Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';

const FlowerCard = ({ flower, onAddToCart, onEdit, onDelete }) => {
  // Helper component for labeled data
  const LabeledData = ({ label, data }) => (
    <Typography variant="body2" color="text.secondary" paragraph>
      <strong>{label}:</strong> {data}
    </Typography>
  );
  const isLowStock = flower.stock < 10;



  
  return (
    <Card sx={{ 
      border: isLowStock ? '1px solid' : 'none',
      borderColor: isLowStock ? 'warning.main' : 'transparent',
      transition: 'border-color 0.3s ease', // Smooth transition for the border color
    }}>

     <CardMedia
  component="img"
  height="140"
  image={flower.image}
  alt={flower.name}
  sx={{
    objectFit: 'contain', // Ensures the full image is shown without cropping
    width: '100%', // Makes sure the image width is responsive to the card width
    maxHeight: '140px', // Optional: You can adjust the height as needed
  }}
/>

      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {flower.name} {/* Flower name is considered the title, so it's not labeled like other data. */}
        </Typography>
        <LabeledData label="Description" data={flower.description} />
        <LabeledData label="Stock" data={flower.stock ?? 'N/A'} /> {/* Using 'N/A' for undefined or null stock. */}
        <LabeledData label="Price" data={`$${flower.price}`} /> {/* Assuming price is always provided. */}
        <LabeledData label="Stock" data={flower.stock ?? 'N/A'} /> {/* Using 'N/A' for undefined or null quantity. */}
        <LabeledData label="Available" data={`${flower.availability }`} /> {/* Assuming price is always provided. */}
      </CardContent>
      <CardActions>
        {onAddToCart && <Button size="small" onClick={() => onAddToCart(flower)}>Add to Cart</Button>}
        <Button size="small" onClick={() => onEdit(flower)}>Edit</Button>
        <Button size="small" onClick={() => onDelete(flower.id)} color="primary">Delete</Button>
      </CardActions>
    </Card>
  );
};

export default FlowerCard;
