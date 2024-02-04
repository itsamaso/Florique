import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, Modal } from '@mui/material';
import { saveCreditCardToFirebase, getPaymentDetails } from '../../../Services/clientService';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const CreditCardPayment = () => {
  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      const paymentDetails = await getPaymentDetails();
      if (paymentDetails) {
        setCardDetails(paymentDetails);
        setPaymentMethod('creditCard'); // Setting 'creditCard' as default if details exist
      }
    };
    fetchPaymentDetails();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleCardChange = (event) => {
    const { name, value } = event.target;
    setCardDetails(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSavePaymentMethod = async () => {
    try {
      await saveCreditCardToFirebase(cardDetails);
      setPaymentMethod('creditCard'); // Update paymentMethod state upon successful save
      handleClose();
    } catch (error) {
      console.error('Error saving credit card:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Payment Method</Typography>
      {!paymentMethod ? (
        <Button variant="outlined" onClick={handleOpen}>Add Credit Card</Button>
      ) : (
        <>
          <Typography>Card Number: {cardDetails.cardNumber}</Typography>
          <Typography>Expiry Date: {cardDetails.expiryDate}</Typography>
          <Button variant="outlined" onClick={handleOpen} sx={{ mt: 2 }}>Edit Credit Card</Button>
        </>
      )}

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="credit-card-modal-title"
        aria-describedby="credit-card-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="credit-card-modal-title" variant="h6" component="h2" gutterBottom>
            {paymentMethod ? "Edit Credit Card" : "Add Credit Card"}
          </Typography>
          <TextField
            fullWidth
            label="Card Number"
            name="cardNumber"
            value={cardDetails.cardNumber}
            onChange={handleCardChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Expiry Date"
            name="expiryDate"
            value={cardDetails.expiryDate}
            onChange={handleCardChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="CVV"
            name="cvv"
            value={cardDetails.cvv}
            onChange={handleCardChange}
            margin="normal"
          />
          <Button variant="contained" onClick={handleSavePaymentMethod} sx={{ mt: 2 }}>
            Save Payment Method
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default CreditCardPayment;
