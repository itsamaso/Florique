import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useParams } from 'react-router-dom';
import { createOrder, getCustomerCoupons,getPaymentDetails } from '../../../Services/clientService';
import { useCart } from './Cart'; // Adjust import path based on your project structure
import CartFlowerCard from './CartFlowerCard'; // Adjust import path based on your project structure
import CreditCardPayment from './CreditCardPayment';

const CheckoutPage = () => {
  const { id } = useParams();
  const { cart, clearCart, increaseQuantity, decreaseQuantity, getTotalCost } = useCart();
  const [customerCoupons, setCustomerCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState('');
  const [appliedCouponValue, setAppliedCouponValue] = useState(0);
  const [paymentDetails, setPaymentDetails] = useState({});
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
    // Define applyCoupon inside useEffect if it's only used here
    const applyCoupon = () => {
      const coupon = customerCoupons.find(c => c.id === selectedCoupon);
      if (coupon) {
        setAppliedCouponValue(coupon.value);
      }
    };
  
    // Recalculate total cost whenever cart changes or a coupon is applied
    if (selectedCoupon) {
      applyCoupon();
    } else {
      // Reset to total cost without any coupon applied
      setAppliedCouponValue(0);
    }
  }, [cart, selectedCoupon, customerCoupons]); // Now, applyCoupon isn't a dependency anymore
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const flowerOrders = cart.map(item => ({ id: item.id, quantity: item.quantity }));

    try {
      if (selectedCoupon) {
    

        // Apply coupon to order if selected
        await createOrder(id, flowerOrders, selectedCoupon);
      }
      else {
        await createOrder(id, flowerOrders);
      }
      clearCart();
      getCustomerCoupons(id);
      alert('Order submitted successfully');
      setCustomerCoupons([]);
      setSelectedCoupon('');
      setAppliedCouponValue(0);
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>Checkout</Typography>
      <Grid container spacing={3}>
        {/* Shipping Details */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Shipping Details</Typography>
              {/* Shipping Details Form or Content here */}
              <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSubmit}>
                Submit Order
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Order Summary</Typography>
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
              <Typography sx={{ mt: 2 }} variant="h6">
                Total Cost: ${getTotalCost() - appliedCouponValue}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Payment Method */}
        <Grid item xs={12}>
          <CreditCardPayment />
        </Grid>

        {/* Coupons */}
        {customerCoupons.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Apply a Coupon</Typography>
                <FormControl fullWidth>
                  <InputLabel id="coupon-select-label">Coupon</InputLabel>
                  <Select
                    labelId="coupon-select-label"
                    value={selectedCoupon}
                    label="Coupon"
                    onChange={(e) => setSelectedCoupon(e.target.value)}
                  >
                    {customerCoupons.map((coupon) => (
                      <MenuItem key={coupon.id} value={coupon.id}>{`Coupon: ${coupon.value} off`}</MenuItem>
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
