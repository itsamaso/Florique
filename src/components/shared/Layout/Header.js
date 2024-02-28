import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Menu, Badge } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { getClientName } from '../../../Services/clientService';
import { useCart ,clearCart} from '../../pages/Customer/CustomerCheckout/Cart';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook for navigation
import CartFlowerCard from '../../pages/Customer/CustomerCheckout/CartFlowerCard';
import { useParams } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import { Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, Button } from '@mui/material';

const Header = () => {
  const [userName, setUserName] = useState('');
  const [cartAnchorEl, setCartAnchorEl] = useState(null);
  const { cart, clearCart } = useCart(); // Assuming removeFromCart function exists
  const [profileAnchorEl, setProfileAnchorEl] = useState(null); // State for profile icon menu


  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const name = await getClientName();
        setUserName(name);
      } catch (error) {
        console.error('Error fetching client name:', error);
      }
    };
    fetchUserName();
  }, []);
  const handleClearCart = () => {
    clearCart();

  }
  const handleNavigateToShops = () => {
    navigate('/shops'); // Assuming you have a route for the shops
    handleProfileMenuClose();
  };
  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };
  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };
  const handleNavigateToProfile = () => {
    navigate('/profile'); // Assuming you have a route for the profile
    handleProfileMenuClose();
  };
  const handleCartClick = (event) => {
    setCartAnchorEl(event.currentTarget);
  };
  const handleCartClose = () => {
    setCartAnchorEl(null);
  };

  const handleCheckout = () => {
    navigate(`/checkout/${id}`); // Navigate to checkout page
    handleCartClose();
  };
  return (
    <AppBar position="fixed" color="primary">
          <Toolbar>
      {/* Group Title and Avatar to the left */}
      <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        Florique
        <Avatar
  alt="Main Photo"
  src="/flo.png" // Now this will be resolved as http://yourdomain.com/flo.png
  sx={{ height: 40, width: 40, marginLeft: 1 }}
/>

      </Typography>

      {/* Conditional rendering based on userName existence */}
      {userName && (
        <Typography variant="subtitle1" noWrap sx={{ flexGrow: 1, justifyContent: 'flex-end', display: 'flex' }}>
          Welcome, {userName.split(' ')[0]}
        </Typography>
      )}

      {/* Items aligned to the right */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          color="inherit"
          aria-label="customer profile"
          onClick={handleProfileMenuOpen}
          sx={{ marginRight: 2 }}
        >
          <AccountCircleIcon />
        </IconButton>
        <Menu
          anchorEl={profileAnchorEl}
          keepMounted
          open={Boolean(profileAnchorEl)}
          onClose={handleProfileMenuClose}
        >
          <MenuItem onClick={handleNavigateToProfile}>Profile</MenuItem>
          <MenuItem onClick={handleNavigateToShops}>Shops</MenuItem> {/* Example placeholder */}
        </Menu>
        <IconButton
          color="inherit"
          aria-label="open cart"
          edge="end"
          onClick={handleCartClick}
        >
          <Badge badgeContent={cart.length} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Box>
      
      <Menu
        anchorEl={cartAnchorEl}
        keepMounted
        open={Boolean(cartAnchorEl)}
        onClose={handleCartClose}
      >
        {cart.length > 0 ? (
          <Box sx={{ minWidth: 300 }}>
            <List dense>
              {cart.map((item) => (
                <ListItem key={item.id} secondaryAction={
                  <Typography variant="body2">Qty: {item.quantity}</Typography>
                }>
                  <ListItemAvatar>
                    <Avatar src={item.image} alt={item.name} />
                  </ListItemAvatar>
                  <ListItemText primary={item.name} />
                </ListItem>
              ))}
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 2 }}>
                <Button color="primary" onClick={handleCheckout}>
                  Checkout
                </Button>
                <Button color="error" onClick={handleClearCart}>
                  Clear Cart
                </Button>
              </Box>
            </List>
          </Box>
        ) : (
          <Typography sx={{ padding: 2 }}>Empty.</Typography>
        )}
      </Menu>
    </Toolbar>
    </AppBar>
  );
};

export default Header;