const mongoose = require('mongoose');

// Define the schema for notifications
const notificationSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to the patient user
  message: { type: String, required: true },  // Notification message (e.g., appointment status update)
  date: { type: Date, default: Date.now },  // Date when the notification was created
  status: { type: String, enum: ['unread', 'read'], default: 'unread' },  // Status of the notification
});

// Create and export the Notification model
module.exports = mongoose.model('Notification', notificationSchema);
