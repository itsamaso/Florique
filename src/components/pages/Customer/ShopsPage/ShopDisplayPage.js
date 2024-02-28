import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Paper, Grid, Typography, Box, Toolbar, CircularProgress, Container, CardMedia, Divider, Button } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import StorefrontIcon from '@mui/icons-material/Storefront';
import FlowerCardClient from './FlowerCardClient';
import Header from '../../../shared/Layout/Header';
import { useCart , } from '../CustomerCheckout/Cart';
import { fetchFlowersForShopOwner, fetchShopData ,postApplication} from '../../../../Services/clientService';
import JobAdModal from './JobAd';
import { useNavigate } from 'react-router-dom';

import IconButton from '@mui/material/IconButton';
// Assuming InstagramIcon is correctly imported from your icons setup or direct SVG
import InstagramIcon from '@mui/icons-material/Instagram'; 

const FlowerDisplayPage = () => {
  const [Items, setItems] = useState([]);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { addToCart } = useCart();
  const [modalOpen, setModalOpen] = useState(true);
  const navigate = useNavigate();
  const goToBuildBouquet = () => {
    navigate(`/build/${id}`);
  };

  const handleSubmitApplication = async (applicant) => {
  
    console.log(applicant);
    try {
      await postApplication( applicant,id);
      alert("Application submitted successfully");
    } catch (error) {
      console.error("Error submitting application: ", error);
    }

    // Here, add your logic to send the applicant's data to your backend or wherever it needs to go
    setModalOpen(false); // Close the modal after submission
  };

  const InstagramIconButton = () => {
  const instagramUrl = "https://www.instagram.com/"+shop.socialMedia+"/";

  const handleInstagramClick = () => {
    window.open(instagramUrl, "_blank");
  };

  return (
    <IconButton onClick={handleInstagramClick} color="primary" aria-label="instagram">
      <InstagramIcon />
    </IconButton>
  );
};

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedItems = await fetchFlowersForShopOwner(id);
        console.log(fetchedItems);
        const fetchedShopData = await fetchShopData(id);
        setItems(fetchedItems);
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
 // Filter items by category
 const flowers = Items.filter(item => item.category === 'flowers');
 const wrappers = Items.filter(item => item.category === 'wrappers');

 return (
  <Container maxWidth="lg" sx={{ mt: 8, mb: 4 }}>
    <Header />
    <Toolbar />
    <Box sx={{ flexGrow: 1 }}>
      <Toolbar />
        {shop && (
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
            <InstagramIconButton />
          </Box>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              
          <Button variant="contained" color="primary" onClick={goToBuildBouquet}>
            Build a Bouquet
          </Button>

        </Box>

        {/* Flowers Section */}
        <Typography variant="h5" gutterBottom component="div" sx={{ mt: 4 }}>
          Our Flowers
        </Typography>
        <Paper elevation={6} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={4} justifyContent="center">
            {flowers.map(flower => (
              <Grid item key={flower.id} xs={12} sm={6} md={4} lg={3}>
                <FlowerCardClient flower={flower} onAddToCart={() => addToCart(flower)} />
              </Grid>
            ))}
          </Grid>
        </Paper>

        {/* Wrappers Section */}
        <Typography variant="h5" gutterBottom component="div" sx={{ mt: 4 }}>
          Our Wrappers
        </Typography>
        <Paper elevation={6} sx={{ p: 3 }}>
          <Grid container spacing={4} justifyContent="center">
            {wrappers.map(wrapper => (
              <Grid item key={wrapper.id} xs={12} sm={6} md={4} lg={3}>
                <FlowerCardClient flower={wrapper} onAddToCart={() => addToCart(wrapper)} />
              </Grid>
            ))}
          </Grid>
        </Paper>
    </Box>
    {/* JobAdModal component */}
    <JobAdModal open={modalOpen} setOpen={setModalOpen} shop={shop} onSubmitApplication={handleSubmitApplication} />
  </Container>
);
};


export default FlowerDisplayPage;
