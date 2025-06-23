import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

// Material UI imports
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Link,
  Alert,
  CircularProgress
} from "@mui/material";

// Material UI icons
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";

const API_URL = import.meta.env.VITE_API_URL;

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [emailError, setEmailError] = useState("");
  const [passError, setPassError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    // Form validation
    let hasError = false;
    if (!email.trim()) {
      setEmailError("Please enter your email address");
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    }

    if (!password.trim()) {
      setPassError("Please enter your password");
      hasError = true;
    }

    if (hasError) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/signin`, {
        email,
        password,
      });
      const { user } = response.data;
      navigate(`/profile/${user.id}`);
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed. Please check your credentials and try again.");
      setUserDetails(null);
      console.error("Error during sign-in:", error);
      setIsLoading(false);
    }
  };

  // Main container styles
  const containerStyles = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f7fa 0%, #e4ecfb 100%)",
  };

  // Form container styles
  const formContainerStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    padding: "2rem 0",
  };

  // Paper styles for the form card
  const paperStyles = {
    width: "100%",
    maxWidth: "450px",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "translateY(-5px)",
    },
  };

  // Header section styles
  const headerStyles = {
    background: "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
    padding: "2rem",
    textAlign: "center",
    color: "white",
  };

  // Form section styles
  const formSectionStyles = {
    padding: "2rem",
    backgroundColor: "#ffffff",
  };

  // Button styles
  const buttonStyles = {
    marginTop: "1.5rem",
    marginBottom: "1rem",
    padding: "0.75rem",
    background: "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
    borderRadius: "8px",
    fontWeight: "600",
    boxShadow: "0 4px 12px rgba(66, 165, 245, 0.3)",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 6px 16px rgba(66, 165, 245, 0.4)",
      transform: "translateY(-2px)",
    },
  };

  // Link styles
  const linkStyles = {
    color: "#1976d2",
    textDecoration: "none",
    fontWeight: "500",
    "&:hover": {
      textDecoration: "underline",
    },
  };

  return (
    <>
      <Navbar />
    <Box sx={containerStyles}>
    
      
      <Container component="main" sx={formContainerStyles}>
        <Paper elevation={3} sx={paperStyles}>
          {/* Header Section */}
          <Box sx={headerStyles}>
            <Typography variant="h4" component="h1" fontWeight="700">
              Welcome Back
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
              Please sign in to access your account
            </Typography>
          </Box>

          {/* Form Section */}
          <Box sx={formSectionStyles}>
            {message && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {message}
              </Alert>
            )}

            <form onSubmit={handleSignIn}>
              {/* Email Field */}
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailError("")}
                error={!!emailError}
                helperText={emailError}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Password Field */}
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPassError("")}
                error={!!passError}
                helperText={passError}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Sign In Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={buttonStyles}
                startIcon={isLoading ? null : <LoginIcon />}
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Divider */}
              <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
                <Divider sx={{ flexGrow: 1 }} />
                <Typography variant="body2" color="text.secondary" sx={{ mx: 2 }}>
                  OR
                </Typography>
                <Divider sx={{ flexGrow: 1 }} />
              </Box>

              {/* Sign Up Link */}
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Do not have an account?{" "}
                  <Link href="/signup" variant="body2" sx={linkStyles}>
                    Sign Up
                  </Link>
                </Typography>
              </Box>
            </form>

            {/* User Details Section (if needed) */}
            {userDetails && (
              <Box 
                sx={{ 
                  mt: 4, 
                  p: 2, 
                  bgcolor: "#e8f5e9", 
                  borderRadius: "8px",
                  border: "1px solid #c8e6c9"
                }}
              >
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  User Details
                </Typography>
                <Typography variant="body1">Name: {userDetails.name}</Typography>
                <Typography variant="body1">Email: {userDetails.email}</Typography>
                <Typography variant="body1">Role: {userDetails.role}</Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
    </>
  );
};

export default Signin;