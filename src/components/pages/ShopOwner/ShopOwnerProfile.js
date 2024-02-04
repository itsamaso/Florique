import React, { useState, useEffect,useCallback  } from 'react';
import { Container, Typography, Grid, CircularProgress, Button, Card, CardContent, useTheme, useMediaQuery } from '@mui/material';
import { Box, Alert } from '@mui/material';
import ProfileForm from './ProfileForm';
import InventoryManagement from './InventoryManagement';
import OrdersBox from './OrderBox';
import { fetchShopOwnerData, fetchOrdersWithFlowerDetails } from '../../../Services/shopOwnerService';
import SalesGraph from './SalesGraph';
import { updateShopOwnerData } from '../../../Services/shopOwnerService';
const ShopOwnerProfile = () => {
  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
   // Filter orders based on their status
   const [paidOrders, setPaidOrders] = useState([]);
   const [preparedOrders, setPreparedOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]); // Add this line
  const handleSubmit = async (e) => {
    setIsLoading(true);
    try {
      // Call the update function with the current state of shopOwner
      await updateShopOwnerData(shopOwner); // Assuming this function is defined and updates Firestore
      alert('Profile updated successfully!');
    } catch (error) {
      setError(error.message || 'Failed to update profile');
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  const [shopOwner, setShopOwner] = useState({
    firstName: '',
    lastName: '',
    storeName: '',
    email: '',
    phone: '',
    address: '',
    description: '',
  });

  const [orders, setOrders] = useState({ paid: [], prepared: [], delivered: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeComponent, setActiveComponent] = useState('profile');
  const loadShopOwnerData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchShopOwnerData();
      const ordersData = await fetchOrdersWithFlowerDetails();

      // Filtering and setting orders by status in a single operation
      setOrders({
        paid: ordersData.filter(order => order.orderStatus === 'paid'),
        prepared: ordersData.filter(order => order.orderStatus === 'prepared'),
        delivered: ordersData.filter(order => order.orderStatus === 'delivered'),
      });
      console.log(ordersData);

      setShopOwner(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array means this callback is created once per component lifecycle

  useEffect(() => {
    loadShopOwnerData();
  }, [loadShopOwnerData]); // Adding loadShopOwnerData as a dependency

  const handleOrderStatusChange = async () => {
    await loadShopOwnerData(); // This already re-fetches orders, so it should work as expected
  };


  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
      </Container>
    );
  }

  const handleChange = (e) => {
    setShopOwner({ ...shopOwner, [e.target.name]: e.target.value });
  };

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case 'profile':
        return          <ProfileForm shopOwner={shopOwner} handleChange={handleChange} onSubmit={handleSubmit} />

      case 'paidOrders':
        return <OrdersBox  orders={orders.paid} onStatusChange={handleOrderStatusChange} />;
      
      case 'preparedOrders':
        return <OrdersBox  orders={orders.prepared}  onStatusChange={handleOrderStatusChange}/>;
      case 'deliveredOrders':
        return <>
        
        <SalesGraph orders={orders.delivered} />;
        <OrdersBox  orders={orders.delivered}  onStatusChange={handleOrderStatusChange}/>;
        </>;
        case 'inventory':
        return <InventoryManagement />;
      default:
        return <Typography>Selected component does not exist.</Typography>;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4, bgcolor: 'background.default', p: 3 }}>
      <Grid container spacing={isXsScreen ? 2 : 4}>
        <Grid item xs={12} md={8}>
          {renderActiveComponent()}
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Navigate
              </Typography>
              <Button fullWidth variant="outlined" color="primary" sx={{ mb: 1 }} onClick={() => setActiveComponent('profile')}>
                Profile
              </Button>
              <Button fullWidth variant="outlined" color="primary" sx={{ mb: 1 }} onClick={() => setActiveComponent('paidOrders')}>
                Paid Orders
              </Button>
          
              <Button fullWidth variant="outlined" color="primary" sx={{ mb: 1 }} onClick={() => setActiveComponent('preparedOrders')}>
                Prepared Orders
              </Button>
              <Button fullWidth variant="outlined" color="primary" sx={{ mb: 1 }} onClick={() => setActiveComponent('deliveredOrders')}>
                Delivered Orders and Sales
              </Button>
              <Button fullWidth variant="outlined" color="primary" onClick={() => setActiveComponent('inventory')}>
                Inventory Management
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ShopOwnerProfile;
