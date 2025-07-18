import { useState, useEffect } from "react";
import axios from "axios";
import PatientNavbar from "./PatientNavbar";
import { useAuth } from "../context/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";
import Footer from "./Footer";

import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
} from "@mui/material";
import {
  MedicalServices as MedicalServicesIcon,
  CalendarToday as CalendarIcon,
  AccessTime as AccessTimeIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";

function MedicalRecords() {
  const [pastAppointments, setPastAppointments] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [apiError, setApiError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;
  const { user, loading } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    if (!loading && !userId) {
      setApiError("Something went wrong. User ID is missing.");
    }
  }, [loading, userId]);

  const fetchAppointments = async () => {
    if (!userId) return;

    try {
      setProcessing(true);
      const response = await axios.get(
        `${API_URL}/patients/appointments`,
        { withCredentials: true }
      );
      setPastAppointments(response.data.pastAppointments);
      setProcessing(false);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setApiError(
        error?.response?.data?.message ||
        error?.message ||
        "Error fetching appointments."
      );
      setProcessing(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [userId]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <PatientNavbar userId={userId} isShow={true} />

      {/* Hero Section */}
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
            <MedicalServicesIcon fontSize="Medium" />
            Medical Records
          </Typography>
        </Container>
      </Box>

      {/* Appointment Cards */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
          <AssignmentIcon sx={{ mr: 1 }} color="primary" />
          <Typography variant="h5" fontWeight="500">
            Past Appointments ({pastAppointments.length})
          </Typography>
        </Box>

        {apiError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center" role="alert">
            <strong className="font-semibold">Oops!</strong> {apiError}
          </div>
        )}

        {loading || processing ? (
          <div className="flex justify-center items-center h-64">
            <CircularProgress />
          </div>
        ) : pastAppointments.length > 0 ? (
          <div className="space-y-4">
            {pastAppointments.map((appointment) => (
              <Paper
                key={appointment._id}
                elevation={8}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: 'white',
                  borderLeft: '5px solid #3b82f6',
                  boxShadow: '0px 2px 8px rgba(0,0,0,0.05)',
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
                  </Grid>

                  {/* Appointment Date/Time */}
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
                        }}
                      >
                        <AccessTimeIcon color="primary" fontSize="small" />
                        <Typography variant="body2" color="text.secondary">
                          <strong>Time:</strong> {appointment.timeSlot}
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
            <AssignmentIcon
              sx={{ fontSize: 50, opacity: 0.7, color: "primary.main", mb: 2 }}
            />
            <Typography variant="h6" gutterBottom>
              No Past Appointments
            </Typography>
            <Typography color="text.secondary">
              You haven’t completed any appointments yet.
            </Typography>
          </Paper>
        )}
      </Container>
      <Footer />
    </>
  );
}

export default MedicalRecords;
