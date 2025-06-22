import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import PatientNavbar from "./PatientNavbar";
import PaymentsIcon from '@mui/icons-material/Payments';

import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Avatar,
  Chip,
  Divider,
  Container,
  Paper,
  Stack,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  LocalHospital as LocalHospitalIcon,
  MedicalServices as MedicalServicesIcon,
  EventAvailable as EventAvailableIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";

const API_URL = import.meta.env.VITE_API_URL;

function FindDoctor() {
  const { userId } = useParams();
  const [specialization, setSpecialization] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onHandleappointment = (doctor) => {
    console.log("doctorname", doctor.name);
    navigate(`/appointment/${userId}`, { state: { doctor } });
  };

  const handleDoctorFilter = async () => {
    if (!specialization.trim()) {
      setError("Please enter a specialization to search");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await axios.get(`${API_URL}/token/${userId}`);
      const token = res.data.token;

      const response = await axios.get(
        `${API_URL}/doctors/specialization/${specialization}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFilteredDoctors(response.data.doctors);
      if (response.data.doctors.length === 0) {
        setError(`No doctors found for specialization "${specialization}"`);
      }
    } catch (error) {
      console.error("Error fetching filtered doctors:", error);
      setError("Failed to fetch doctors. Please try again.");
      setFilteredDoctors([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to get avatar background color based on doctor name
  const getAvatarColor = (name) => {
    const colors = [
      "#1976d2",
      "#2196f3",
      "#03a9f4",
      "#00bcd4",
      "#009688",
      "#4caf50",
      "#8bc34a",
      "#cddc39",
    ];
    const firstLetter = name.charAt(0).toUpperCase();
    const charCode = firstLetter.charCodeAt(0);
    return colors[charCode % colors.length];
  };

  return (
    <>
      <PatientNavbar userId={userId} isShow={true} />

      {/* Hero Section */}
      <Box
        classname="bg-blue-400 "
        sx={{
          backgroundColor: "rgb(96, 165, 250)",
          color: "white",
          py: 6,
          mb: 4,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ position: "relative", zIndex: 1 }}>
            <Typography
              variant="h3"
              fontWeight="bold"
              gutterBottom
              sx={{
                textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <LocalHospitalIcon fontSize="large" />
              Find Your Doctor
            </Typography>
            <Typography
              variant="h6"
              sx={{ maxWidth: 600, mb: 3, opacity: 0.9 }}
            >
              Connect with specialized healthcare professionals and schedule
              appointments with ease
            </Typography>
          </Box>
        </Container>

        {/* Decorative circles */}
        <Box
          sx={{
            position: "absolute",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            top: "-100px",
            right: "-50px",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
            bottom: "-80px",
            left: "10%",
          }}
        />
      </Box>

      {/* Search Section */}
      <Container maxWidth="md" sx={{ mb: 5 }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 2,
            transition: "transform 0.3s",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
            },
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              color: "text.secondary",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <SearchIcon color="primary" /> Search by Specialization
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="Specialization"
              placeholder="e.g. Cardiology, Neurology, Pediatrics"
              variant="outlined"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleDoctorFilter();
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MedicalServicesIcon color="primary" />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              color="primary"
              size="large"
              disableElevation
              onClick={handleDoctorFilter}
              disabled={isLoading}
              sx={{
                px: 4,
                whiteSpace: "nowrap",
                minWidth: { xs: "100%", sm: "150px" },
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Search"
              )}
            </Button>
          </Stack>

          {error && (
            <Alert severity="info" sx={{ mt: 
            
            2 }}>
              {error}
            </Alert>
          )}
        </Paper>
      </Container>

      {/* Results Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredDoctors.length > 0 ? (
          <>
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
              Available Doctors
              <Chip
                label={`${filteredDoctors.length} found`}
                size="small"
                color="primary"
                sx={{ ml: 2 }}
              />
            </Typography>

            <Grid container spacing={3}>
              {filteredDoctors.map((doctor) => (
                <Grid item xs={12} sm={6} md={4} key={doctor.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      },
                      borderRadius: 2,
                      overflow: "hidden",
                    }}
                  >
                    <CardHeader
                      avatar={
                        <Avatar
                          sx={{
                            bgcolor: getAvatarColor(doctor.name),
                            width: 56,
                            height: 56,
                          }}
                          alt={`Dr. ${doctor.name}`}
                        >
                          {doctor.name.charAt(0)}
                        </Avatar>
                      }
                      title={
                        <Typography variant="h6">Dr. {doctor.name}</Typography>
                      }
                      subheader={
                        <Chip
                          label={doctor.specialization}
                          color="primary"
                          size="small"
                          variant="outlined"
                          sx={{ mt: 0.5 }}
                        />
                      }
                      sx={{ pb: 0 }}
                    />

                    <CardContent sx={{ pt: 1, flexGrow: 1 }}>
                      <Stack spacing={1.5} sx={{ mt: 2 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <AccessTimeIcon color="primary" fontSize="small" />
                          <Typography variant="body2" color="text.secondary">
                            <strong>Experience:</strong> {doctor.experience}{" "}
                           
                          </Typography>
                        </Box>

                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                        <PaymentsIcon 
                            color="primary"
                            fontSize="small"
                          />
                          <Typography variant="body2" color="text.secondary">
                            <strong>Consultation Fee:</strong> ₹{doctor.fees}
                          </Typography>
                        </Box>

                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <EventAvailableIcon
                            color="primary"
                            fontSize="small"
                          />
                          <Typography variant="body2" color="text.secondary">
                            <strong>address:</strong> {doctor.address}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>

                    <Divider />

                    <CardActions sx={{ p: 2 }}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="secondary"
                        onClick={() => onHandleappointment(doctor)}
                        startIcon={<EventAvailableIcon />}
                        sx={{
                          borderRadius: "8px",
                          py: 1,
                        }}
                      >
                        Book Appointment
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        ) : specialization ? (
          <Paper
            elevation={1}
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 2,
              backgroundColor: "#f9f9f9",
            }}
          >
            <Box sx={{ mb: 2, color: "text.secondary" }}>
              <SearchIcon sx={{ fontSize: 60, opacity: 0.6 }} />
            </Box>
            <Typography variant="h5" gutterBottom>
              No doctors found
            </Typography>
            <Typography color="text.secondary">
              {`We could not find any doctors matching ${specialization}.
  `}
              <br />
              Try a different specialization or check back later.
            </Typography>
          </Paper>
        ) : (
          <Paper
            elevation={1}
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 2,
              backgroundColor: "#f5f9ff",
            }}
          >
            <Box sx={{ mb: 2, color: "primary.main" }}>
              <MedicalServicesIcon sx={{ fontSize: 60, opacity: 0.7 }} />
            </Box>
            <Typography variant="h5" gutterBottom>
              Find the Right Specialist
            </Typography>
            <Typography color="text.secondary">
              Enter a medical specialization in the search box above to find
              qualified doctors.
            </Typography>
          </Paper>
        )}
      </Container>
    </>
  );
}
// Add this at the bottom
FindDoctor.propTypes = {
  userId: PropTypes.string.isRequired,
};
export default FindDoctor;
