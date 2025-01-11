import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Modal, Box, Typography, TextField, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import viewIcon from "../assets/viewIcon.svg"
import dietChart from "../assets/dietChart.svg"
import assignIcon from "../assets/assignIcon.png"


const samplePatients = [
  {
    id: 1,
    name: 'John Doe',
    diseases: 'Diabetes',
    allergies: 'Peanuts',
    roomNumber: 101,
    bedNumber: 1,
    floorNumber: 1,
    age: 45,
    gender: 'Male',
    contactInfo: '1234567890',
    emergencyContact: '9876543210',
    notes: 'Requires low-sugar diet',
  },
  {
    id: 2,
    name: 'Jane Smith',
    diseases: 'Hypertension',
    allergies: 'Dust',
    roomNumber: 102,
    bedNumber: 2,
    floorNumber: 1,
    age: 50,
    gender: 'Female',
    contactInfo: '0987654321',
    emergencyContact: '1122334455',
    notes: 'Low-salt diet recommended',
  }
];

const PatientDetails = () => {
  const [patients, setPatients] = useState(samplePatients);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    diseases: '',
    allergies: '',
    roomNumber: '',
    bedNumber: '',
    floorNumber: '',
    age: '',
    gender: '',
    contactInfo: '',
    emergencyContact: '',
    notes: '',
  });

  const handleOpenModal = (patient) => {
    setSelectedPatient(patient);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedPatient(null);
    setOpenModal(false);
  };

  const handleAddPatient = () => {
    setOpenFormModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewPatient((prevPatient) => ({
      ...prevPatient,
      [name]: value,
    }));
  };

  const handleSubmitForm = () => {
    setPatients([...patients, { ...newPatient, id: patients.length + 1 }]);
    setOpenFormModal(false);
    setNewPatient({
      name: '',
      diseases: '',
      allergies: '',
      roomNumber: '',
      bedNumber: '',
      floorNumber: '',
      age: '',
      gender: '',
      contactInfo: '',
      emergencyContact: '',
      notes: '',
    });
  };

  const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'diseases', headerName: 'Diseases', width: 150 },
    { field: 'allergies', headerName: 'Allergies', width: 150 },
    { field: 'roomNumber', headerName: 'Room No.', width: 100 },
    { field: 'bedNumber', headerName: 'Bed No.', width: 100 },
    { field: 'floorNumber', headerName: 'Floor No.', width: 100 },
    { field: 'age', headerName: 'Age', width: 70 },
    { field: 'gender', headerName: 'Gender', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 250,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => alert('Diet Chart functionality')}
            aria-label="dietChart"
          >
            <img src={dietChart} alt="Diet Chart" style={{ width: 24, height: 24 }} />
          </IconButton>
          <IconButton
            onClick={() => alert('Assign functionality')}
            aria-label="assign"
          >
            <img src={assignIcon} alt="Assign Person" style={{ width: 24, height: 24 }} />
          </IconButton>
          <IconButton
            onClick={() => handleOpenModal(params.row)}
            aria-label="view"
          >
            <img src={viewIcon} alt="View Details" style={{ width: 24, height: 24 }} />
          </IconButton>
          <IconButton
            color="warning"
            onClick={() => alert('Edit functionality')}
            aria-label="edit"
          >
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => alert('Delete functionality')}
            aria-label="delete"
          >
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <Typography variant="h4" gutterBottom>
          Patients List
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddPatient}
        >
          Add Patient
        </Button>
      </Box>

      {/* Add Patient Form Modal */}
      <Modal open={openFormModal} onClose={() => setOpenFormModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { md: 400, xs: 300 },
            bgcolor: 'background.paper',
            border: '1px solid grey',
            borderRadius: "1rem",
            boxShadow: 24,
            p: 4,
            overflowY: 'auto',
            maxHeight: { md: '80vh', xs: '70vh' },
          }}
        >
          <Typography variant="h6" gutterBottom sx={{textAlign:"center", textDecoration:"underline", textUnderlineOffset: "4px"}}>Add New Patient</Typography>
          <form>
            <TextField
              label="Name"
              name="name"
              value={newPatient.name}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Diseases"
              name="diseases"
              value={newPatient.diseases}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Allergies"
              name="allergies"
              value={newPatient.allergies}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Room Number"
              name="roomNumber"
              value={newPatient.roomNumber}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Bed Number"
              name="bedNumber"
              value={newPatient.bedNumber}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Floor Number"
              name="floorNumber"
              value={newPatient.floorNumber}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Age"
              name="age"
              value={newPatient.age}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Gender"
              name="gender"
              value={newPatient.gender}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Contact Info"
              name="contactInfo"
              value={newPatient.contactInfo}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Emergency Contact"
              name="emergencyContact"
              value={newPatient.emergencyContact}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Notes"
              name="notes"
              value={newPatient.notes}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitForm}
              sx={{ marginTop: 2 }}
            >
              Submit
            </Button>
          </form>
        </Box>
      </Modal>

      {/* Patient Details Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { md: 400, xs: 300 },
            bgcolor: 'background.paper',
            border: '1px solid grey',
            borderRadius: "1rem",
            boxShadow: 24,
            p: 4,
          }}
        >
          {selectedPatient && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{textAlign:"center", textDecoration:"underline", textUnderlineOffset: "4px"}}>
                Patient Details
              </Typography>
              <Typography><strong>Name:</strong> {selectedPatient.name}</Typography>
              <Typography><strong>Diseases:</strong> {selectedPatient.diseases}</Typography>
              <Typography><strong>Allergies:</strong> {selectedPatient.allergies}</Typography>
              <Typography><strong>Room Number:</strong> {selectedPatient.roomNumber}</Typography>
              <Typography><strong>Bed Number:</strong> {selectedPatient.bedNumber}</Typography>
              <Typography><strong>Floor Number:</strong> {selectedPatient.floorNumber}</Typography>
              <Typography><strong>Age:</strong> {selectedPatient.age}</Typography>
              <Typography><strong>Gender:</strong> {selectedPatient.gender}</Typography>
              <Typography><strong>Contact Info:</strong> {selectedPatient.contactInfo}</Typography>
              <Typography><strong>Emergency Contact:</strong> {selectedPatient.emergencyContact}</Typography>
              <Typography><strong>Notes:</strong> {selectedPatient.notes}</Typography>
            </Box>
          )}
        </Box>
      </Modal>

      <Box sx={{ height: 450, width: '100%' }}>
        <DataGrid rows={patients} columns={columns} pageSize={5} />
      </Box>
    </Box>
  );
};

export default PatientDetails;
