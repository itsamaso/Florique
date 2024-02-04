import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import { signInClient } from '../../../Services/clientService';

const Login = () => {
  const [error, setError] = useState('');
  const auth = getAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await signInClient(formData.email, formData.password);
      console.log("User logged in: ", userCredential.user);
      navigate('/shops');
    } catch (error) {
      console.error("Error logging in: ", error);
      setError('Failed to login: ' + error.message);
    }
  };

  return (
    <Container maxWidth={false} style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundImage: `url('/peakpx.jpg')`, backgroundSize: 'cover' }}>
      <Paper elevation={6} sx={{ maxWidth: 400, mx: 2, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Flower Shop Client Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
          <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus onChange={handleChange} />
          <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" onChange={handleChange} />
          {error && <Typography color="error" align="center">{error}</Typography>}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Login</Button>
          <Typography variant="body2" align="center">
            Don't have an account?{' '}
            <Button color="primary" onClick={() => navigate('/signup/client')}>Sign Up</Button>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
