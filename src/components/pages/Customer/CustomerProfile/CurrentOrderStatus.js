import React from 'react';
import { Paper, Typography, Stepper, Step, StepLabel } from '@mui/material';

const CurrentOrderStatus = ({ activeStep, steps }) => {
  return (
    <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
      <Typography variant="h6" gutterBottom>Current Order Status</Typography>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Paper>
  );
};

export default CurrentOrderStatus;
