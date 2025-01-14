import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Modal, Box, Typography, TextField, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import viewIcon from "../assets/viewIcon.svg"
import dietChartIcon from "../assets/dietChart.svg"

const PatientDetails = () => {
  const token = localStorage.getItem('token');
  const [patients, setPatients] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openDietModal, setOpenDietModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [errors, setErrors] = useState({});
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
    remarks: '',
  });
  const [dietChart, setDietChart] = useState({
    morningMeal: '',
    eveningMeal: '',
    nightMeal: '',
    ingredients: '',
    instructions: '',
  });

  // Fetch patients from API whenever the patients list changes
  useEffect(() => {
    const loginToken = localStorage.getItem('token');
    const fetchPatients = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/manager/getAllPatients`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${loginToken}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (data.success && data.patients) {
          const patientsWithSerial = data.patients.map((patient, index) => ({
            ...patient,
            serial: index + 1, // Add serial number dynamically
          }));
          setPatients(patientsWithSerial);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  const handleOpenModal = (patient) => {
    setSelectedPatient(patient);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedPatient(null);
    setOpenModal(false);
  };

  const handleAddPatient = () => {
    setIsEditing(false);
    setOpenFormModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewPatient((prevPatient) => ({
      ...prevPatient,
      [name]: value,
    }));
  };

  const handleOpenFormModal = (patient) => {
    setSelectedPatient(patient);
    setNewPatient({
      name: patient.name || '',
      diseases: patient.diseases || '',
      allergies: patient.allergies || '',
      roomNumber: patient.roomNumber || '',
      bedNumber: patient.bedNumber || '',
      floorNumber: patient.floorNumber || '',
      age: patient.age || '',
      gender: patient.gender || '',
      contactInfo: patient.contactInfo || '',
      emergencyContact: patient.emergencyContact || '',
      remarks: patient.remarks || '',
    });
    setIsEditing(true);
    setOpenFormModal(true);
  };

  const handleOpenDietModal = (patient) => {
    setSelectedPatient(patient);
    if (patient.dietChart) {
      setDietChart(patient.dietChart); // Pre-fill form with existing diet chart data if available
    } else {
      setDietChart({
        morningMeal: '',
        eveningMeal: '',
        nightMeal: '',
        ingredients: '',
        instructions: '',
      });
    }
    setOpenDietModal(true);
  };

  const handleCloseDietModal = () => {
    setSelectedPatient(null);
    setOpenDietModal(false);
  };

  const handleDietFormChange = (e) => {
    const { name, value } = e.target;
    setDietChart((prevDietChart) => ({
      ...prevDietChart,
      [name]: value,
    }));
  };

  const handleSubmitDietForm = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/manager/setDiet/${selectedPatient._id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dietChart),
      });
      const data = await response.json();
      if (data.success) {
        // Update the patient's diet chart in local state
        setPatients((prevPatients) =>
          prevPatients.map((patient) =>
            patient._id === selectedPatient._id ? { ...patient, dietChart: data.dietChart } : patient
          )
        );
        alert("Diet Chart Added Succesfully.")
        setOpenDietModal(false);
      } else {
        alert('Failed to update diet chart');
      }
    } catch (error) {
      console.error('Error submitting diet chart:', error);
      alert('Error submitting diet chart');
    }
  };

  const handleDeletePatient = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/manager/deletePatient/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log(id, response)
      if (!response.ok) {
        throw new Error('Failed to delete the patient');
      }
      // Remove the patient from the local state after successful deletion
      setPatients(patients.filter(patient => patient._id !== id));
      alert('Patient deleted successfully');
    } catch (error) {
      console.error('Error deleting patient:', error);
      alert('Failed to delete patient');
    }
  };

  const fieldLabels = {
    name: "Name",
    age: "Age",
    gender: "Gender",
    contactInfo: "Contact Info",
    roomNumber: "Room Number",
    bedNumber: "Bed Number",
    floorNumber: "Floor Number",
  };

  const validateForm = () => {
    const newErrors = {};
  
    const requiredFields = ['name', 'roomNumber', 'bedNumber', 'floorNumber', 'age', 'gender', 'contactInfo'];
  
    Object.keys(newPatient).forEach((key) => {
      // Check if the field is required
      if (requiredFields.includes(key)) {
        const value = newPatient[key];
  
        // Handle string fields with .trim()
        if (typeof value === 'string' && !value.trim()) {
          newErrors[key] = `${fieldLabels[key]} is required`;
          alert(`${fieldLabels[key]} field can't be empty`);
        }
        // Handle non-string fields (like numbers) that are empty
        else if ((typeof value === 'number' || value === undefined || value === null) && !value) {
          newErrors[key] = `${fieldLabels[key]} is required`;
          alert(`${fieldLabels[key]} field can't be empty`);
        }
      }
    });
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };
  


  const handleSubmitForm = async () => {
    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    try {
      const url = isEditing
        ? `${process.env.REACT_APP_BACKEND_URL}/api/manager/updatePatient/${selectedPatient._id}`
        : `${process.env.REACT_APP_BACKEND_URL}/api/manager/addPatient`;
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPatient),
      });
      if (!response.ok) {
        const errorData = await response.json();
        alert(`Failed to ${isEditing ? "update" : "add"} patient: ${errorData.error || 'Unknown error'}`);
        return;
      }
      const data = await response.json();
      if (data.success) {
        if (isEditing) {
          // Update the patient in local state
          setPatients((prevPatients) =>
            prevPatients.map((patient) =>
              patient._id === selectedPatient._id ? { ...patient, ...newPatient } : patient
            )
          );
          alert("Patient details updated successfully.");
          setOpenFormModal(false); // Close the modal
        } else {
          // Add the new patient to local state
          setPatients((prevPatients) => {
            const updatedPatients = [
              ...prevPatients,
              { ...data.patient, serial: prevPatients.length + 1 }
            ]
            return updatedPatients;
          });
          alert("Patient added successfully.")
          setOpenFormModal(false); // Close the modal
        }
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
          remarks: '',
        });
      } else {
        alert(isEditing ? 'Failed to update patient' : 'Failed to add patient');
      }
    } catch (error) {
      console.error("Error adding patient:", error);
    }
  };

  const columns = [
    {
      field: 'serial',
      headerName: 'S.No',
      width: 100,
    },
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
      width: 200,
      renderCell: (params) => (
        <>
          <IconButton
            onClick={() => handleOpenDietModal(params.row)}
            aria-label="dietChart"
          >
            <img src={dietChartIcon} alt="Diet Chart" style={{ width: 24, height: 24 }} />
          </IconButton>
          <IconButton
            onClick={() => handleOpenModal(params.row)}
            aria-label="view"
          >
            <img src={viewIcon} alt="View Details" style={{ width: 24, height: 24 }} />
          </IconButton>
          <IconButton
            color="warning"
            onClick={() => handleOpenFormModal(params.row)}
            aria-label="edit"
          >
            <Edit />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDeletePatient(params.row._id)}
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
          <Typography variant="h6" gutterBottom sx={{ textAlign: "center", textDecoration: "underline", textUnderlineOffset: "4px" }}>Add New Patient</Typography>
          <form>
            <TextField
              label="Name"
              name="name"
              value={newPatient.name}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              error={!!errors.name}
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
              error={!!errors.roomNumber}
            />
            <TextField
              label="Bed Number"
              name="bedNumber"
              value={newPatient.bedNumber}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              error={!!errors.bedNumber}
              disabled={isEditing}
            />
            <TextField
              label="Floor Number"
              name="floorNumber"
              value={newPatient.floorNumber}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              error={!!errors.floorNumber}
            />
            <TextField
              label="Age"
              name="age"
              value={newPatient.age}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              error={!!errors.age}
            />
            <TextField
              label="Gender"
              name="gender"
              value={newPatient.gender}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              error={!!errors.gender}
            />
            <TextField
              label="Contact Info"
              name="contactInfo"
              value={newPatient.contactInfo}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              error={!!errors.contactInfo}
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
              label="Remarks"
              name="remarks"
              value={newPatient.remarks}
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
              {isEditing ? "Save Changes" : "Submit"}
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
              <Typography variant="h6" gutterBottom sx={{ textAlign: "center", textDecoration: "underline", textUnderlineOffset: "4px" }}>
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
              <Typography><strong>Ramarks:</strong> {selectedPatient.remarks}</Typography>
            </Box>
          )}
        </Box>
      </Modal>

      <Modal open={openDietModal} onClose={handleCloseDietModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { md: 400, xs: 300 },
            bgcolor: 'background.paper',
            border: '1px solid grey',
            borderRadius: '1rem',
            boxShadow: 24,
            p: 4,
            overflowY: 'auto',
            maxHeight: { md: '80vh', xs: '70vh' },
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', textDecoration: 'underline', textUnderlineOffset: '4px' }}>
            Diet Chart for {selectedPatient ? selectedPatient.name : 'Patient'}
          </Typography>
          <form>
            <TextField
              label="Morning Meal"
              name="morningMeal"
              value={dietChart.morningMeal}
              onChange={handleDietFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Evening Meal"
              name="eveningMeal"
              value={dietChart.eveningMeal}
              onChange={handleDietFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Night Meal"
              name="nightMeal"
              value={dietChart.nightMeal}
              onChange={handleDietFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Ingredients"
              name="ingredients"
              value={dietChart.ingredients}
              onChange={handleDietFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Instructions"
              name="instructions"
              value={dietChart.instructions}
              onChange={handleDietFormChange}
              fullWidth
              margin="normal"
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitDietForm}
              sx={{ marginTop: 2 }}
            >
              Submit
            </Button>
          </form>
        </Box>
      </Modal>

      <Box sx={{ height: 450, width: '100%' }}>
        <DataGrid rows={patients} columns={columns} pageSize={5} getRowId={(row) => row.patient?._id || row._id} />
      </Box>
    </Box>
  );
};

export default PatientDetails;
