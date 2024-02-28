import { Modal, Box, Button, TextField,CardMedia, Typography, Card, CardContent, Rating, Grid, List, Divider, Paper } from '@mui/material';
import React, { useState } from 'react';
import Order from '../../ShopOwner/ShopOwnerProfile/Order'; // Ensure the path is correct
import { RateShopOwner } from "../../../../Services/clientService";
import CurrentOrderStatus from './CurrentOrderStatus'; // Ensure the path is correct
const steps = ['Received', 'paid', 'prepared', 'delivered'];

const OrdersHistory = ({ orders,borders }) => {
  const [open, setOpen] = useState(false); // State to control modal visibility
  const [currentOrder, setCurrentOrder] = useState(null); // State to hold the selected order ID
  
  const [rating, setRating] = useState({
    rating: 0,
    comment: ''
  });

  const handleOpen = (order) => {
    setOpen(true);
    setCurrentOrder(order);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRatingChange = (event, newValue) => {
    setRating({ ...rating, rating: newValue });
  };

  const handleCommentChange = (event) => {
    setRating({ ...rating, comment: event.target.value });
  };

  const handleRating = async (order) => {
    console.log(order);

    try {
      await RateShopOwner(order, rating);
      console.log(rating);
      handleClose();
    }
    catch (error) {
      console.error("Error rating shop:", error);
    }
  };

  if (orders.length === 0) {
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
console.log(orders);
  return (
    <>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Order History
        </Typography>
        <Grid container spacing={2}>
        {[...orders].reverse().map((order) => (
  <Grid item xs={12} md={6} key={order.id}>
    <Card elevation={3} sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Order ID: {order.id}
        </Typography>
        {/* Convert and display the createdAt date */}
        <Typography variant="subtitle2" gutterBottom>
          Date: {new Date(order.createdAt.seconds * 1000).toLocaleDateString("en-US")}
        </Typography>

        <CurrentOrderStatus activeStep={steps.indexOf(order.orderStatus)} steps={steps} text="Status" />

        <Box mt={2} mb={1}>
          <Typography variant="body1" gutterBottom>
            Shop Phone: {order.shopPhone}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Shop Name: {order.shopOwnerName}
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

        <Button variant="contained" color="primary" onClick={() => handleOpen(order)}>Rate</Button>
      </CardContent>
    </Card>
  </Grid>
))}

{[...orders, ...borders].reverse().map((order) => (
            <Grid item xs={12} md={6} key={order.id}>
              <Card elevation={3} sx={{ minWidth: 275 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order ID: {order.id}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    Date: {new Date(order.createdAt.seconds * 1000).toLocaleDateString("en-US")}
                  </Typography>

                  <CurrentOrderStatus activeStep={steps.indexOf(order.status)} steps={steps} text="Status" />

                  {order.imageUrl && (
                    <CardMedia component="img" image={order.imageUrl} alt="Order Image" sx={{ maxWidth: 150, height: 'auto', marginTop: 1 }} />
                  )}

                  <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                    Ordered Flowers:
                  </Typography>
                  <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {order.flowers.map((flower, index) => (
                      <Box key={`${order.id}-${index}`} sx={{ mb: 2 }}>
                        <Typography variant="body1">
                          Flower: {flower.typeId}
                        </Typography>
                        <Typography variant="body1">
                          Price: ${flower.price}
                        </Typography>
                        <Typography variant="body1">
                          Quantity: {flower.count}
                        </Typography>
                        {index < order.flowers.length - 1 && <Divider />}
                      </Box>
                    ))}
                  </List>

                  <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                    Total: ${order.flowers.reduce((acc, flower) => acc + (parseFloat(flower.price) * flower.count), 0).toFixed(2)}
                  </Typography>

                  <Button variant="contained" color="primary" onClick={() => handleOpen(order)}>Rate</Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Rate Shop
          </Typography>
          <Box component="form" noValidate autoComplete="off" sx={{ mt: 2 }}>
            <Rating
              name="simple-controlled"
              value={rating.rating}
              onChange={handleRatingChange}
            />
            <TextField
              label="Comment"
              fullWidth
              value={rating.comment}
              onChange={handleCommentChange}
            />

            <Divider sx={{ my: 2 }} />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button onClick={handleClose} sx={{ mr: 1 }}>Cancel</Button>
              <Button variant="contained" onClick={() => handleRating(currentOrder)}>Submit</Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default OrdersHistory;
