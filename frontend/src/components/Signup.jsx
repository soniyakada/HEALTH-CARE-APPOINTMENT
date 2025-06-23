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
  Grid,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
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
import KeyIcon from "@mui/icons-material/Key";

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
  const [experience, setExperience] = useState("");
  const [fees, setFees] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

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

  // Steps for the registration process
  const steps = ['Enter Details', 'Verify Email', 'Complete Registration'];

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  // Function to validate user details
  const validateForm = () => {
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
      
      if (!experience.trim()) {
        setAvailabilityError("Experience is required");
        hasError = true;
      }
      
      if (!fees) {
        setFeesError("Fees is required");
        hasError = true;
      }
    }

    return !hasError;
  };

  // Function to send OTP
  const sendOTP = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Send request to generate and send OTP
     await axios.post(`${API_URL}/generate-otp`, { email });
      setMessage("OTP sent to your email. Please check your inbox and enter the code below.");
      setActiveStep(1);
      
      // Start countdown for resend button
      setResendDisabled(true);
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount <= 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Error sending OTP:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Function to verify OTP
  const verifyOTP = async () => {
    setLoading(true);
    setOtpError("");

    if (!otp.trim()) {
      setOtpError("Please enter the OTP sent to your email");
      setLoading(false);
      return;
    }

    try {
      // Send request to verify OTP
       await axios.post(`${API_URL}/verify-otp`, { 
        email, 
        otp
      });
     // If OTP is verified, proceed to final registration
      completeRegistration();
    } catch (error) {
      console.error("Error verifying OTP:", error.response?.data || error.message);
      setOtpError(error.response?.data?.message || "Invalid OTP. Please try again.");
      setLoading(false);
    }
  };

  // Function to complete registration after OTP verification
  const completeRegistration = async () => {
    try {
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
        experience: role === "doctor" ? experience : undefined,
        fees: role === "doctor" ? fees : undefined,
      };

      // Register the user
      await axios.post(`${API_URL}/register`, formData);
      
      setActiveStep(2);
      setMessage("Registration successful!");
      
      // Show success dialog
      setOpenDialog(true);
      
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
      setExperience("");
      setFees("");
      setOtp("");
      
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handler for the main form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (activeStep === 0) {
      sendOTP();
    } else if (activeStep === 1) {
      verifyOTP();
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
              {/* Stepper */}
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {message && (
                <Alert 
                  severity={message.includes("successful") ? "success" : message.includes("OTP sent") ? "info" : "error"} 
                  sx={{ mb: 3 }}
                >
                  {message}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                {activeStep === 0 && (
                  <Grid container spacing={3}>
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
                    <Grid item xs={1}>
                      <TextField
                        required
                        fullWidth
                        id="address"
                        label="Address"
                        name="address"
                        autoComplete="address"
                        multiline
                        rows={1}
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
                            label="Experience"
                            name="availability"
                            placeholder="e.g. 5 years"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
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
                  </Grid>
                )}

                {/* OTP Verification Step */}
                {activeStep === 1 && (
                  <Box sx={{ my: 2 }}>
                    <Typography variant="body1" gutterBottom>
                      An OTP has been sent to your email address. Please enter it below to verify your account.
                    </Typography>
                    
                    <TextField
                      required
                      fullWidth
                      id="otp"
                      label="Enter OTP"
                      name="otp"
                      sx={{ mt: 2 }}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      error={!!otpError}
                      helperText={otpError}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <KeyIcon color="primary" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                      <Button 
                        variant="outlined" 
                        onClick={() => setActiveStep(0)}
                        disabled={loading}
                      >
                        Back
                      </Button>
                      
                      <Button 
                        variant="outlined" 
                        onClick={sendOTP}
                        disabled={resendDisabled || loading}
                      >
                        {resendDisabled ? `Resend OTP (${countdown}s)` : "Resend OTP"}
                      </Button>
                    </Box>
                  </Box>
                )}

                {/* Submit Button */}
                {activeStep < 2 && (
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
                      activeStep === 0 ? "Continue" : "Verify & Complete Registration"
                    )}
                  </Button>
                )}

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

      {/* Success Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Registration Successful!"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Your account has been successfully created. You can now sign in to access your account.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate("/signin")} color="primary" autoFocus>
            Sign In
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Signup;