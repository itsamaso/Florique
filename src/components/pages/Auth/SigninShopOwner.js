import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import {signInShopOwner} from '../../../Services/shopOwnerService';
const LoginShopOwner = () => {
  const [error, setError] = useState(''); // State for storing error message
  const auth = getAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message on new submission
    try {
      const userCredential = await signInShopOwner(formData.email, formData.password);
      console.log("User logged in: ", userCredential.user);
      // Redirect to the profile page
      navigate('/shopowner');
    } catch (error) {

      console.error("Error logging in: ", error);
setError('Failed to login: ' + error.message);}
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Flower Shop Login
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          id="password"
          autoComplete="current-password"
          onChange={handleChange}
        />
           <Box sx={{ mt: 2, textAlign: 'center' }}>
  <Typography variant="body2">
    Don't have an account?{' '}
    <Button color="primary" onClick={() => navigate('/signup/shopowner')}>
      Sign Up
    </Button>
  </Typography>
</Box>
           {error && (
    <Typography color="error" align="center">
      {error}
    </Typography>
  )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default LoginShopOwner;
