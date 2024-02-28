import React, { useState } from "react";
import { Grid, Paper, TextField, Typography, Avatar, Box, Button } from "@mui/material";
import {updateShopOwnerImage} from "../../../../Services/shopOwnerService";
const ProfileForm = ({ shopOwner, handleChange, onSubmit }) => {
  const [isEdited, setIsEdited] = useState(false);
  const [imagePreview, setImagePreview] = useState(shopOwner.storePhoto || '');

  const handleImageSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Immediately upload the image to Firebase and update the shop owner's profile
      try {
        await updateShopOwnerImage(file); // Assuming shopOwner.uid is available
        alert("Image updated successfully!");
        setIsEdited(false); // Reset edit state since only the image was updated
      } catch (error) {
        console.error("Error updating image: ", error);
        alert("Failed to update image.");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(); // Call onSubmit with no image since image is handled separately
    setIsEdited(false);
  };

  // handleInputChange remains unchanged
  const handleInputChange = (event) => {
    setIsEdited(true);
    handleChange(event);
  };

  return (
    <Paper elevation={3} sx={{ p: 2, overflow: 'hidden' }}>
     <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
        <input
          accept="image/*"
          type="file"
          hidden
          id="image-upload"
          onChange={handleImageSelect}
          name="storePhoto"
        />
        <label htmlFor="image-upload">
          <Avatar
            src={imagePreview}
            alt={`${shopOwner.storeName} Store Photo`}
            sx={{ width: 100, height: 100, mb: 1, cursor: 'pointer' }}
          />
          <Typography variant="caption" display="block" gutterBottom>
            Click to change photo
          </Typography>
        </label>
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
