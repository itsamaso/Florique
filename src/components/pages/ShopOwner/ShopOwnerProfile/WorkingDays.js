import React, { useState } from 'react';
import { FormGroup, FormControlLabel, Switch, Typography, Button, Paper, Box } from '@mui/material';

const WorkingDays = ({ initialDays, onSave }) => {
  const [days, setDays] = useState(initialDays);

  const toggleDay = (day) => {
    setDays({
      ...days,
      [day]: !days[day]
    });
  };

  // Define the order of the days
  const daysOrder = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  // Sort the days according to the daysOrder array
  const sortedDays = Object.keys(days).sort((a, b) => daysOrder.indexOf(a) - daysOrder.indexOf(b));

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Set Working Days</Typography>
      <FormGroup>
        {sortedDays.map((day) => (
          <FormControlLabel
            control={<Switch checked={days[day]} onChange={() => toggleDay(day)} />}
            label={day.charAt(0).toUpperCase() + day.slice(1)}
            key={day}
          />
        ))}
      </FormGroup>
      <Box display="flex" justifyContent="flex-end" mt={2}>
        <Button variant="contained" color="primary" onClick={() => onSave(days)}>
          Save Working Days
        </Button>
      </Box>
    </Paper>
  );
};

export default WorkingDays;
