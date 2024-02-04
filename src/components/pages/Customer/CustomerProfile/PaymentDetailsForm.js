import React from 'react';
import { TextField, Grid, Typography, Button, Paper, Box } from '@mui/material';

const PaymentDetailsForm = ({ creditCard, onCreditCardChange, onCreditCardSaved }) => {
  const handleCreditCardChange = (e) => {
    onCreditCardChange(e.target.name, e.target.value);
  };

  const handleSaveCreditCard = async (e) => {
    e.preventDefault();
    await onCreditCardSaved(creditCard); // Assuming the saving logic is now handled or triggered in the parent component
  };

  return (
    <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Payment Details
      </Typography>
      
      <Box component="form" noValidate autoComplete="off">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Card Number"
              name="cardNumber"
              fullWidth
              value={creditCard.cardNumber || ''}
              onChange={handleCreditCardChange}
              variant="outlined"
              placeholder="1234 5678 9012 3456"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="Expiry Date"
              name="expiryDate"
              fullWidth
              value={creditCard.expiryDate || ''}
              onChange={handleCreditCardChange}
              variant="outlined"
              placeholder="MM/YY"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <TextField
              label="CVV"
              name="cvv"
              fullWidth
              value={creditCard.cvv || ''}
              onChange={handleCreditCardChange}
              variant="outlined"
              placeholder="123"
              sx={{ mb: 2 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleSaveCreditCard}>
              Save Card
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default PaymentDetailsForm;
