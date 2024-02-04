import { Box, Typography, Button, Container } from '@mui/material';
import { Card, CardMedia, CardContent, CardActions,Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const heroImage= 'bg.jpg';
function HeroSection()  {
    const navigate = useNavigate();
    const handleShopNow = () => {
      navigate('/signinclient');
    };
    const handleJoinNow = () => {
      navigate('/signin/shopowner');
    };


    return (
    <Box
      sx={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#fff',
        textAlign: 'center',
        minHeight: '100vh', // Full viewport height
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // Center content vertically
      }}
    >
      <Container>
        <Typography variant="h2" gutterBottom>Welcome to Florique</Typography>
        <Typography variant="h5" sx={{ mb: 3 }}>Discover the Beauty of Fresh Flowers</Typography>
        <Button variant="contained" onClick={handleShopNow} color="primary" size="large" sx={{ mr: 2 }}>Shop Now</Button>
        <Button variant="outlined" onClick={handleJoinNow} color="primary" size="large">Join Our Sellers</Button>
      </Container>
    </Box>
    );
    };
    export default HeroSection;
  