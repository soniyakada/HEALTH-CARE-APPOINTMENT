import { useEffect, useState } from 'react';
import axios from 'axios';
import PatientNavbar from './PatientNavbar';
import { useAuth } from "../context/AuthContext";
import CircularProgress from "@mui/material/CircularProgress";

import {
  Box,
  Typography,
  Container,
  Paper,
  Grid,
} from '@mui/material';
import {
  LocalPharmacy as PharmacyIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Notes as NotesIcon,
} from '@mui/icons-material';

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [processing, setProcessing] = useState(true);
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
         setProcessing(false);
      }
    };

    fetchPrescriptions();
  }, [patientId]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

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

        {processing ? <div className="flex justify-center items-center h-64">
              <CircularProgress />
            </div>: prescriptions.length > 0 ? (
          <Grid container spacing={7}>
  {prescriptions.map((prescription, index) => (
    <Grid item xs={12} sm={6} md={4} key={index}>
      <Paper
        elevation={2}
        sx={{
          p: 2,
          borderRadius: 2,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          border: '1px solid rgba(0,0,0,0.1)',
        }}
      >
        {/* Doctor & Date */}
        <Box sx={{ mb: 1 }}>
          <Typography
            variant="subtitle1"
            fontWeight="600"
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <PersonIcon color="primary" fontSize="small" />
            Dr. {prescription.doctorId?.name || 'Doctor'}
          </Typography>
          <Typography
            variant="body2"
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            color="text.secondary"
          >
            <CalendarIcon fontSize="small" />
            {formatDate(prescription.createdAt)}
          </Typography>
        </Box>

        {/* Medicines */}
        <Box sx={{ mb: 1 }}>
          <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
            Medicines:
          </Typography>
          {prescription.medicines.slice(0, 2).map((med, medIndex) => (
            <Box key={medIndex} sx={{ mb: 0.5 }}>
              <Typography variant="body2" color="primary" fontWeight="600">
                {med.name}
              </Typography>
              <Typography variant="caption">
                {med.dosage}, {med.frequency}, {med.duration}
              </Typography>
            </Box>
          ))}
          {prescription.medicines.length > 2 && (
            <Typography variant="caption" color="text.secondary">
              +{prescription.medicines.length - 2} more...
            </Typography>
          )}
        </Box>

        {/* Notes */}
        {prescription.notes && (
          <Box>
            <Typography
              variant="body2"
              fontWeight="bold"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <NotesIcon fontSize="small" /> Notes:
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {prescription.notes.length > 40
                ? `${prescription.notes.slice(0, 40)}...`
                : prescription.notes}
            </Typography>
          </Box>
        )}
      </Paper>
    </Grid>
  ))}
</Grid>

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