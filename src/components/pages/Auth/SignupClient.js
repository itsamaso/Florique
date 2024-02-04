import React, { useState } from 'react';
import { doc, setDoc } from "firebase/firestore"; 
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import { db } from '../../../Services/firebase';

const SignUp = () => {
  const auth = getAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      console.log("User created: ", userCredential.user.uid);
      await setDoc(doc(db, "Clients", userCredential.user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      });
      alert('Registration successful!');
    } catch (error) {
      console.error("Error signing up: ", error);
      alert('Failed to register: ' + error.message);
    }
  };

  return (
    <Container maxWidth="xs" style={{ marginTop: '20px' }}>
      <Paper elevation={6} style={{ padding: '20px' }}>
        <Typography variant="h5" component="h1" gutterBottom align="center">
          Flower Shop Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth id="firstName" label="First Name" name="firstName" autoFocus onChange={handleChange} />
          <TextField margin="normal" required fullWidth id="lastName" label="Last Name" name="lastName" onChange={handleChange} />
          <TextField margin="normal" required fullWidth id="email" label="Email" name="email" type="email" onChange={handleChange} />
          <TextField margin="normal" required fullWidth id="password" label="Password" name="password" type="password" onChange={handleChange} />
          <TextField margin="normal" fullWidth id="phone" label="Phone" name="phone" onChange={handleChange} />
          <TextField margin="normal" fullWidth id="address" label="Address" name="address" onChange={handleChange} />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign Up
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignUp;
