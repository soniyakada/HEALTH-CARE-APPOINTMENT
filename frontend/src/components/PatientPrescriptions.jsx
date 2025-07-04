import { useEffect, useState } from 'react';
import axios from 'axios';
import PatientNavbar from './PatientNavbar';
import { useAuth } from "../context/AuthContext";
import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
  Chip,
  Divider,
} from '@mui/material';
import {
  LocalPharmacy as PharmacyIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Medication as MedicationIcon,
  Notes as NotesIcon,
} from '@mui/icons-material';

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_URL = import.meta.env.VITE_API_URL;
   const {user} = useAuth();

  if (user) {
  console.log("User ID:", user.id);
  }
  const patientId = user?.id;


  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await axios.get(`${API_URL}/prescription/${patientId}`,{
          withCredentials:true,
        });
        setPrescriptions(res.data.prescriptions);
      } catch {
        setError('Failed to load prescriptions');
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [patientId]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <>
        <PatientNavbar userId={patientId} isShow={true} />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Paper
            elevation={1}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 2,
              bgcolor: 'error.light',
              color: 'error.contrastText',
            }}
          >
            <Typography variant="h6">{error}</Typography>
          </Paper>
        </Container>
      </>
    );
  }

  return (
    <>
      <PatientNavbar userId={patientId} isShow={true} />

      {/* Hero Section */}
      <Box
        className="ring-4"
        sx={{
          backgroundColor: 'rgb(96, 165, 250)',
          color: 'white',
          py: 4,
          mb: 4,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <PharmacyIcon fontSize="Medium" />
            Prescriptions
          </Typography>
        </Container>
      </Box>

      {/* Prescriptions List */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <AssignmentIcon sx={{ mr: 1 }} color="primary" />
          <Typography variant="h5" fontWeight="500">
            Your Prescriptions ({prescriptions.length})
          </Typography>
        </Box>

        {prescriptions.length > 0 ? (
          <div className="space-y-4">
            {prescriptions.map((prescription, index) => (
              <Paper
                key={index}
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid rgba(0,0,0,0.05)',
                }}
              >
                <Grid container spacing={3}>
                  {/* Doctor Info and Date */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <PersonIcon color="primary" fontSize="small" />
                        <Typography variant="h6" color="primary">
                          Dr. {prescription.doctorId?.name || 'Doctor'}
                        </Typography>
                      </Box>
                      
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <CalendarIcon color="primary" fontSize="small" />
                        <Typography variant="body1">
                          <strong>Prescribed on:</strong>{' '}
                          {formatDate(prescription.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Prescription ID or Status */}
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        justifyContent: 'center',
                        borderLeft: {
                          xs: 'none',
                          md: '1px solid rgba(0,0,0,0.1)',
                        },
                        pl: { xs: 0, md: 3 },
                        pt: { xs: 2, md: 0 },
                        mt: { xs: 2, md: 0 },
                        borderTop: {
                          xs: '1px solid rgba(0,0,0,0.1)',
                          md: 'none',
                        },
                      }}
                    >
                      <Chip
                        icon={<PharmacyIcon />}
                        label="Prescription"
                        color="primary"
                        variant="outlined"
                        sx={{ alignSelf: 'flex-start' }}
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                {/* Medicines Section */}
                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    <MedicationIcon color="primary" fontSize="small" />
                    <Typography variant="h6" fontWeight="600">
                      Medicines:
                    </Typography>
                  </Box>

                  <Grid container spacing={2}>
                    {prescription.medicines.map((med, medIndex) => (
                      <Grid item xs={12} sm={6} md={4} key={medIndex}>
                        <Paper
                          elevation={1}
                          sx={{
                            p: 2,
                            borderRadius: 1,
                            bgcolor: 'rgba(96, 165, 250, 0.05)',
                            border: '1px solid rgba(96, 165, 250, 0.2)',
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            fontWeight="600"
                            color="primary"
                            gutterBottom
                          >
                            {med.name}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 0.5 }}>
                            <strong>Dosage:</strong> {med.dosage}
                          </Typography>
                          <Typography variant="body2" sx={{ mb: 0.5 }}>
                            <strong>Frequency:</strong> {med.frequency}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Duration:</strong> {med.duration}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                {/* Notes Section */}
                {prescription.notes && (
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      bgcolor: 'rgba(0,0,0,0.02)',
                      borderRadius: 1,
                      border: '1px solid rgba(0,0,0,0.1)',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <NotesIcon color="primary" fontSize="small" />
                      <Typography variant="subtitle1" fontWeight="600">
                        Notes:
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {prescription.notes}
                    </Typography>
                  </Box>
                )}
              </Paper>
            ))}
          </div>
        ) : (
          <Paper
            elevation={1}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 2,
            }}
          >
            <PharmacyIcon
              sx={{ fontSize: 50, opacity: 0.7, color: 'primary.main', mb: 2 }}
            />
            <Typography variant="h6" gutterBottom>
              No Prescriptions Found
            </Typography>
            <Typography color="text.secondary">
              You do not have any prescriptions yet.
            </Typography>
          </Paper>
        )}
      </Container>
    </>
  );
};

export default PatientPrescriptions;