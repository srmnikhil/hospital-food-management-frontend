import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Modal, Box, Typography, TextField, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';

// Sample pantry staff data
const samplePantryStaff = [
  {
    id: 1,
    name: 'Alice Johnson',
    contactInfo: '9876543210',
    location: 'Kitchen A',
  },
  {
    id: 2,
    name: 'Bob Smith',
    contactInfo: '8765432190',
    location: 'Kitchen B',
  },
];

const PantryStaff = () => {
  const [pantryStaff, setPantryStaff] = useState(samplePantryStaff);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    contactInfo: '',
    location: '',
  });

  // Open the add staff modal
  const handleAddStaff = () => {
    setOpenFormModal(true);
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewStaff((prevStaff) => ({
      ...prevStaff,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmitForm = () => {
    setPantryStaff([...pantryStaff, { ...newStaff, id: pantryStaff.length + 1 }]);
    setOpenFormModal(false);
    setNewStaff({
      name: '',
      contactInfo: '',
      location: '',
    });
  };

  // Handle staff deletion
  const handleDeleteStaff = (id) => {
    setPantryStaff(pantryStaff.filter((staff) => staff.id !== id));
  };

  const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'contactInfo', headerName: 'Contact Info', width: 150 },
    { field: 'location', headerName: 'Location', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => handleDeleteStaff(params.row.id)}
          aria-label="delete"
        >
          <Delete />
        </IconButton>
      ),
    },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <Typography variant="h4" gutterBottom>
          Pantry Staff
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAddStaff}>
          Add Staff
        </Button>
      </Box>

      {/* Add Staff Form Modal */}
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
          }}
        >
          <Typography variant="h6" gutterBottom sx={{textAlign:"center", textDecoration:"underline", textUnderlineOffset: "4px"}}>Add New Pantry Staff</Typography>
          <form>
            <TextField
              label="Name"
              name="name"
              value={newStaff.name}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Contact Info"
              name="contactInfo"
              value={newStaff.contactInfo}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Location"
              name="location"
              value={newStaff.location}
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

      <Box sx={{ height: 450, width: '100%' }}>
        <DataGrid rows={pantryStaff} columns={columns} pageSize={5} />
      </Box>
    </Box>
  );
};

export default PantryStaff;
