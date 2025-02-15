import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  InputAdornment,
  IconButton,
} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";

function Login() {
  let navigate = useNavigate();
  const location = useLocation(); // Using useLocation to get the current location

  // Use URLSearchParams to get query parameters
  const urlParams = new URLSearchParams(location.search);
  const guestMode = urlParams.has("guestMode"); // Check if guestMode is in the URL

  // Update the heading based on guestMode
  const headingText = guestMode ? "Welcome" : "Login";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (evt) => {
    evt?.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: password })
      });
      const json = await response.json();
      if (json.success) {
        setTimeout(() => {
          localStorage.setItem("token", json.authToken);
          localStorage.setItem("role", json.role);
          navigate("/dashboard", { replace: true });
          setLoading(false);
        }, 1000);
        toast.success("Logged in Successfully, Navigating to dashboard....");
      } else {
        setLoading(false);
        toast.error('Invalid Credentials, Try logging with correct credentials');
      }
    } catch (error) {
      setLoading(false);
      toast.error("Internal server error.");
    };
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "1.5rem",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
          position: "absolute",
          right: { md: "5rem", sm: "2rem", xs: "1rem" },
          top: "50%",
          transform: "translateY(-50%)",
          width: { md: "25vw", sm: "50vw", xs: "80vw" },
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          {headingText}
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 2, width: "100%" }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
        </Box>
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: "0", 
              left: "0",
              right: "0",
              bottom: "0",
              backgroundColor: "rgba(255, 255, 255, 0.5)", 
              zIndex: 1, 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <CircularProgress />
            <Typography sx={{marginLeft: "5px"}}>Loading...</Typography>
          </Box>
        )}
      </Box>
      <ToastContainer position="bottom-right"/>
    </Container>
  );
}

export default Login;