import mongoose from "mongoose";

const medicationSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicines: [
    {
      name: String,
      dosage: String,
      frequency: String,
      duration: String,
    },
  ],
  notes: String,
  createdAt: { type: Date, default: Date.now },
});

const Medication = mongoose.model('Prescription', medicationSchema );
export default  Medication