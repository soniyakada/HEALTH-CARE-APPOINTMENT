import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import PatientNavbar from "./PatientNavbar";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Import MUI components
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
} from "@mui/material";
import {
  CalendarToday as CalendarIcon,
  AccessTime as AccessTimeIcon,
  EventAvailable as EventAvailableIcon,
  LocalHospital as LocalHospitalIcon,
} from "@mui/icons-material";

const API_URL = import.meta.env.VITE_API_URL;

const AppointmentsPage = () => {
  const { userId } = useParams();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error ,setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      setError("Something went wrong. User ID is missing.");
    }
  }, [userId]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await axios.get(`${API_URL}/token/${userId}`);
        const token = res.data.token;

        const response = await axios.get(
          `${API_URL}/patients/${userId}/appointments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUpcomingAppointments(response.data.upcomingAppointments);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [userId]);

  // Format date for better display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

 if (loading) {
    return (
      <div className="flex justify-center items-center h-screen" >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  //Show error if userId is missing
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-2xl text-red-600 font-semibold mb-2">{error}</h1>
        <button
          onClick={() => navigate("/signin")}
          className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <>
      <PatientNavbar userId={userId} isShow={true} />
      <ToastContainer />

      {/* Hero Section - simplified version */}
      <Box
        className="ring-4"
        sx={{
          backgroundColor: "rgb(96, 165, 250)",
          color: "white",
          py: 4,
          mb: 4,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <CalendarIcon fontSize="Medium" />
            Appointments
          </Typography>
        </Container>
      </Box>

      {/* Appointments List Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
          <EventAvailableIcon sx={{ mr: 1 }} color="primary" />
          <Typography variant="h5" fontWeight="500">
            Upcoming Appointments ({upcomingAppointments.length})
          </Typography>
        </Box>

        {upcomingAppointments.length > 0 ? (
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <Paper
                key={appointment._id}
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid rgba(0,0,0,0.05)",
                }}
              >
                <Grid container spacing={85}>
                  {/* Doctor Info */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" color="primary">
                      Dr. {appointment.doctor?.name || "Doctor"}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                      {appointment.doctor?.specialization || "Specialist"}
                    </Typography>

                    {appointment.symptoms && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mt: 2,
                        }}
                      >
                        <LocalHospitalIcon color="primary" fontSize="small" />
                        <Typography variant="body1">
                          <strong>Symptoms:</strong> {appointment.symptoms}
                        </Typography>
                      </Box>
                    )}
                  </Grid>

                  {/* Appointment Date/Time/Status */}
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        justifyContent: "center",
                        borderLeft: {
                          xs: "none",
                          md: "1px solid rgba(0,0,0,0.1)",
                        },
                        pl: { xs: 0, md: 3 },
                        pt: { xs: 2, md: 0 },
                        mt: { xs: 2, md: 0 },
                        borderTop: {
                          xs: "1px solid rgba(0,0,0,0.1)",
                          md: "none",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <CalendarIcon color="primary" fontSize="small" />
                        <Typography variant="body1">
                          <strong>Date:</strong> {formatDate(appointment.date)}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          mb: 2,
                        }}
                      >
                        <AccessTimeIcon color="primary" fontSize="small" />
                        <Typography variant="body1">
                          <strong>Time:</strong> {appointment.timeSlot}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          p: 1,
                          bgcolor: "rgba(96, 165, 250, 0.1)",
                          borderRadius: 1,
                          justifyContent: "center",
                        }}
                      >
                        <EventAvailableIcon color="primary" fontSize="small" />
                        <Typography
                          variant="body2"
                          fontWeight="medium"
                          color="primary"
                        >
                          Appointment Confirmed
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </div>
        ) : (
          <Paper
            elevation={1}
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 2,
            }}
          >
            <CalendarIcon
              sx={{ fontSize: 50, opacity: 0.7, color: "primary.main", mb: 2 }}
            />
            <Typography variant="h6" gutterBottom>
              No Upcoming Appointments
            </Typography>
            <Typography color="text.secondary">
              You dont have any appointments scheduled.
            </Typography>
          </Paper>
        )}
      </Container>
    </>
  );
};

export default AppointmentsPage;
