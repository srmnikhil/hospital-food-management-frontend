import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const About = () => {
    return (
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "absolute",
            top: { md: "6rem", xs: "4.5rem" },
            left: "50%",
            transform: "translateX(-50%)",
            width: { md: "80vw", xs: "95vw" },
            height: { md: "80vh" },
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            borderRadius: "10px",
        }}>
            <Container maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Hospital Food Management System
                </Typography>
                <Typography variant="body1" align="center" gutterBottom>
                    Our Hospital Food Management System is designed to enhance the food service operations in hospitals, ensuring that patients receive timely, nutritious meals. We aim to improve the overall hospital experience by streamlining food orders and managing resources efficiently.
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Key Features
                </Typography>
                <Typography variant="body1" paragraph>
                    The system offers features such as customized meal plans for patients based on dietary needs, real-time meal tracking, automated inventory management with low-stock alerts, and detailed analytics for optimizing food preparation.
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Benefits
                </Typography>
                <Typography variant="body1" paragraph>
                    The system significantly enhances patient satisfaction by providing tailored meal options, reduces food wastage by optimizing inventory, and increases operational efficiency, saving time for hospital management.
                </Typography>
                <Typography variant="h5" gutterBottom>
                    Our Mission
                </Typography>
                <Typography variant="body1">
                    Our mission is to improve hospital food services by providing high-quality, personalized meal solutions that meet the diverse needs of patients, staff, and visitors. We strive to ensure the best possible service while maintaining efficiency and cost-effectiveness.
                </Typography>
            </Container>
        </Box>
    );
};

export default About;
