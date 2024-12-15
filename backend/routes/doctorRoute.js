const express = require('express');
const User = require('../models/User'); //Assuming your schema is in models/User.js
const Appointment = require('../models/Appointment'); //Ensure you have the Appointment model imported
const router = express.Router();


router.get('/doctors/specialization/:specialization', async (req, res) => {

  const { specialization } = req.params;

  try {
    // Find doctors who match the specialization
    const doctors = await User.find({
      role: 'doctor',
      specialization: { $regex: specialization, $options: 'i' }, // Case-insensitive search
    });

    if (doctors.length === 0) {
      return res.status(404).json({ message: 'No doctors found for the specified specialization.' });
    }

    res.status(200).json({ doctors });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Server error. Could not fetch doctors.' });
  }
});


router.get('/doctor/:id', async (req, res) => {
  try {
    const doctor = await User.findById(req.params.id)
      .populate({
        path: 'appointments',
        populate: {
          path: 'patient', // Populate patient details
          select: 'name', // Only include the patient's name
        },
      });

    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ error: 'Doctor not found or invalid role' });
    }

    // Return the doctor's profile along with populated appointments
    res.status(200).json({ doctor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch doctor profile' });
  }
});



router.get('/patients/:id/appointments', async (req, res) => {
  try {
    const patient = await User.findById(req.params.id);

    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({ error: 'Patient not found or invalid role' });
    }

    // Fetch all appointments for the patient
    const appointments = await Appointment.find({ patient: req.params.id })
      .populate('doctor', 'name') // Populate doctor details
      .sort({ date: 1 }); // Sort by date (ascending)

    const currentDate = new Date();

    // Separate appointments into upcoming and past
    const upcomingAppointments = appointments.filter(appointment => new Date(appointment.date) > currentDate);
    const pastAppointments = appointments.filter(appointment => new Date(appointment.date) <= currentDate);

    res.status(200).json({
      upcomingAppointments,
      pastAppointments,
    });
  } catch (err) {
    console.error('Error fetching patient appointments:', err);
    res.status(500).json({ error: 'Failed to fetch patient appointments' });
  }
});

router.put('/appointment/:id/status', async (req, res) => {
  try {
    const { status } = req.body; // "approved" or "rejected"
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    appointment.status = status;
    await appointment.save();
    res.status(200).json({ message: 'Appointment status updated', appointment });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ error: 'Failed to update appointment status' });
  }
});



module.exports = router;
