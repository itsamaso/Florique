import React from 'react';
import { Paper, Typography, Stepper, Step, StepLabel, Box } from '@mui/material';

const steps = ['Received', 'Paid', 'Prepared', 'Delivered'];

const CurrentOrderStatus = ({ activeStep }) => {
  return (
    <Box sx={{ p: 4, mb: 4 }}>
      <Typography variant="h6" gutterBottom>Order Status</Typography>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step
            key={label}
            completed={index < activeStep || (index === steps.length - 1 && index === activeStep)}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
};

export default CurrentOrderStatus;
