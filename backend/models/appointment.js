const mongoose = require('mongoose');

// Define the schema
const appointmentSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
});

// Check if the model is already compiled
module.exports = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);
