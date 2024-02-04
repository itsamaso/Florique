import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography, AppBar, Toolbar, TextField, CircularProgress, Container, useMediaQuery, useTheme } from '@mui/material';

import FlowerShopCard from './FlowerShopCard';
import Header from '../../../shared/Layout/Header';
import { fetchShopOwners, } from '../../../../Services/clientService';
import { useCart } from '../Cart';

const ShopDisplayPage = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { clearCart } = useCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    clearCart();
    const loadShopOwners = async () => {
      try {
        const owners = await fetchShopOwners();
        const shopsWithDetails = await Promise.all(owners.map(async (owner) => {
          return { ...owner,  };
        }));
        setShops(shopsWithDetails);
      } catch (error) {
        console.error("Error fetching shop data: ", error);
      } finally {
        setLoading(false);
      }
    };

    loadShopOwners();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filteredShops = shops.filter(shop => shop.storeName.toLowerCase().includes(searchQuery));

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Header title="Flower Shop" />
      <Toolbar />
      <TextField
        label="Search Shops"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={handleSearchChange}
        sx={{ mb: 4 }}
      />
      <Grid container spacing={isMobile ? 2 : 3}>
        {filteredShops.map(shop => (
          <Grid item key={shop.id} xs={12} sm={6} md={4}>
            <FlowerShopCard shop={shop} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ShopDisplayPage;
