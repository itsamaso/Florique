import React from 'react';
import { Grid, Card, CardMedia, CardActionArea, Typography, Box } from '@mui/material';
import DraggableFlower from './DraggableFlower';

const FlowerSelection = ({ flowers, flowerCounts }) => {
    const onSelect = (id) => {
      console.log(id);
    }
    // Calculate the total price
    const totalPrice = flowers.reduce((acc, flower) => {
        const count = flowerCounts[flower.id] || 0;
        const price = flower.price || 0;
        return acc + (count * price);
    }, 0);

    return (
        <Grid container spacing={1} alignItems="center">
       

            <Grid item xs={12}>
                <Typography variant="h5" gutterBottom align="center" component="div">
                    Choose Flowers
                </Typography>
                <Grid container spacing={1}>
                    {flowers.map((flower) => (
                        <Grid item xs={6} sm={4} md={3} key={flower.id}>
                            <Card sx={{ width: '100%' , m: 1 }}> {/* Adjusted maxWidth to '100%' */}
                                <CardActionArea>
                                    <Box sx={{ position: 'relative' }}>
                                        <DraggableFlower key={flower.id}price={flower.price} id={flower.id} imagepath={flower.imagepath} onSelect={onSelect} />
                                        <Typography variant="subtitle1" sx={{ position: 'absolute', bottom: 0, right: 0, m: 1, background: 'rgba(255, 255, 255, 0.7)', borderRadius: '5px', p: '2px' }}>
                                            {flowerCounts[flower.id] || 0}
                                        </Typography>
                                    </Box>
                                </CardActionArea>
                            </Card>
                        </Grid>
                        
                    ))}
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Typography variant="h5" align="center" component="div" sx={{ mt: 0 }}>
                    Total Price: ${totalPrice}
                </Typography>
            </Grid>
        </Grid>
    );
};

export default FlowerSelection;
