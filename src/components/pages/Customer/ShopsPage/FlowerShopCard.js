import React from 'react';
import { Card, CardContent, Typography, CardMedia, CardActions, Button, Accordion, AccordionSummary, AccordionDetails, Grid, IconButton, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import StorefrontIcon from '@mui/icons-material/Storefront';

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
