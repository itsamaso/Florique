import React from 'react';
import { Card, CardContent, Typography,Box, CardMedia, CardActions, Button, Accordion, AccordionSummary, AccordionDetails, Grid, IconButton, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import StorefrontIcon from '@mui/icons-material/Storefront';
import Rating from '@mui/material/Rating';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useState } from 'react';
const RatingsCarousel = ({ shop }) => {
  // State to keep track of the current index
  const [currentIndex, setCurrentIndex] = useState(0);

  // Function to navigate to the previous rating
  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : shop.ratings.ratings.length - 1));
  };

  // Function to navigate to the next rating
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % shop.ratings.ratings.length);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <IconButton onClick={handlePrev} aria-label="previous rating">
        <ArrowBackIcon />
      </IconButton>
      <Box sx={{ flexGrow: 1, overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
        {shop.ratings.ratings.length > 0 && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {shop.ratings.ratings[currentIndex].customerName}: {shop.ratings.ratings[currentIndex].comment}
            </Typography>
            <Rating value={shop.ratings.ratings[currentIndex].rating} size="small" readOnly />
          </Box>
        )}
      </Box>
      <IconButton onClick={handleNext} aria-label="next rating">
        <ArrowForwardIcon />
      </IconButton>
    </Box>
  );
};

const FlowerShopCard = ({ shop }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleGoToShop = () => {
    navigate(`/shop/${shop.id}`);
  };

  return (
    <Card raised sx={{ maxWidth: 345, m: 2, overflow: 'visible', borderRadius: theme.shape.borderRadius }}>
      {shop.storePhoto && (
        <CardMedia
          component="img"
          height="200"
          image={shop.storePhoto}
          alt={`${shop.storeName} store image`}
          sx={{ objectFit: 'cover', borderTopLeftRadius: theme.shape.borderRadius, borderTopRightRadius: theme.shape.borderRadius }}
        />
      )}

      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {shop.storeName}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Owner: {shop.fullName}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Address: {shop.storeAddress}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Social Media: {shop.socialMedia}
        </Typography>
        </CardContent>

        <Accordion sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Box sx={{ display: 'flex', alignItems: 'start', justifyContent:'space-between' }}>
     <Typography  >  Ratings: &nbsp; &nbsp; &nbsp; &nbsp;  &nbsp; &nbsp;  &nbsp; &nbsp;   </Typography>
    
    
    <Rating value={ shop.ratings.average}  size='medium' readOnly />
    </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0 }}>
    {/* Display ratings if available */}
{shop.ratings.ratings && shop.ratings.ratings.length > 0 && (
  <Grid item xs={12}>

    <RatingsCarousel shop={shop} />



  </Grid>
)}
      </AccordionDetails>
    </Accordion>


      <Accordion sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>Contact Details</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
            <EmailIcon color="action" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Email: {shop.email}
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
            <PhoneIcon color="action" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Personal: {shop.personalPhone}
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
            <PhoneIcon color="action" sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Store: {shop.storePhone}
            </Typography>
          </Grid>
        
        </Grid>
      </AccordionDetails>
    </Accordion>

      <CardActions sx={{ justifyContent: 'center', padding: theme.spacing(2) }}>
        <Button
          startIcon={<StorefrontIcon />}
          variant="contained"
          color="primary"
          onClick={handleGoToShop}
          fullWidth
          sx={{ textTransform: 'none', fontSize: theme.typography.button.fontSize }}
        >
          Visit Shop
        </Button>
      </CardActions>
    </Card>
  );
};

export default FlowerShopCard;


