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
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from "react-toastify";

function Login() {
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check for guestMode parameter in the URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const guestMode = urlParams.has('guestMode'); // Checks if guestMode exists in URL

    if (guestMode) {
      // Prefill email and password with values from env
      setEmail("email@gnail.com"); // Email from .env
      setPassword(process.env.REACT_APP_GUEST_PASSWORD); // Password from .env
      handleLogin(); // Trigger login automatically
    }
  }, []);

  const handleLogin = async (evt) => {
    if (evt) evt.preventDefault(); // Prevent form submission if guest login is triggered automatically
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
          right: { md: "5rem", sm: "2rem", xs: "1rem" }, // Adjust right margin on smaller screens
          top: "50%",
          transform: "translateY(-50%)",
          width: { md: "25vw", sm: "50vw", xs: "80vw" }, // Adjust width for smaller screens
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Login
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
              backgroundColor: "rgba(255, 255, 255, 0.5)", // Semi-transparent overlay
              zIndex: 1, // Ensure the overlay is on top of the form
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