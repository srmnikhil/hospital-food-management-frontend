import React from 'react';
import Login from '../Components/Login';
import backgroundMobile from '../assets/backgroundMobile2.jpg';
import background from '../assets/background.jpg';
import { Box } from '@mui/material';
import About from './About';
import AppBar from '../Components/Appbar';

const Home = ({ isAboutPage }) => {
  return (
    <Box
    sx={{
      backgroundImage: {
        md: `url(${background})`,
        xs: `url(${backgroundMobile})`,
      },
      backgroundSize: "cover", // Ensures the image covers the entire area
      backgroundRepeat: "no-repeat", // Prevents the image from repeating
      backgroundPosition: "center", // Centers the image
      height: "100vh", // Makes it cover the full viewport height
      width: "100vw", // Makes it cover the full viewport width
    }}
    >
    <AppBar />
      {isAboutPage ? <About /> : <Login />}
    </Box>
  );
};

export default Home;
