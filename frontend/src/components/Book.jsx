import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import PatientNavbar from "./PatientNavbar";
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Avatar,
  Chip,
  Divider,
  Paper,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  LocalHospital as LocalHospitalIcon,
  MedicalServices as MedicalServicesIcon,
  EventAvailable as EventAvailableIcon,
  MonetizationOn as MonetizationOnIcon,
  AccessTime as AccessTimeIcon,
  Star as StarIcon,
  FilterList as FilterListIcon,
  Info as InfoIcon,
} from "@mui/icons-material";

const API_URL = import.meta.env.VITE_API_URL;

function Book() {
  const { userId } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onHandleappointment = (doctor) => {
    console.log("doctorname", doctor.name);
    navigate(`/appointment/${userId}`, { state: { doctor } });
  };

  const handleDoctor = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/token/${userId}`);

      // Extract the token from the response
      const token = res.data.token;
      const response = await axios.get(`${API_URL}/allDoctor`, {
        headers: {
          Authorization: `Bearer ${token}`, // Attach token in the header
        },
      });
      console.log("..............f", response.data);
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setError("Failed to fetch doctors. Please try again later.");
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleDoctor();
  }, [userId]);

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

  // Get random rating for demonstration
  const getRandomRating = () => {
    return (Math.floor(Math.random() * 10) + 35) / 10; // Random rating between 3.5 and 5.0
  };

  return (
    <>
      <PatientNavbar userId={userId} isShow={true} />

      {/* Hero Section */}
      <Box
        sx={{
          backgroundColor: "rgb(96, 165, 250)",
          color: "white",
          py: 6,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            <Typography
              variant="h3"
              component="h1"
              fontWeight="bold"
              gutterBottom
              sx={{
                textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              <LocalHospitalIcon fontSize="large" />
              Our Healthcare Specialists
            </Typography>
            <Typography
              variant="h6"
              sx={{
                maxWidth: 800,
                mb: 3,
                opacity: 0.9,
                mx: "auto",
              }}
            >
              Find the right doctor for your healthcare needs and book
              appointments online
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              component={Link}
              to={`/findDoctor/${userId}`}
              startIcon={<FilterListIcon />}
              sx={{
                borderRadius: "50px",
                px: 4,
                py: 1.5,
                boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Filter by Specialization
            </Button>
          </Box>
        </Container>

        {/* Decorative elements */}
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

      {/* Content Section */}
      <Container
        maxWidth="lg"
        sx={{
          py: 6,
          position: "relative",
          mt: -3,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 2,
            mb: 5,
            borderRadius: 2,
            backgroundColor: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, pl: 1 }}>
            <MedicalServicesIcon color="primary" />
            <Typography variant="h6" color="primary.main">
              All Available Doctors
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <InfoIcon color="primary" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              Find doctors across all specializations
            </Typography>
          </Box>
        </Paper>

        <Box>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", my: 8 }}>
              <CircularProgress size={60} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ my: 4 }}>
              {error}
            </Alert>
          ) : doctors.length > 0 ? (
            <Grid container spacing={3}>
              {doctors.map((doctor) => (
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
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 1,
                            mt: 0.5,
                          }}
                        >
                          <Chip
                            label={doctor.specialization}
                            color="primary"
                            size="small"
                            variant="outlined"
                          />
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              ml: "auto",
                            }}
                          >
                            <StarIcon sx={{ color: "#FFB400", fontSize: 18 }} />
                            <Typography variant="body2" sx={{ ml: 0.5 }}>
                              {getRandomRating().toFixed(1)}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />

                    <CardContent sx={{ pt: 0, pb: 1, flexGrow: 1 }}>
                      <Divider sx={{ my: 2 }} />
                      <Stack spacing={1.5}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <AccessTimeIcon color="primary" fontSize="small" />
                          <Typography variant="body2" color="text.secondary">
                            <strong>Experience:</strong> {doctor.experience}{" "}
                            years
                          </Typography>
                        </Box>

                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <MonetizationOnIcon
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
                            <strong>Availability:</strong> {doctor.availability}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>

                    <CardActions sx={{ p: 2, pt: 0 }}>
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
          ) : (
            <Paper
              elevation={1}
              sx={{
                p: 6,
                textAlign: "center",
                borderRadius: 2,
                backgroundColor: "#f9f9f9",
                my: 4,
              }}
            >
              <LocalHospitalIcon
                sx={{
                  fontSize: 60,
                  color: "text.secondary",
                  opacity: 0.6,
                  mb: 2,
                }}
              />
              <Typography variant="h5" gutterBottom>
                No Doctors Available
              </Typography>
              <Typography color="text.secondary" paragraph>
                We could not find any doctors in our system at the moment.
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleDoctor}
                sx={{ mt: 2 }}
              >
                Refresh
              </Button>
            </Paper>
          )}
        </Box>
      </Container>
    </>
  );
}

export default Book;
