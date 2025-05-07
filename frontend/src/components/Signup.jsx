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
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Grid
} from "@mui/material";

// Material UI icons
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import WcIcon from "@mui/icons-material/Wc";
import PaidIcon from "@mui/icons-material/Paid";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const API_URL = import.meta.env.VITE_API_URL;

const Signup = () => {
  // State variables
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [contactNumber, setContactNumber] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [availability, setAvailability] = useState("");
  const [fees, setFees] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  
  // Error states
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [contactError, setContactError] = useState("");
  const [passError, setPassError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [specializationError, setSpecializationError] = useState("");
  const [availabilityError, setAvailabilityError] = useState("");
  const [feesError, setFeesError] = useState("");

  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Clear all errors before new validation
    setNameError("");
    setEmailError("");
    setContactError("");
    setPassError("");
    setAddressError("");
    setSpecializationError("");
    setAvailabilityError("");
    setFeesError("");
    setMessage("");

    // Validation
    let hasError = false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const indianContactRegex = /^[6-9]\d{9}$/;

    if (!name.trim()) {
      setNameError("Please enter your name");
      hasError = true;
    }
    
    if (!email.trim()) {
      setEmailError("Please enter your email address");
      hasError = true;
    } else if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    }
    
    if (!contactNumber.trim()) {
      setContactError("Please enter your contact number");
      hasError = true;
    } else if (!indianContactRegex.test(contactNumber)) {
      setContactError("Please enter a valid 10-digit mobile number");
      hasError = true;
    }
    
    if (!password.trim()) {
      setPassError("Password cannot be empty");
      hasError = true;
    }
    
    if (!address.trim()) {
      setAddressError("Please enter your address");
      hasError = true;
    }

    if (role === "doctor") {
      if (!specialization.trim()) {
        setSpecializationError("Specialization is required");
        hasError = true;
      }
      
      if (!availability.trim()) {
        setAvailabilityError("Availability is required");
        hasError = true;
      }
      
      if (!fees) {
        setFeesError("Fees is required");
        hasError = true;
      }
    }

    if (hasError) {
      setLoading(false);
      return;
    }

    // Prepare data for submission
    const formData = {
      name,
      email,
      password,
      role,
      contactNumber,
      gender: role === "patient" ? gender : undefined,
      dateOfBirth: role === "patient" ? dateOfBirth : undefined,
      address,
      specialization: role === "doctor" ? specialization : undefined,
      availability: role === "doctor" ? availability : undefined,
      fees: role === "doctor" ? fees : undefined,
    };

    try {
       await axios.post(`${API_URL}/register`, formData);
      setMessage("Registration successful! Redirecting to login...");
      
      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setRole("patient");
      setContactNumber("");
      setGender("");
      setDateOfBirth("");
      setAddress("");
      setSpecialization("");
      setAvailability("");
      setFees("");
      
      // Redirect to signin after 2 seconds
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
      
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Styles
  const containerStyles = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f7fa 0%, #e4ecfb 100%)",
  };

  const formContainerStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    padding: "2rem 0",
  };

  const paperStyles = {
    width: "100%",
    maxWidth: "800px",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "translateY(-5px)",
    },
  };

  const headerStyles = {
    background: "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
    padding: "2rem",
    textAlign: "center",
    color: "white",
  };

  const formSectionStyles = {
    padding: "2rem",
    backgroundColor: "#ffffff",
  };

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
                Create Your Account
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
                Please fill in the details to sign up
              </Typography>
            </Box>

            {/* Form Section */}
            <Box sx={formSectionStyles}>
              {message && (
                <Alert 
                  severity={message.includes("successful") ? "success" : "error"} 
                  sx={{ mb: 3 }}
                >
                  {message}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  {/* Role Selection */}
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="role-select-label">I am a</InputLabel>
                      <Select
                        labelId="role-select-label"
                        id="role-select"
                        value={role}
                        label="I am a"
                        onChange={(e) => setRole(e.target.value)}
                      >
                        <MenuItem value="patient">Patient</MenuItem>
                        <MenuItem value="doctor">Doctor</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Name Field */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      required
                      fullWidth
                      id="name"
                      label="Full Name"
                      name="name"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setNameError("")}
                      error={!!nameError}
                      helperText={nameError}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Email Field */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setEmailError("")}
                      error={!!emailError}
                      helperText={emailError}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Contact Number Field */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      required
                      fullWidth
                      id="contactNumber"
                      label="Contact Number"
                      name="contactNumber"
                      autoComplete="tel"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      onFocus={() => setContactError("")}
                      error={!!contactError}
                      helperText={contactError}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Password Field */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      id="password"
                      autoComplete="new-password"
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
                  </Grid>

                  {/* Address Field */}
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="address"
                      label="Address"
                      name="address"
                      autoComplete="address"
                      multiline
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      onFocus={() => setAddressError("")}
                      error={!!addressError}
                      helperText={addressError}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <HomeIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  {/* Patient-specific fields */}
                  {role === "patient" && (
                    <>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel id="gender-select-label">Gender</InputLabel>
                          <Select
                            labelId="gender-select-label"
                            id="gender-select"
                            value={gender}
                            label="Gender"
                            onChange={(e) => setGender(e.target.value)}
                            startAdornment={
                              <InputAdornment position="start">
                                <WcIcon color="primary" />
                              </InputAdornment>
                            }
                          >
                            <MenuItem value="">Select Gender</MenuItem>
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          id="dateOfBirth"
                          label="Date of Birth"
                          type="date"
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarMonthIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </>
                  )}

                  {/* Doctor-specific fields */}
                  {role === "doctor" && (
                    <>
                      <Grid item xs={12} md={4}>
                        <TextField
                          required
                          fullWidth
                          id="specialization"
                          label="Specialization"
                          name="specialization"
                          value={specialization}
                          onChange={(e) => setSpecialization(e.target.value)}
                          onFocus={() => setSpecializationError("")}
                          error={!!specializationError}
                          helperText={specializationError}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <MedicalServicesIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <TextField
                          required
                          fullWidth
                          id="availability"
                          label="Availability"
                          name="availability"
                          placeholder="e.g., Mon-Fri, 9AM-5PM"
                          value={availability}
                          onChange={(e) => setAvailability(e.target.value)}
                          onFocus={() => setAvailabilityError("")}
                          error={!!availabilityError}
                          helperText={availabilityError}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <AccessTimeIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      
                      <Grid item xs={12} md={4}>
                        <TextField
                          required
                          fullWidth
                          id="fees"
                          label="Consultation Fees"
                          name="fees"
                          type="number"
                          value={fees}
                          onChange={(e) => setFees(e.target.value)}
                          onFocus={() => setFeesError("")}
                          error={!!feesError}
                          helperText={feesError}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PaidIcon color="primary" />
                              </InputAdornment>
                            ),
                            endAdornment: (
                              <InputAdornment position="end">
                                ₹
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </>
                  )}

                  {/* Sign Up Button */}
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={buttonStyles}
                      disabled={loading}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Sign Up"
                      )}
                    </Button>
                  </Grid>
                </Grid>

                {/* Divider */}
                <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
                  <Divider sx={{ flexGrow: 1 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ mx: 2 }}>
                    OR
                  </Typography>
                  <Divider sx={{ flexGrow: 1 }} />
                </Box>

                {/* Sign In Link */}
                <Box sx={{ textAlign: "center", mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?{" "}
                    <Link href="/signin" variant="body2" sx={linkStyles}>
                      Sign In
                    </Link>
                  </Typography>
                </Box>
              </form>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default Signup;