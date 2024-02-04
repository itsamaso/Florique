import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { TextField, Button, Box, Typography, FormControl } from '@mui/material';
import { createShopOwner } from '../../../Services/shopOwnerService';
import { useNavigate } from 'react-router-dom';
const SignUpShopOwner = () => {
  const auth = getAuth();
const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    storeName: '',
    email: '',
    password: '',
    personalPhone: '',
    storePhone: '',
    storeAddress: '',
    socialMedia: '' // Optional
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [storePhoto, setStorePhoto] = useState(null); // Store the file

  const handleChange = (e) => {
    if (e.target.name === 'storePhoto') {
      const file = e.target.files[0];
      if (file) {
        setStorePhoto(file); // Store the file
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      console.log("Shop Owner created: ", userCredential.user.uid);

      // Now use createShopOwner function to add shop owner data to Firestore
      await createShopOwner({
        ...formData,
  
      }, storePhoto, userCredential.user.uid );

      alert('Shop Owner registration successful!');
      // Redirect to the profile page
      navigate('/shopowner');
    } catch (error) {
      console.error("Error signing up: ", error);
      alert('Failed to register: ' + error.message);
    }
  };
 return (
    <Box sx={{ maxWidth: 400, m: 'auto', p: 2, boxShadow: 3 }}>
      <Typography variant="h5" textAlign="center" mb={2}>
        Florique Shop Owner Registration
      </Typography>
      <FormControl component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label="Full Name" variant="outlined" name="fullName" onChange={handleChange} required />
        <TextField label="Store Name" variant="outlined" name="storeName" onChange={handleChange} required />
        <TextField label="Email" variant="outlined" type="email" name="email" onChange={handleChange} required />
        <TextField label="Password" variant="outlined" type="password" name="password" onChange={handleChange} required />
        <TextField label="Personal Phone Number" variant="outlined" name="personalPhone" onChange={handleChange} required />
        <TextField label="Store Phone Number" variant="outlined" name="storePhone" onChange={handleChange} required />
        <TextField label="Store Address" variant="outlined" name="storeAddress" onChange={handleChange} required />
        <TextField label="Social Media (optional)" variant="outlined" name="socialMedia" onChange={handleChange} />
       <Button variant="contained" component="label">
          Upload Store Photo
          <input type="file" name="storePhoto" hidden onChange={handleChange} accept="image/*" />
        </Button>
        {imagePreview && <img src={imagePreview} alt="Store Preview" style={{ maxWidth: '300px', maxHeight: '300px', marginTop: '10px' }} />}
        <Button type="submit" variant="contained" color="primary">
          Sign Up
        </Button>
      </FormControl>
    </Box>
  );
};

export default SignUpShopOwner;





