import React, { useState, useEffect } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../Services/firebase";
import { getAuth } from "firebase/auth";
import { 
  Container, TextField, CircularProgress, Grid, Typography, Button,
  List, ListItem, ListItemText, Stepper, Step, StepLabel, Paper, Box, Divider 
} from '@mui/material';
import { fetchCustomerData,getPaymentDetails,saveCreditCardToFirebase } from '../../../../Services/clientService';
import CurrentOrderStatus from './CurrentOrderStatus';
import PaymentDetailsForm from './PaymentDetailsForm';
import OrderHistory from './OrderHistory';
const steps = ['Received', 'paid', 'prepared', 'delivered'];

function CustomerProfile() {
  const [customer, setCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    orderHistory: [],
    coupons: 0,
    creditCard: {}
  });
  const [editingCreditCard, setEditingCreditCard] = useState(false); // New state to track editing status

  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchCustomerData();
        if (data) {
          setCustomer(data);
          if (data.orderStatus) {
            setActiveStep(steps.indexOf(data.orderStatus));
          }
          if (data.creditCard) {
            const paymentDetails = await getPaymentDetails(data.creditCard);
            setCustomer({ ...data, creditCard: paymentDetails });
          }
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };
  const handleCreditCardChange = (name, value) => {
    setCustomer({
      ...customer,
      creditCard: { ...customer.creditCard, [name]: value }
    });
    setEditingCreditCard(true);
  };

  const handleCreditCardSaved = () => {
    setEditingCreditCard(false); // Editing is done
  };
 const  handleAddCreditCard = async (e) => {
    e.preventDefault();
    try {
      await saveCreditCardToFirebase(customer.creditCard);
      console.log('Credit card details saved successfully');
      setEditingCreditCard(false); // Editing is done
    } catch (error) {
      console.error('Error saving credit card details:', error);
    }
  };
  
  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }
  const showCreditCardForm = !customer.creditCard.cardNumber || editingCreditCard;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>Customer Profile</Typography>
        <Grid container spacing={3}>
          {/* Personal Information Fields */}
          <Grid item xs={12}>
            <TextField
              label="First Name"
              name="firstName"
              fullWidth
              value={customer.firstName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Last Name"
              name="lastName"
              fullWidth
              value={customer.lastName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              type="email"
              name="email"
              fullWidth
              value={customer.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone"
              type="tel"
              name="phone"
              fullWidth
              value={customer.phone}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address"
              name="address"
              fullWidth
              value={customer.address}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </Paper>


      <CurrentOrderStatus activeStep={activeStep} steps={steps} />

    

      {/* Coupons and Payment Details */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h6">Free Delivery Coupons</Typography>
            <Typography variant="body1">You have {customer.coupons} coupons available.</Typography>
          </Paper>
        </Grid>
        </Grid>
        {/* Payment Details */}
        <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h6">Payment Details</Typography>
            {showCreditCardForm ? (
        <PaymentDetailsForm
          creditCard={customer.creditCard}
          onCreditCardChange={handleCreditCardChange}
          onCreditCardSaved={handleCreditCardSaved}
        />
            ) : (
              <Grid container spacing={2}>
                {/* Display Credit Card Details */}
                <Typography variant="body1">Card Number: <Typography component="span" variant="body2" color="textSecondary">**** **** **** {customer.creditCard.cardNumber.slice(-4)}</Typography></Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="body1">Expire: <Typography component="span" variant="body2" color="textSecondary">{customer.creditCard.expiryDate}</Typography></Typography>
              </Grid>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CustomerProfile;
