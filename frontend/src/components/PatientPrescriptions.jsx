import { useEffect, useState } from 'react';
import axios from 'axios';
import PatientNavbar from './PatientNavbar';
import { useAuth } from '../context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
import Footer from './Footer';

import {
  Box,
  Typography,
  Container,
  Paper,
} from '@mui/material';
import {
  LocalPharmacy as PharmacyIcon,
  Assignment as AssignmentIcon,
  Notes as NotesIcon,
} from '@mui/icons-material';

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState('');
  const API_URL = import.meta.env.VITE_API_URL;
  const { user } = useAuth();
  const patientId = user?.id;

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await axios.get(`${API_URL}/prescription`, {
          withCredentials: true,
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

  return (
    <>
      <PatientNavbar userId={patientId} isShow={true} />

      {/* Hero Section */}
      <Box
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
            <PharmacyIcon fontSize="medium" />
            Prescriptions
          </Typography>
        </Container>
      </Box>

      {/* Prescriptions Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <AssignmentIcon sx={{ mr: 1 }} color="primary" />
          <Typography variant="h5" fontWeight="500">
            Your Prescriptions ({prescriptions.length})
          </Typography>
        </Box>

        {/* Error Message */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center"
            role="alert"
          >
            <strong className="font-semibold">Oops!</strong> {error}
          </div>
        )}

        {/* Loader */}
        {processing ? (
          <div className="flex justify-center items-center h-64">
            <CircularProgress />
          </div>
        ) : prescriptions.length > 0 ? (
          prescriptions.map((prescription, index) => (
            <Paper
              key={index}
              elevation={8}
              sx={{
                p: 3,
                borderRadius: 2,
                backgroundColor: 'white',
                borderLeft: '5px solid #3b82f6',
                boxShadow: '0px 2px 8px rgba(0,0,0,0.05)',
                mb: 3,
              }}
            >
              {/* Doctor & Date */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1,
                }}
              >
                <Typography variant="subtitle1" fontWeight={600} color="primary">
                  Dr. {prescription.doctorId?.name || 'Doctor'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(prescription.createdAt)}
                </Typography>
              </Box>

              {/* Medicines */}
              <Box sx={{ mb: 1 }}>
                {prescription.medicines.map((med, medIndex) => (
                  <Box
                    key={medIndex}
                    sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}
                  >
                    <PharmacyIcon sx={{ fontSize: 16, color: '#3b82f6', mr: 1 }} />
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {med.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {med.dosage}, {med.frequency}, {med.duration}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Notes */}
              {prescription.notes && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <NotesIcon sx={{ fontSize: 16, color: '#3b82f6', mr: 1 }} />
                  <Typography variant="caption" color="text.secondary">
                    {prescription.notes}
                  </Typography>
                </Box>
              )}
            </Paper>
          ))
        ) : (
          <Paper
            elevation={1}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 2,
              backgroundColor: 'white',
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

      <Footer />
    </>
  );
};

export default PatientPrescriptions;
