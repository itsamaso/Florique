import React, { useState } from "react";
import { Grid, Paper, TextField, Typography, Avatar, Box, Button } from "@mui/material";

const ProfileForm = ({ shopOwner, handleChange,onSubmit, }) => {
  // State to track if the form has been edited
  const [isEdited, setIsEdited] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission action
    setIsEdited(false); // Reset isEdited to false after submitting
    onSubmit(); // Call the parent component's onSubmit function
  };
  
  // Enhanced handleChange that also sets isEdited to true
  const handleInputChange = (event) => {
    setIsEdited(true); // Set isEdited to true when any input changes
    handleChange(event); // Call the original handleChange
  };
  
  return (
    <Paper elevation={3} sx={{ p: 2, overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
        {/* Displaying Store Photo */}
        {shopOwner.storePhoto && (
          <Avatar
            src={shopOwner.storePhoto}
            alt={`${shopOwner.storeName} Store Photo`}
            sx={{ width: 100, height: 100, mb: 1 }}
          />
        )}
        <Typography variant="h6" component="h2">{shopOwner.storeName}</Typography>
      </Box>
    <Grid container spacing={2}>
      {/* Store Name (Read-Only) */}
      
      {/* Email !!!!!! CANT BE CHANGED SINCE ITS THE IDENTEFIER OF THE SHOPOWNER */}
      <Grid item xs={12}>
        <TextField
          label="Email"
          type="email"
          name="email"
          fullWidth
          value={shopOwner.email}
          onChange={handleInputChange}
                    variant="outlined"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Store Name"
          name="storeName"
          fullWidth
          value={shopOwner.storeName}
          InputProps={{ readOnly: true }}
          variant="outlined"
        />
      </Grid>

      {/* Full Name (Read-Only) */}
      <Grid item xs={12}>
        <TextField
          label="Full Name"
          name="fullName"
          fullWidth
          value={shopOwner.fullName}
          InputProps={{ readOnly: true }}
          variant="outlined"
        />
      </Grid>

      <Grid item xs={12}>
        <Typography variant="subtitle1" gutterBottom>Editable Information</Typography>
      </Grid>

      {/* Editable Fields Below */}
      {/* Store Address */}
      <Grid item xs={12}>
        <TextField
          label="Store Address"
          name="storeAddress"
          fullWidth
          value={shopOwner.storeAddress}
          onChange={handleInputChange}
                    variant="outlined"
        />
      </Grid>


      {/* Private Phone Number */}
      <Grid item xs={12}>
        <TextField
          label="Private Phone Number"
          type="tel"
          name="personalPhone"
          fullWidth
          value={shopOwner.personalPhone}
          onChange={handleInputChange}
                    variant="outlined"
        />
      </Grid>

      {/* Store Phone Number */}
      <Grid item xs={12}>
        <TextField
          label="Store Phone Number"
          type="tel"
          name="storePhone"
          fullWidth
          value={shopOwner.storePhone}
          onChange={handleInputChange}
                    variant="outlined"
        />
      </Grid>
    </Grid>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={!isEdited}
          onClick={handleSubmit}
        >
          Save Changes
        </Button>
      </Box>
    </Paper>
  );
};
export default ProfileForm;
