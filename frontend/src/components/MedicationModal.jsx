import  { useState } from 'react';
import Swal from 'sweetalert2';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Grid,
} from '@mui/material';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function MedicationModal({ open, onClose, patientId, userId }) {
  const [medicines, setMedicines] = useState([
    { name: '', dosage: '', frequency: '', duration: '' },
  ]);
  const [notes, setNotes] = useState('');

  const handleMedicineChange = (index, field, value) => {
    const newMeds = [...medicines];
    newMeds[index][field] = value;
    setMedicines(newMeds);
  };

  const addMedicineField = () => {
    setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '' }]);
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        `${API_URL}/postmedication`,
        { userId, patientId, medicines, notes },
        {withCredentials:true}
      );
       
    await Swal.fire({
      icon: 'success',
      title: 'Prescription Saved!',
      text: 'The medication details have been successfully saved.',
    });
      onClose();
      setMedicines([{ name: '', dosage: '', frequency: '', duration: '' }]);
      setNotes('');
    } catch (err) {
      console.error(err);
       Swal.fire({
      icon: 'error',
      title: 'Failed to Save',
      text: 'There was an error while saving the prescription.',
    });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create Prescription</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {medicines.map((med, idx) => (
            <Grid container spacing={1} key={idx} sx={{ mb: 1 }}>
              <Grid item xs={3}>
                <TextField
                  label="Medicine"
                  value={med.name}
                  onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Dosage"
                  value={med.dosage}
                  onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Frequency"
                  value={med.frequency}
                  onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Duration"
                  value={med.duration}
                  onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
                  fullWidth
                />
              </Grid>
            </Grid>
          ))}
          <Button onClick={addMedicineField}>+ Add Medicine</Button>
          <TextField
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            multiline
            rows={3}
            fullWidth
            sx={{ mt: 2 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save Prescription
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MedicationModal;

