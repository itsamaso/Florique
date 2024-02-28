import React, { useState, useEffect } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../Services/firebase";
import { getAuth } from "firebase/auth";
import { 
  Container, TextField, CircularProgress, Grid, Typography, Button,
  List, ListItem, ListItemText, Stepper, Step, StepLabel, Paper, Box, Divider 
} from '@mui/material';
import { fetchCustomerData,getPaymentDetails,fetchCustomerOrders,updateClient,fetchBouquetOrders } from '../../../../Services/clientService';
import CurrentOrderStatus from './CurrentOrderStatus';
import CreditCardPayment from '../CustomerCheckout/CreditCardPayment';
import OrderHistory from './OrderHistory';
import Header from '../../../shared/Layout/Header';
const steps = ['Received', 'paid', 'prepared', 'delivered'];

function CustomerProfile() {
  const { currentUser } = getAuth();

  
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

  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(0);
  const [orderHistory, setOrderHistory] = useState([]);
  const [BorderHistory, setBorderHistory] = useState([]);
  useEffect(() => {
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchCustomerData();
        const orders = await fetchCustomerOrders();
        const bouquetOrders = await fetchBouquetOrders();

        if (data) {
          setOrderHistory(orders);
          console.log(orders);

          setBorderHistory(bouquetOrders);
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
  if (loading) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );

  }

  const handleUpdate = async () => {
    try {
      await updateClient(customer);
      alert("Profile updated successfully");
    }
    catch (error) {
      console.error("Error updating customer data:", error);
      alert("Error updating profile");
    }
  }
  return (
    <Container maxWidth="md" sx={{ mb: 4 }}>
      <Header />

      <Paper elevation={3} sx={{ p: 4, mb: 4 ,mt:10}}>
    
        <Typography variant="h4" gutterBottom>Customer Profile</Typography>
        <Grid container spacing={3}>
          {/* Personal Information Fields */}
          <Grid item xs={12}>
            <TextField
              label="First Name"
              name="firstName"
              fullWidth
              value={customer.firstName}
              InputProps={{ readOnly: true }}

            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Last Name"
              name="lastName"
              fullWidth
              value={customer.lastName}
              InputProps={{ readOnly: true }}

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
          <Grid item xs={12}>
            <Button variant="contained" color="primary" fullWidth onClick={handleUpdate}>
              Update Profile
            </Button>
          </Grid>
          {/* Credit Card Payment Form  AND  coupuns*/}

          <Grid container spacing={5}>
  {/* Credit Card Payment Component */}
  <Grid item xs={12} md={6}>
    <Paper elevation={3} sx={{ p: 3,mt:3 }}>

    <CreditCardPayment />
    </Paper>
  </Grid>

  {/* Free Delivery Coupons */}
  <Grid item xs={12} md={6}>
  <Paper elevation={3} sx={{ p: 4,mt:3 }}>
      <Typography variant="h6">Free Delivery Coupons</Typography>
      <Typography variant="body1">You have {customer.coupons.length} coupons available.</Typography>

      <Divider sx={{ my: 2 }} />

      <List>
        {customer.coupons.map((coupon) => (
          <ListItem key={coupon.id}>
            <ListItemText primary={`Coupon: ${coupon.value} off`} />
          </ListItem>
        ))}
      </List>
    </Paper>
  </Grid>
</Grid>

        
          

        </Grid>
        
      </Paper>
      <OrderHistory orders={orderHistory} borders={BorderHistory}  />

    </Container>
    
  );
}

export default CustomerProfile;
