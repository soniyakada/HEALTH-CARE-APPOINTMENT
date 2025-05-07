import "./Home.css";
import doctor from "../assets/doctor.jpg";
import Navbar from "./Navbar";
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Button,
  Paper,
  Divider,
  Stack,
} from "@mui/material";
import { 
  AccessTime, 
  Phone,
} from "@mui/icons-material";

function Home() {
  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(to right, #e8f5fe, #ffffff)",
          py: 10,
          overflow: "hidden",
          position: "relative"
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h2" 
                fontWeight="bold" 
                color="primary" 
                gutterBottom
              >
                Medical and Health
              </Typography>
              <Typography 
                variant="h3" 
                gutterBottom 
                sx={{ mb: 3 }}
              >
                Care Services
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, fontSize: "1.1rem" }}>
                Providing exceptional healthcare with a personal touch.
                Our team of dedicated professionals is committed to your wellbeing.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button 
                  variant="contained" 
                  size="large" 
                  sx={{ px: 4, py: 1.5, borderRadius: 2 }}
                >
                  Book Appointment
                </Button>
                <Button 
                  variant="outlined" 
                  size="large" 
                  sx={{ px: 4, py: 1.5, borderRadius: 2 }}
                >
                  Our Services
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box 
                sx={{ 
                  display: "flex", 
                  justifyContent: "center",
                  position: "relative"
                }}
              >
                <Box
                  component="img" 
                  src={doctor}
                  alt="Doctor"
                  sx={{
                    height: 400,
                    width: "auto",
                    borderRadius: 4,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    zIndex: 2
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    height: 400,
                    width: 400,
                    borderRadius: "50%",
                    background: "rgba(66, 165, 245, 0.1)",
                    right: -100,
                    top: -50,
                    zIndex: 1
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box 
        sx={{ 
          py: 6, 
          background: "linear-gradient(to right, #1976d2, #42a5f5)"
        }}
      >
        <Container maxWidth="lg">
          <Grid container alignItems="center" spacing={4}>
            <Grid item xs={12} md={8}>
              <Typography variant="h4" color="white" fontWeight="bold" gutterBottom>
                Need Immediate Medical Attention?
              </Typography>
              <Typography variant="body1" color="white">
                Our emergency services are available 24/7. Contact us right away.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: "left", md: "right" } }}>
              <Button 
                variant="contained" 
                color="secondary" 
                size="large" 
                startIcon={<Phone />}
                sx={{ px: 4, py: 1.5, borderRadius: 2 }}
              >
                Contact Now
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Hours & Location */}
      <Box sx={{ py: 8, background: "#fff" }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={2} 
                sx={{ p: 4, height: "100%", borderRadius: 2 }}
              >
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  <AccessTime sx={{ mr: 1, verticalAlign: "middle" }} />
                  Opening Hours
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body1">Monday - Friday</Typography>
                  <Typography variant="body1" fontWeight="bold">8:00 AM - 8:00 PM</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body1">Saturday</Typography>
                  <Typography variant="body1" fontWeight="bold">8:00 AM - 6:00 PM</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body1">Sunday</Typography>
                  <Typography variant="body1" fontWeight="bold">10:00 AM - 4:00 PM</Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={2} 
                sx={{ p: 4, height: "100%", borderRadius: 2 }}
              >
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  <Phone sx={{ mr: 1, verticalAlign: "middle" }} />
                  Contact Information
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Emergency:</strong> (123) 456-7890
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Appointment:</strong> (123) 456-7891
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> info@medicalcare.com
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default Home;