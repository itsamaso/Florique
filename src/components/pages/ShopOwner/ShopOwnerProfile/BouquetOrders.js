import React, { useState, useEffect } from 'react';
import { Typography, Grid, Card, CardContent, CardMedia, List, Button } from '@mui/material';
import { ListItem, ListItemText } from '@mui/material';
import { updateBOrderStatus } from '../../../../Services/shopOwnerService'; // Adjust the import path as necessary

const steps = ['Received', 'paid', 'prepared', 'delivered']; // Define the steps (statuses) an order can have

const OrderFlower = ({ flower }) => (
  <ListItem>
    <ListItemText primary={`Type: ${flower.typeId}, Count: ${flower.count}, Price: $${flower.price}`} />
  </ListItem>
);

const BouquetOrders = ({ orders }) => {
  const [localOrders, setLocalOrders] = useState(orders);

  // Function to calculate total price for an order
  const calculateTotalPrice = (flowers) => {
    return flowers.reduce((total, flower) => {
      const flowerTotal = flower.count * parseFloat(flower.price);
      return total + flowerTotal;
    }, 0);
  };

  // Function to handle status update
  const handleChangeStatus = async (order) => {
    const currentStepIndex = steps.indexOf(order.status);
    const nextStep = steps[currentStepIndex + 1]; // Determine the next step based on current status
    if (!nextStep) return; // If there's no next step, do nothing

    try {
      await updateBOrderStatus(order.id, nextStep); // Update the order status in the backend
      // Update local state to reflect status change
      const updatedOrders = localOrders.map(o => {
        if (o.id === order.id) {
          return { ...o, status: nextStep };
        }
        return o;
      });
      setLocalOrders(updatedOrders);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status: ' + error.message);
    }
  };

  useEffect(() => {
    setLocalOrders(orders);
  }, [orders]);

  if (!localOrders.length) {
    return <Typography variant="subtitle1" align="center">No orders found.</Typography>;
  }

  // Filter orders by status
  const filteredOrdersByStatus = (status) => {
    return localOrders.filter(order => order.status === status);
  };

  return (
    <>
      {['paid', 'prepared', 'delivered'].map((status) => (
        <Grid container spacing={2} key={status}>
         
          {filteredOrdersByStatus(status).length > 0 ? (
            filteredOrdersByStatus(status).map((order) => (
              <Grid item xs={12} md={6} key={order.id}>
                            <Typography variant="h4" gutterBottom>{status.charAt(0).toUpperCase() + status.slice(1)} Orders</Typography>

          <Card elevation={3}>
            <CardContent>
              {/* Order details */}
              <Typography variant="h6" gutterBottom>Order ID: {order.id}</Typography>
              <Typography variant="body2" gutterBottom>Created At: {new Date(order.createdAt.seconds * 1000).toLocaleString()}</Typography>
              <Typography variant="body2" gutterBottom>Customer ID: {order.customerId}</Typography>
              <Typography variant="body2" gutterBottom>Status: {order.status}</Typography>
              <Typography variant="body2" gutterBottom>Wrapper: {order.wrapper}</Typography>
              {order.imageUrl && <CardMedia component="img" image={order.imageUrl} alt="Order Image" sx={{ maxWidth: 150, height: '200px', marginTop: 1 }} />}
              <Typography variant="subtitle1" gutterBottom>Flowers Ordered:</Typography>
              <List dense>{order.flowers.map((flower, index) => <OrderFlower key={`${order.id}-${index}`} flower={flower} />)}</List>
              <Typography variant="h6" gutterBottom>Total Price: ${calculateTotalPrice(order.flowers).toFixed(2)}</Typography>
            </CardContent>
            {steps.indexOf(order.status) < steps.length - 1 && (
              <Button onClick={() => handleChangeStatus(order)} variant="contained" style={{ margin: '4px' }}>
                Move to {steps[steps.indexOf(order.status) + 1]}
              </Button>
            )}
          </Card>
        </Grid>
   ))
   ) : (
     <Grid item xs={12}>
     </Grid>
   )}
 </Grid>
))}
</>
);
};

export default BouquetOrders;
