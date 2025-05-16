import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['patient', 'doctor', 'admin'],
    default: 'patient',
    
  },
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }], // Reference to appointments
  contactNumber: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: function () {
      return this.role === 'patient';
    },
  },
  dateOfBirth: {
    type: Date,
    required: function () {
      return this.role === 'patient';
    },
  },
  address: {
    type: String,
    required: true,
  },

  // Only for doctors
  specialization: {
    type: String,
    required: function () {
      return this.role === 'doctor';
    },
  },

  availability: {
    type: [String], // e.g., ["Monday 9-11 AM", "Tuesday 2-5 PM"]
    required: function () {
      return this.role === 'doctor';
    },
  },
  fees: {
    type: Number,
    required: function () {
      return this.role === 'doctor';
    },
  },
  token:{
    type:String,
  },

  // Audit Information
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  reviewsGiven: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  reviewsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],

});


export default mongoose.model('User', userSchema);
