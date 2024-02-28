import React, { useState, useEffect } from 'react';
import { Box, Grid, Select, MenuItem, Toolbar, TextField, CircularProgress, Container, useMediaQuery, useTheme } from '@mui/material';

import FlowerShopCard from './ShopCard';
import Header from '../../../shared/Layout/Header';
import { fetchShopOwners } from '../../../../Services/clientService';
import { useCart } from '../CustomerCheckout/Cart';


const ShopsPage = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('');
  const { clearCart } = useCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    clearCart();
    const loadShopOwners = async () => {
      try {
        const owners = await fetchShopOwners();
        // Assuming owners already include rating information
        setShops(owners);
      } catch (error) {
        console.error("Error fetching shop data: ", error);
      } finally {
        setLoading(false);
      }
    };

    loadShopOwners();
  }, []);
// Helper function to get the current day name
const getCurrentDayName = () => {
  const date = new Date();
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return days[date.getDay()];
};

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // First, filter shops by search query
  let filteredShops = shops.filter(shop => shop.storeName.toLowerCase().includes(searchQuery));

  // Then, sort filtered shops based on the selected filter
  switch (filter) {
    case "rating":
      filteredShops.sort((a, b) => (b.ratings.average || 0) - (a.ratings.average || 0));
      console.log(filteredShops);
      break;
    case "open":
      const currentDayName = getCurrentDayName();
      filteredShops = filteredShops.filter(shop => shop.workingDays && shop.workingDays[currentDayName]);
      break;
      // Implement open today sorting if applicable
    case "jobAd":
      filteredShops = filteredShops.filter(shop => shop.jobAd.title !== '' && shop.jobAd.description !== '');
    break;
    default:

        filteredShops=shops;
      // No sorting or a default sorting mechanism
  }

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
    <Box sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row', // Stack vertically on mobile
          alignItems: 'center',
          height: isMobile ? 'auto' : 'auto', // Adjust height on mobile
        }}>
          <TextField
            label="Search Shops"
            variant="outlined"
            fullWidth // Always full width
            margin="normal"
            onChange={handleSearchChange}
            size="medium"
          />
          <Select
            value={filter}
            onChange={handleFilterChange}
            displayEmpty
            inputProps={{ 'aria-label': 'Filter Shops' }}
            fullWidth // Always full width
            variant="outlined"
            sx={{ mt: isMobile ? 2 : 0, width: isMobile ? '100%' : 'auto' }} // Ensure full width on mobile
          >
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value="rating">Rating</MenuItem>
            <MenuItem value="open">Open Today</MenuItem>
            <MenuItem value="jobAd">Job Ad</MenuItem>
          </Select>
        </Box>
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

export default ShopsPage;
