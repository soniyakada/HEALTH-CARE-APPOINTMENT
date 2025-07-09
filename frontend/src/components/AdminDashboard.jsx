import  { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Button, Tab, Tabs, Avatar } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/users`, { withCredentials: true });
      const allUsers = res.data;
      setDoctors(allUsers.filter(user => user.role === 'doctor'));
      setPatients(allUsers.filter(user => user.role === 'patient'));
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onHandleLogout = async () => {
    try {
       await axios.post(`${API_URL}/logout`, {}, {
      withCredentials: true,
    });
      navigate('/signin')
    } catch (error) {
      console.error("Error", error.message);
    }
  };
  

  const handleVerifyDoctor = async (doctorId) => {
    try {
      await axios.put(`${API_URL}/admin/verifydoctor/${doctorId}`, {}, { withCredentials: true });
      fetchUsers();
    } catch (err) {
      console.error("Verification failed", err);
    }
  };

  return (
    <Box sx={{ padding: 4, background: 'linear-gradient(to right, #1976d2, #42a5f5)', minHeight: '100vh' }}>
        <div className='flex justify-between items-center gap-96'>
      <Typography variant="h4" color="white" gutterBottom>
        Admin Dashboard
      </Typography>
       <button
              onClick={onHandleLogout}
              className="bg-white text-blue-700 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              Log out
            </button>
            </div>

      <Box sx={{ bgcolor: 'white', borderRadius: 2, padding: 2 }}>
        <Tabs value={tab} onChange={(e, newVal) => setTab(newVal)}>
          <Tab label="Doctors" />
          <Tab label="Patients" />
        </Tabs>

        {tab === 0 && (
          <Grid container spacing={2} mt={1}>
            {doctors.map(doc => (
              <Grid item xs={12} sm={6} md={4} key={doc._id}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar>{doc.name.charAt(0)}</Avatar>
                    <Box>
                      <Typography variant="h6">{doc.name}</Typography>
                      <Typography variant="body2" color="textSecondary">{doc.email}</Typography>
                      <Typography variant="body2">Specialization: {doc.specialization || 'N/A'}</Typography>
                    </Box>
                  </Box>
                  {!doc.verified && (
                    <Button
                    variant="contained"
                    color={doc.verifyStatus ? "success" : "primary"}
                    onClick={() => !doc.verifyStatus && handleVerifyDoctor(doc._id)}
                    disabled={doc.verifyStatus}
                    sx={{ mt: 2 }}
                  >
                    {doc.verifyStatus ? "Verified" : "Verify Doctor"}
                  </Button>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        {tab === 1 && (
          <Grid container spacing={2} mt={1}>
            {patients.map(p => (
              <Grid item xs={12} sm={6} md={4} key={p._id}>
                <Paper elevation={3} sx={{ padding: 2 }}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar>{p.name.charAt(0)}</Avatar>
                    <Box>
                      <Typography variant="h6">{p.name}</Typography>
                      <Typography variant="body2" color="textSecondary">{p.email}</Typography>
                      <Typography variant="body2">Gender: {p.gender || 'N/A'}</Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
