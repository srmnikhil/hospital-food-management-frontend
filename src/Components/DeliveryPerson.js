import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Modal, Box, Typography, TextField, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';

// Sample delivery personnel data
const sampleDeliveryPersonnel = [
  {
    id: 1,
    name: 'John Doe',
    contactInfo: '9876543210',
    otherDetails: 'Shift: Morning',
  },
  {
    id: 2,
    name: 'Jane Smith',
    contactInfo: '8765432190',
    otherDetails: 'Shift: Evening',
  },
];

const DeliveryPerson = () => {
  const [deliveryPersonnel, setDeliveryPersonnel] = useState(sampleDeliveryPersonnel);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [newPersonnel, setNewPersonnel] = useState({
    name: '',
    contactInfo: '',
    otherDetails: '',
  });

  // Open the add personnel modal
  const handleAddPersonnel = () => {
    setOpenFormModal(true);
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewPersonnel((prevPersonnel) => ({
      ...prevPersonnel,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmitForm = () => {
    setDeliveryPersonnel([
      ...deliveryPersonnel,
      { ...newPersonnel, id: deliveryPersonnel.length + 1 },
    ]);
    setOpenFormModal(false);
    setNewPersonnel({
      name: '',
      contactInfo: '',
      otherDetails: '',
    });
  };

  // Handle personnel deletion
  const handleDeletePersonnel = (id) => {
    setDeliveryPersonnel(deliveryPersonnel.filter((personnel) => personnel.id !== id));
  };

  const columns = [
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'contactInfo', headerName: 'Contact Info', width: 150 },
    { field: 'otherDetails', headerName: 'Other Details', width: 250 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => handleDeletePersonnel(params.row.id)}
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
          Delivery Personnel
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAddPersonnel}>
          Add Delivery Personnel
        </Button>
      </Box>

      {/* Add Personnel Form Modal */}
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
            borderRadius: '1rem',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', textDecoration: 'underline', textUnderlineOffset: '4px' }}>
            Add New Delivery Personnel
          </Typography>
          <form>
            <TextField
              label="Name"
              name="name"
              value={newPersonnel.name}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Contact Info"
              name="contactInfo"
              value={newPersonnel.contactInfo}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Other Details"
              name="otherDetails"
              value={newPersonnel.otherDetails}
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
        <DataGrid rows={deliveryPersonnel} columns={columns} pageSize={5} />
      </Box>
    </Box>
  );
};

export default DeliveryPerson;
