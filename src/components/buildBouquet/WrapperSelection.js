import React from 'react';
import { Grid, Card, CardMedia, CardActionArea, Typography, Box } from '@mui/material';
import DraggableFlower from './DraggableFlower';

const WrapperSelection = ({ wrappers, onSelectWrapper, flowers, flowerCounts }) => {
    const onSelect = (id) => {
      console.log(id);
    }
    // Calculate the total price
 

    return (
        
        <Grid container spacing={1} alignItems="center">
            <Grid item xs={12}>
                <Typography variant="h5" gutterBottom align="center" component="div">
                    Select a Wrapper
                </Typography>
                <Grid container spacing={2}>
                    {wrappers.map((wrapper) => (
                        <Grid item xs={6} sm={4} md={3} key={wrapper.id}>
                            <Card sx={{ maxWidth: '100%', m: 1 }} onClick={() => onSelectWrapper(wrapper.id)}>
                                <CardActionArea>
                                    <CardMedia
                                        component="img"
                                        image={wrapper.fullImage}
                                        alt={`${wrapper.name} full`}
                                        sx={{ width: '100%', height: 'auto' }} // Adjusted for full width and auto height
                                    />
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Grid>

       
        </Grid>
    );
};

export default WrapperSelection;
