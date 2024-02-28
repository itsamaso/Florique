import React, { useState, useEffect,useCallback  } from 'react';
import { Container, Typography, Grid, CircularProgress, Button, Card, CardContent, useTheme, useMediaQuery } from '@mui/material';
import { Box, Alert } from '@mui/material';
import ProfileForm from './ShopOwnerProfile/ProfileForm';
import InventoryManagement from './ShopOwnerProfile/InventoryManagement';
import OrdersBox from './ShopOwnerProfile/OrderBox';
import { fetchShopOwnerData, fetchOrdersWithFlowerDetails,saveWorkingDays } from '../../../Services/shopOwnerService';
import SalesGraph from './ShopOwnerProfile/SalesGraph';
import { updateShopOwnerData,fetchBouquetOrders } from '../../../Services/shopOwnerService';
import WorkingDays from './ShopOwnerProfile/WorkingDays';
import ManageBouquetBuilder from './ShopOwnerProfile/ManageBouquetBuilder';
import JobAdForm from './ShopOwnerProfile/JobAdForm';
import BouquetOrders from './ShopOwnerProfile/BouquetOrders';
import c from 'dom-to-image-more';
const ShopOwnerProfile = () => {
  const theme = useTheme();
  const [workingDays, setWorkingDays] = useState({}); // Initial state is an empty object
  const handleSaveWorkingDays = (newDays) => {
    setWorkingDays(newDays);
    // Here, you can also update these settings in your backend or local storage
    saveWorkingDays(newDays);
    alert('Working days updated successfully!');
  };
  const [bOrders, setBOrders] = useState([]); // Initial state is an empty array
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
   // Filter orders based on their status

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
      setWorkingDays(data.workingDays);

      // Filtering and setting orders by status in a single operation
      setOrders({
        paid: ordersData.filter(order => order.orderStatus === 'paid'),
        prepared: ordersData.filter(order => order.orderStatus === 'prepared'),
        delivered: ordersData.filter(order => order.orderStatus === 'delivered'),
      });
      console.log(ordersData.paid);
      const bOrders = await fetchBouquetOrders();
      console.log(bOrders); 
      setBOrders(bOrders);
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
       
        case 'jobAd':
          return <JobAdForm  currentAd={shopOwner.jobAd}     onSave={(ad) => console.log(ad)} />;
        
       case 'workingDays':
  return <WorkingDays initialDays={workingDays} onSave={handleSaveWorkingDays} />;
      case'BouquetOrders':
      return <BouquetOrders orders={bOrders} />;

      case 'paidOrders':
        return <OrdersBox  orders={orders.paid} onStatusChange={handleOrderStatusChange} />;
      
      case 'preparedOrders':
        return <OrdersBox  orders={orders.prepared}  onStatusChange={handleOrderStatusChange}/>;
      case 'deliveredOrders':
        return <>
        
        <SalesGraph orders={orders.delivered} borders={bOrders.filter(order => order.status === 'delivered')}  />;
        <OrdersBox  orders={orders.delivered}   onStatusChange={handleOrderStatusChange}/>;
        <BouquetOrders orders={ bOrders.filter(order => order.status === 'delivered')
        } />;
        </>;
        case 'inventory':
        return <InventoryManagement />;
     

      default:
        return <Typography>Selected component does not exist.</Typography>;
    }
  };

  return (
<Container
  maxWidth="lg"
  sx={{
    mt: 4,
    mb: 4,
    p: 3,
    backgroundImage: `url('/1.svg')`,
    backgroundSize: 'cover', // Cover the entire space of the container
  }}
>

      <Grid container spacing={isXsScreen ? 2 : 4}>
        <Grid item xs={12} md={8}>
          {renderActiveComponent()}
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom  align='center'>
              Managment
              </Typography>
              <Button fullWidth variant="outlined" color="primary" sx={{ mb: 1 }} onClick={() => setActiveComponent('profile')}>
                Profile
              </Button>
            
              <Button fullWidth variant="outlined" color="primary" sx={{ mb: 1 }} onClick={() => setActiveComponent('jobAd')}>
  Post a Job Ad
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
              <Button fullWidth variant="outlined" color="primary" sx={{ mb: 1 }}   onClick={() => setActiveComponent('inventory')}>
                Inventory Management
              </Button>
              <Button fullWidth variant="outlined" color="primary"   sx={{ mb: 1 }}  onClick={() => setActiveComponent('workingDays')}>
                Working Days
              </Button>

         
              <Button fullWidth variant="outlined" color="primary"   onClick={() => setActiveComponent('BouquetOrders')}>
                Bouquet Orders
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ShopOwnerProfile;
