import { useState, useEffect } from "react";
import axios from "axios";
import PatientNavbar from "./PatientNavbar";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";

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
import Footer from "./Footer";

const API_URL = import.meta.env.VITE_API_URL;

const AppointmentsPage = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    if (!loading && !userId) {
      setError("Something went wrong. User ID is missing.");
    }
  }, [loading, userId]);

  useEffect(() => {
    if (!userId) return;

    const fetchAppointments = async () => {
      try {
        setProcessing(true);
        const response = await axios.get(`${API_URL}/patients/appointments`, {
          withCredentials: true,
        });

        setUpcomingAppointments(response.data.upcomingAppointments);
        setProcessing(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setProcessing(false);
      }
    };

    fetchAppointments();
  }, [userId]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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

      {/* Hero */}
      <Box
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
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <CalendarIcon fontSize="large" />
            Appointments
          </Typography>
        </Container>
      </Box>

      {/* Appointments */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
          <EventAvailableIcon sx={{ mr: 1 }} color="primary" />
          <Typography variant="h5" fontWeight="500">
            Upcoming Appointments ({upcomingAppointments.length})
          </Typography>
        </Box>

        {loading || processing ? (
          <div className="flex justify-center items-center h-64">
            <CircularProgress />
          </div>
        ) : upcomingAppointments.length > 0 ? (
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <Paper
                key={appointment._id}
                elevation={8}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: "white",
                  borderLeft: "5px solid #3b82f6",
                  boxShadow: "0px 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <Grid container spacing={90}>
                  {/* Doctor Info */}
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight={600} color="primary">
                      Dr. {appointment.doctor?.name || "Doctor"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
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
                        <Typography variant="body2" color="text.secondary">
                          <strong>Symptoms:</strong> {appointment.symptoms}
                        </Typography>
                      </Box>
                    )}
                  </Grid>

                  {/* Date, Time, Status */}
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
                        <Typography variant="body2" color="text.secondary">
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
                        <Typography variant="body2" color="text.secondary">
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
                          variant="caption"
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
              backgroundColor: "white",
            }}
          >
            <CalendarIcon
              sx={{ fontSize: 50, opacity: 0.7, color: "primary.main", mb: 2 }}
            />
            <Typography variant="h6" gutterBottom>
              No Upcoming Appointments
            </Typography>
            <Typography color="text.secondary">
              You do not have any appointments scheduled.
            </Typography>
          </Paper>
        )}
      </Container>

      <Footer />
    </>
  );
};

export default AppointmentsPage;
