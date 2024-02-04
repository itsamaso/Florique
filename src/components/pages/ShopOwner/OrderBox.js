import { Modal, TextField, Box, Button, Typography, Card, CardContent, CardActions, Grid, List, Divider } from '@mui/material';
import React, { useState } from 'react';
import Order from './Order'; // Ensure the path is correct
import { updateOrderStatus,giveCoupon } from "../../../Services/shopOwnerService";


const OrdersBox = ({ orders, onStatusChange }) => {
  const [open, setOpen] = useState(false); // State to control modal visibility
  const [couponValue, setCouponValue] = useState(''); // State to hold the coupon value
  const [selectedOrderId, setSelectedOrderId] = useState(null); // State to hold the selected order ID

  const handleOpen = (orderId) => {
    setOpen(true);
    setSelectedOrderId(orderId);
  };

  const handleClose = () => {
    setOpen(false);
    setCouponValue('');
  };

  // This function could be expanded to include logic for submitting the coupon
  const handleSubmitCoupon = async () => {
    console.log("Submitting coupon for order ID:", selectedOrderId, "with value:", couponValue);
    await giveCoupon(selectedOrderId, couponValue); // Implement the logic to submit the coupon value for the selected order here
    // Implement the logic to submit the coupon value for the selected order here
    handleClose(); // Close the modal after submission
  };

  const handleChangeStatus = async (orderId) => {
    try {
      await updateOrderStatus(orderId);
      onStatusChange(); // This triggers the parent component to reload data
    } catch (error) {
      alert('Error updating order status: not enough stock', error);
    }
  };

  // Modal style
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  if (orders.length === 0) {
    // Display a message when there are no orders
    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" align="center">
            No orders.
          </Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <>
    <Grid container spacing={2}>
      {orders.map((order) => (
        <Grid item xs={12} md={6} key={order.id}>
          <Card elevation={3} sx={{ minWidth: 275 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order ID: {order.id}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                Status: {order.orderStatus}
              </Typography>
              <Box mt={2} mb={1}>
                <Typography variant="body1" gutterBottom>
                  Client Name: {order.client.firstName}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Client Phone: {order.client.phone}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Client Address: {order.client.address}
                </Typography>
              </Box>
              <Divider light />
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Ordered Flowers:
              </Typography>
              <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {order.flowers.map((flower, index) => (
                  <Order key={`${order.id}-${index}`} flower={flower} />
                ))}
              </List>
           
                
              <Divider light />
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Total: ${order.totalCost}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Payment Method: {order.couponApplied}
              </Typography>
              
            </CardContent>
            <CardActions>
              {order.orderStatus !== 'delivered' && (
                <Button size="small" color="primary" onClick={() => handleChangeStatus(order.id)}>
                  {order.orderStatus === 'paid' ? 'prepare' : 'deliver'}
                </Button>
              )}
              {/* Add Give Coupon Button here */}
                {order.orderStatus === 'delivered' && (
                  <Button size="small" color="primary" onClick={() => handleOpen(order.id)}>
                  Give Coupon
                </Button>
              )}

            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
    <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
  >
    <Box sx={modalStyle}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Give Coupon
      </Typography>
      <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Coupon Value"
          value={couponValue}
          onChange={(e) => setCouponValue(e.target.value)}
        />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleClose} sx={{ mr: 1 }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitCoupon}>Submit</Button>
        </Box>
      </Box>
    </Box>
  </Modal>
  </>
  );
};

export default OrdersBox;
