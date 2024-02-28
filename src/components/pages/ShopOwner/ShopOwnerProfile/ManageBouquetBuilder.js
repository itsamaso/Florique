import React, { useState } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Button, ToggleButton, Divider } from '@mui/material';

const initialFlowerData = [
  { id: 'flower-1', imagepath: '1.svg', price: '10', display: true },
  { id: 'flower-2', imagepath: '/2.svg', price: '20', display: true },
  { id: 'flower-3', imagepath: '/3.svg', price: '30', display: true },
  { id: 'flower-4', imagepath: '/4.svg', price: '40', display: true },
  { id: 'flower-5', imagepath: '/5.svg', price: '50', display: true },
  { id: 'flower-6', imagepath: '/6.svg', price: '60', display: true },
  { id: 'flower-7', imagepath: '/7.svg', price: '70', display: true },
];

const initialWrapperData = [
  { id: 'wrapper-1', name: 'Wrapper 1', topImage: '/Wrapper1Top.svg', bottomImage: '/Wrapper1Bot.svg', fullImage:'/Wrapper1.svg', display: true },
  { id: 'wrapper-2', name: 'Wrapper 2', topImage: '/Wrapper2Top.svg', bottomImage: '/Wrapper2Bot.svg', fullImage:'/Wrapper2.svg', display: true },
  { id: 'wrapper-3', name: 'Wrapper 3', topImage: '/Wrapper3Top.svg', bottomImage: '/Wrapper3Bot.svg', fullImage:'/Wrapper3.svg', display: true },
  { id: 'wrapper-4', name: 'Wrapper 4', topImage: '/Wrapper4Top.svg', bottomImage: '/Wrapper4Bot.svg', fullImage:'/Wrapper4.svg', display: true },
];

const ManageBouquetBuilder = () => {
  const [flowers, setFlowers] = useState(initialFlowerData);
  const [wrappers, setWrappers] = useState(initialWrapperData);

  const toggleDisplay = (id, isFlower = true) => {
    if (isFlower) {
      const updatedFlowers = flowers.map(flower => {
        if (flower.id === id) {
          return { ...flower, display: !flower.display };
        }
        return flower;
      });
      setFlowers(updatedFlowers);
    } else {
      const updatedWrappers = wrappers.map(wrapper => {
        if (wrapper.id === id) {
          return { ...wrapper, display: !wrapper.display };
        }
        return wrapper;
      });
      setWrappers(updatedWrappers);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>Flowers</Typography>
        <Divider />
      </Grid>
      {flowers.map((flower) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={flower.id}>
          <Card>
            <CardMedia
              component="img"
              sx={{ width: '100%', height: 'auto' }}
              image={flower.imagepath}
              alt={`Image of ${flower.id}`}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {flower.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Price: ${flower.price}
              </Typography>
              <Button size="small" onClick={() => toggleDisplay(flower.id, true)}>
                {flower.display ? 'Hide' : 'Show'}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Typography variant="h4" gutterBottom>Wrappers</Typography>
        <Divider />
      </Grid>
      {wrappers.map((wrapper) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={wrapper.id}>
          <Card>
            <CardMedia
              component="img"
              sx={{ width: '100%', height: 'auto' }}
              image={wrapper.fullImage}
              alt={`Image of ${wrapper.name}`}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {wrapper.name}
              </Typography>
              <ToggleButton
                size="small"
                value="check"
                selected={wrapper.display}
                onChange={() => toggleDisplay(wrapper.id, false)}
                sx={{ ml: 1 }} // Add some left margin for spacing
              >
                {wrapper.display ? 'Hide' : 'Show'}
              </ToggleButton>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ManageBouquetBuilder;
