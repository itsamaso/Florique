import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, FormControl, InputLabel, Select, MenuItem, Divider } from '@mui/material';
import { useParams } from 'react-router-dom';
import { createOrder, getCustomerCoupons, getPaymentDetails } from '../../../../Services/clientService';
import { useCart } from './Cart'; // Adjust import path based on your project structure
import CartFlowerCard from './CartFlowerCard'; // Adjust import path based on your project structure
import CreditCardPayment from './CreditCardPayment';

import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { id } = useParams();
  const { cart, clearCart, increaseQuantity, decreaseQuantity, getTotalCost } = useCart();
  const [customerCoupons, setCustomerCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState('');
  const [appliedCouponValue, setAppliedCouponValue] = useState(0);
  const [paymentDetails, setPaymentDetails] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadCustomerCoupons = async () => {
      try {
        const coupons = await getCustomerCoupons(id);
        const paymentDetails = await getPaymentDetails(id);

        setPaymentDetails(paymentDetails);
        setCustomerCoupons(coupons);
        
      } catch (error) {
        console.error('Error loading customer coupons:', error);
      }
    };

    if (id) {
      loadCustomerCoupons();
    }
  }, [id]);

  useEffect(() => {
    const applyCoupon = () => {
      const coupon = customerCoupons.find(c => c.id === selectedCoupon);
      if (coupon) {
        setAppliedCouponValue(coupon.value);
      }
    };

    if (selectedCoupon) {
      applyCoupon();
    } else {
      setAppliedCouponValue(0);
    }
  }, [cart, selectedCoupon, customerCoupons]);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const flowerOrders = cart.map(item => ({ id: item.id, quantity: item.quantity }));

    try {
      if (selectedCoupon) {
        await createOrder(id, flowerOrders, selectedCoupon);
      } else {
        await createOrder(id, flowerOrders);
      }
      clearCart();
      alert('Order submitted successfully');
      setCustomerCoupons([]);
      setSelectedCoupon('');
      setAppliedCouponValue(0);
      navigate('/shops');
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: '1200px', margin: 'auto', padding: 3 }}>
      <Typography variant="h4" gutterBottom component="div" sx={{ mb: 4 }}>
        Checkout
      </Typography>
      <Grid container spacing={4}>
        {/* Shipping Details - Could be expanded with actual form fields */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                Shipping Details
              </Typography>
              <Divider sx={{ my: 2 }} />
              {/* Shipping Details Form or Content */}
              <Typography gutterBottom>Your shipping details will be displayed here.</Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSubmit}>
                Submit Order
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                Order Summary
              </Typography>
              <Divider sx={{ my: 2 }} />
              {cart.length > 0 ? (
                cart.map((item) => (
                  <CartFlowerCard
                    withbuttons={true}
                    key={item.id}
                    flower={item}
                    onQuantityChange={(id, newQuantity) => {
                      if (newQuantity > item.quantity) {
                        increaseQuantity(id);
                      } else {
                        decreaseQuantity(id);
                      }
                    }}
                  />
                ))
              ) : (
                <Typography>Your cart is empty.</Typography>
              )}
              <Typography variant="h6" sx={{ mt: 2 }}>
                Total Cost: ${getTotalCost() - appliedCouponValue}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Payment Method - This assumes CreditCardPayment is a well-defined component */}
        <Grid item xs={12}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h5" component="div" gutterBottom>
                Payment Method
              </Typography>
              <Divider sx={{ my: 2 }} />
              <CreditCardPayment />
            </CardContent>
          </Card>
        </Grid>

        {/* Coupons - Shown only if coupons are available */}
        {customerCoupons.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  Apply a Coupon
                </Typography>
                <Divider sx={{ my: 2 }} />
                <FormControl fullWidth>
                  <InputLabel id="coupon-select-label">Coupon</InputLabel>
                  <Select
                    labelId="coupon-select-label"
                    value={selectedCoupon}
                    label="Coupon"
                    onChange={(e) => setSelectedCoupon(e.target.value)}
                  >
                    {customerCoupons.map((coupon) => (
                      <MenuItem key={coupon.id} value={coupon.id}>
                        {`Coupon: ${coupon.value} off`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default CheckoutPage;
