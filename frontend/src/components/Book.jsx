import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import PatientNavbar from "./PatientNavbar";
import { useAuth } from "../context/AuthContext";
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
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  LocalHospital as LocalHospitalIcon,
  MedicalServices as MedicalServicesIcon,
  Star as StarIcon,
  FilterList as FilterListIcon,
  Info as InfoIcon,
} from "@mui/icons-material";

const API_URL = import.meta.env.VITE_API_URL;

function Book() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openReview, setOpenReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null); 
  const [reviewsMap, setReviewsMap] = useState({});
  const [allreviews, setAllreviews] = useState([]);
  const {user} = useAuth();

    if (user) {
  // console.log("User ID:", user.id);
  
  }
  const userId = user?.id;



// handleOpenReview ko doctor parameter leke update kijiye:
const handleOpenReview = async (doctor) => {
  setSelectedDoctor(doctor);
  setOpenReview(true);
   try {
    const response = await axios.get(`${API_URL}/reviews/${doctor._id}`);
    setAllreviews(response.data.reviews);
  } catch (error) {
    console.error("Error fetching reviews for doctor:", error);
  }
};
 const handleCloseReview = () => {
  setOpenReview(false);
  setRating(0);
  setReview("");
  setSelectedDoctor(null);
};

const doctorId = selectedDoctor ? selectedDoctor._id : null;

const handleSubmitReview = async() => {
     await axios.post(
  `${API_URL}/reviews`,
  { userId,
    rating,
    review,
    doctorId
  },
  {
    withCredentials:true,
  }
      );
    handleCloseReview();
  };
  const navigate = useNavigate();

  const onHandleappointment = (doctor) => {
    navigate(`/appointment/${doctor._id}`);
  };


const fetchReviews = async (doctorId) => {
  try {
    const response = await axios.get(`${API_URL}/reviews/${doctorId}`);
    setAllreviews(response.data.reviews);
    setReviewsMap((prev) => ({
      ...prev,
      [doctorId]: response.data.reviews,
    }));
  } catch (err) {
    setError(err.message);
  }
};

  const handleDoctor = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/allDoctor`, {
        withCredentials:true,
      });
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

  useEffect(() => {
  doctors.forEach((doc) => fetchReviews(doc._id));
}, [doctors]);


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

 const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  const average = total / reviews.length;
  return average.toFixed(1); // Round to 1 decimal place, e.g., 4.3
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
              to={`/findDoctor`}
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
              {doctors.map((doctor) => {
  const doctorReviews = reviewsMap[doctor._id] || [];
  const avgRating = calculateAverageRating(doctorReviews); 

  return (
    <Grid item xs={12} sm={6} md={4} key={doctor._id}>
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
                <StarIcon  sx={{ color: "#FFB400", fontSize: 18 }}/>
                {avgRating}
              </Box>
            </Box>
          }
        />

        <CardContent sx={{ pt: 0 }}>
          {/* Additional info about doctor (optional) */}
        </CardContent>

        <CardActions>
          <Button onClick={() => onHandleappointment(doctor)}>Book Appointment</Button>
            <Button onClick={() => handleOpenReview(doctor)}>Give Review</Button>
        </CardActions>
      </Card>
    </Grid>
  );
})}

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
        <Dialog open={openReview} onClose={handleCloseReview}>
        <DialogTitle>
        Give Review for Dr. {selectedDoctor ? selectedDoctor.name : ""}
        </DialogTitle>
       <DialogContent>
  {/* Review Input Section */}
  <Box sx={{ mt: 1, mb: 2 }}>
    <Typography component="legend">Rating</Typography>
    <Rating
      name="doctor-rating"
      value={rating}
      precision={0.5}
      onChange={(event, newValue) => setRating(newValue)}
    />
  </Box>
  <TextField
    label="Write your review"
    multiline
    rows={4}
    fullWidth
    variant="outlined"
    value={review}
    onChange={(e) => setReview(e.target.value)}
  />

  {/* Divider */}
  <Box sx={{ mt: 3, mb: 1 }}>
    <Typography variant="h6">Previous Reviews</Typography>
  </Box>

{allreviews.length === 0 ? (
  <Typography variant="body2" color="text.secondary">
    No comments yet.
  </Typography>
) : (
  allreviews.map((r, index) => (
    <Box
      key={index}
      sx={{
        my: 1,
        p: 2,
        border: '1px solid #ddd',
        borderRadius: 2,
        backgroundColor: '#f9f9f9',
      }}
    >
      <Typography variant="subtitle2" fontWeight="bold">
        {r.reviewer?.name || "Anonymous"}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {new Date(r.createdAt).toLocaleString()}
      </Typography>
      <Typography variant="body1">{r.comment}</Typography>
    </Box>
  ))
)}
</DialogContent>

        <DialogActions>
          <Button onClick={handleCloseReview}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmitReview}
            disabled={rating === 0 || review.trim() === ""}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Book;
