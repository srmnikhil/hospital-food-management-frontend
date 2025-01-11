import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link, useLocation } from 'react-router-dom';

export default function ButtonAppBar() {
  const location = useLocation();

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component={Link} sx={{ fontWeight: "bold", textDecoration: 'none', color: 'inherit', textAlign: "left", flexGrow: 1 }}>
            Hospital Food Management System
          </Typography>
            <Button
              color="inherit"
              sx={{ marginLeft: 'auto' }}
              component={Link}
              to={location.pathname === '/about' ? '/' : '/about'}
            >
              {location.pathname === '/about' ? 'Login' : 'About Us'}
            </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
