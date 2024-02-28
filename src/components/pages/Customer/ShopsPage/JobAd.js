import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
const JobAdModal = ({ open, setOpen, shop, onSubmitApplication }) => {
    const [applicant, setApplicant] = useState({
      name: '',
      phone: '',
    });
  
    const handleClose = () => setOpen(false);
  
    const handleApplicantChange = (e) => {
      const { name, value } = e.target;
      setApplicant({ ...applicant, [name]: value });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmitApplication(applicant); // Pass the applicant data to the parent's submit handler
      setOpen(false); // Close the modal
      setApplicant({ name: '', phone: '' }); // Reset the form
    };
  
    return (
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="job-ad-modal-title"
        aria-describedby="job-ad-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Join our team
          </Typography>
          <Typography id="job-ad-modal-title" variant="h6" component="h2">
            Role: {shop?.jobAd?.title}
          </Typography>
          <Typography id="job-ad-modal-description" sx={{ mt: 2 }}>
            Details: {shop?.jobAd?.description}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Your Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={applicant.name}
              onChange={handleApplicantChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="phone"
              label="Your Phone Number"
              type="phone"
              id="phone"
              autoComplete="tel"
              value={applicant.phone}
              onChange={handleApplicantChange}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Apply
            </Button>
            <Button fullWidth variant="outlined" onClick={handleClose}>Cancel</Button>
          </Box>
        </Box>
      </Modal>
    );
  };
  
  export default JobAdModal;
  