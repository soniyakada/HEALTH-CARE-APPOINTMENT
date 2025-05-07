import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import PatientNavbar from "./PatientNavbar";
import {
  Box,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Grid,
} from "@mui/material";
import {
  MedicalServices as MedicalServicesIcon,
  CalendarToday as CalendarIcon,
  AccessTime as AccessTimeIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material";

const API_URL = import.meta.env.VITE_API_URL;

function MedicalRecords() {
  const { userId } = useParams();
  const [pastAppointments, setPastAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setPastAppointments(response.data.pastAppointments);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [userId]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <PatientNavbar userId={userId} isShow={true} />

      {/* Hero Section */}
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
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <MedicalServicesIcon fontSize="Medium" />
            Medical Records
          </Typography>
        </Container>
      </Box>

      {/* Medical Records List */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
          <AssignmentIcon sx={{ mr: 1 }} color="primary" />
          <Typography variant="h5" fontWeight="500">
            Past Appointments ({pastAppointments.length})
          </Typography>
        </Box>

        {pastAppointments.length > 0 ? (
          <div className="space-y-4">
            {pastAppointments.map((appointment) => (
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
                        <Typography variant="body1">
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
                        <Typography variant="body1">
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
    </>
  );
}

export default MedicalRecords;
