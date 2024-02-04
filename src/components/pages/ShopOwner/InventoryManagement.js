import React, { useState, useEffect } from 'react';
import { Button, CircularProgress, Grid, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Paper, Box } from '@mui/material';
import FlowerCard from '../../shared/FlowerCard';
import { getAuth } from "firebase/auth";
import { fetchInventoryForShopOwner, addFlower, editFlower, deleteFlower } from '../../../Services/shopOwnerService';

const InventoryManagement = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentFlower, setCurrentFlower] = useState({ id: null, name: '', description: '', image: '', stock: '', price: '', availability: true,category:'' });
  const [currentFile, setCurrentFile] = useState(null);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const inventoryData = await fetchInventoryForShopOwner();
      setInventory(inventoryData);
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setIsEditMode(false);
    setCurrentFlower({ id: null, name: '', description: '', image: '', stock: '', price: '', availability: true,category:'' });
  };

  const handleEditOpen = (flower) => {
    setOpen(true);
    setIsEditMode(true);
    setCurrentFlower(flower);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'image') {
      const file = event.target.files[0];
      setCurrentFile(file);
    } else {
      setCurrentFlower(prevState => ({ ...prevState, [name]: value }));
    }
  };

  const handleAddOrEditFlower = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;
    const shopOwnerId = user.uid;
    const flowerData = { ...currentFlower, image: currentFile ? currentFile.name : currentFlower.image };

    try {
      if (isEditMode) {
        await editFlower(shopOwnerId, currentFlower.id, flowerData, currentFile);
      } else {
        await addFlower(shopOwnerId, flowerData, currentFile);
      }
      handleClose();
      loadInventory();
    } catch (error) {
      console.error("Error adding or editing flower: ", error);
    }
  };

  const handleDeleteFlower = async (flowerId) => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;
    const shopOwnerId = user.uid;

    try {
      await deleteFlower(shopOwnerId, flowerId);
      loadInventory();
    } catch (error) {
      console.error("Error deleting flower: ", error);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Add New Flower
        </Button>
      </Box>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle>{isEditMode ? 'Edit Flower' : 'Add New Flower'}</DialogTitle>
        <DialogContent>
          <TextField margin="dense" id="category" name="category" label="Category" type="text" fullWidth variant="outlined" value={currentFlower.category} onChange={handleChange} />
          <TextField autoFocus margin="dense" id="name" name="name" label="Flower Name" type="text" fullWidth variant="outlined" value={currentFlower.name} onChange={handleChange} />
          <TextField margin="dense" id="description" name="description" label="Description" type="text" fullWidth variant="outlined" value={currentFlower.description} onChange={handleChange} />
          <TextField margin="dense" id="stock" name="stock" label="Stock" type="number" fullWidth variant="outlined" value={currentFlower.stock} onChange={handleChange} />
          <TextField margin="dense" id="price" name="price" label="Price" type="number" fullWidth variant="outlined" value={currentFlower.price} onChange={handleChange} />
          <input accept="image/*" type="file" onChange={handleChange} name="image" style={{ marginTop: 16 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddOrEditFlower} color="primary">
            {isEditMode ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
      <Grid container spacing={2}>
        {inventory.map((flower) => (
          <Grid item key={flower.id} xs={12} sm={6} md={4}>
            <FlowerCard flower={flower} onEdit={() => handleEditOpen(flower)} onDelete={() => handleDeleteFlower(flower.id)} />
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default InventoryManagement;
