// JobAdForm.js
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, List, ListItem, Card,CardContent,Container,Paper, CircularProgress } from '@mui/material';
import { postJobAd,fetchApplications } from '../../../../Services/shopOwnerService';
const JobAdForm = ({ currentAd }) => {
  const [jobAd, setJobAd] = useState({
    title: '',
    description: '',
  });

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false); // Add a loading state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobAd(prevAd => ({ ...prevAd, [name]: value }));
  };
  useEffect(() => {
    setLoading(true); // Start loading
    const loadApplications = async () => {
      try {
        const fetchedApplications = await fetchApplications();

        setApplications(fetchedApplications);

        if (currentAd) {
          setJobAd(currentAd);
        };

      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    loadApplications();
  }, []); 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postJobAd(jobAd);
      alert('Job Ad Posted Successfully');
      setJobAd({ title: '', description: '' });
    } catch (error) {
      alert('Failed to post job ad');
      console.error('Error posting job ad:', error);
    }
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Job Ad
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Job title"
            name="title"
            autoComplete="title"
            autoFocus
            value={jobAd.title}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="description"
            label="Job description"
            name="description"
            autoComplete="description"
            value={jobAd.description}
            onChange={handleChange}
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ py: 1.5 }}
          >
            Add / Edit Application
          </Button>
        </Box>
      </Paper>

      <Typography variant="h6" sx={{ mt: 6, mb: 2, textAlign: 'center' }}>
        Applications List
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        applications.length > 0 ? (
          <List sx={{ width: '100%' }}>
            {applications.map((app, index) => (
              <ListItem key={index} sx={{ display: 'block', mb: 2 }}>
                <Card variant="outlined" sx={{ transition: '0.3s', "&:hover": { transform: 'scale(1.02)' } }}>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {app.name}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      Phone: {app.phone}
                    </Typography>
                  </CardContent>
                </Card>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="subtitle1" sx={{ mt: 2, textAlign: 'center' }}>
            No applications found.
          </Typography>
        )
      )}
    </Container>
  );
};


export default JobAdForm;
