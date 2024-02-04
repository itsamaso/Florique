import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Paper, Grid, Typography, Box, Toolbar, CircularProgress, Container, CardMedia, Divider } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import StorefrontIcon from '@mui/icons-material/Storefront';
import FlowerCardClient from './Customer/FlowerCardClient';
import Header from '../shared/Layout/Header';
import { useCart } from '../pages/Customer/Cart';
import { fetchFlowersForShopOwner, fetchShopData } from '../../Services/clientService';

const FlowerDisplayPage = () => {
  const [flowers, setFlowers] = useState([]);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { addToCart } = useCart();

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedFlowers = await fetchFlowersForShopOwner(id);
        const fetchedShopData = await fetchShopData(id);
        setFlowers(fetchedFlowers);
        setShop(fetchedShopData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Header />
      <Toolbar />
      <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
        {shop && (
          <>
            <Box sx={{ mb: 4, textAlign: 'center', position: 'relative' }}>
              {shop.storePhoto && (
                <CardMedia
                  component="img"
                  image={shop.storePhoto}
                  alt={`${shop.storeName} Store Photo`}
                  sx={{ width: '100%', maxHeight: '400px', objectFit: 'cover', borderRadius: '4px', mb: 2 }}
                />
              )}
              <Typography variant="h4" gutterBottom component="div" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <StorefrontIcon fontSize="large" />
                {shop.storeName}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <LocationOnIcon />
                {shop.storeAddress}
              </Typography>
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <PhoneIcon />
                {shop.storePhone}
              </Typography>
            </Box>
            <Typography variant="h5" gutterBottom component="div">Our Flowers</Typography>
          </>
        )}
        <Paper elevation={6} sx={{ p: 3 }}>
          <Grid container spacing={4} justifyContent="center">
            {flowers.map((flower) => (
              <Grid item key={flower.id} xs={12} sm={6} md={4} lg={3}>
                <FlowerCardClient flower={flower} onAddToCart={() => addToCart(flower)} />
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default FlowerDisplayPage;
