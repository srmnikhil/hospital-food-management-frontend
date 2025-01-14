import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Modal, Box, Typography, TextField } from '@mui/material';

const PantryStaff = () => {
  const token = localStorage.getItem('token');
  const [pantryStaff, setPantryStaff] = useState([]);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    contactInfo: '',
    location: '',
  });

  useEffect(() => {
    const loginToken = localStorage.getItem('token');
    const fetchPantryStaff = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/manager/getPantryStaff`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${loginToken}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (data.success && data.pantryStaff) {
          const pantryStaffWithSerial = data.pantryStaff.map((pantryStaff, index) => ({
            ...pantryStaff,
            serial: index + 1, // Add serial number dynamically
          }));
          setPantryStaff(pantryStaffWithSerial);
        }
      } catch (error) {
        console.error("Error fetching Pantry Staff:", error);
      }
    };

    fetchPantryStaff();
  }, []);

  const handleAddStaff = () => {
    setOpenFormModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewStaff((prevStaff) => ({
      ...prevStaff,
      [name]: value,
    }));
  };

  const handleSubmitForm = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/manager/addPantryStaff`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStaff),
      });
      const data = await response.json();
      if (data.success) {
        setPantryStaff((prevPantryStaff) => {
          const updatedPantryStaff = [
            ...prevPantryStaff,
            { ...data.pantryStaff, serial: prevPantryStaff.length + 1 }
          ];
          return updatedPantryStaff;
        });
        setOpenFormModal(false);
        setNewStaff({
          name: '',
          contactInfo: '',
          location: '',
        });
      } else {
        alert('Failed to add staff');
      }
    } catch (error) {
      console.error("Error adding staff:", error);
    }

  };

  const columns = [
    {
      field: 'serial',
      headerName: 'S.No',
      width: 100,
    },
    { field: 'name', headerName: 'Name', width: 250 },
    { field: 'contactInfo', headerName: 'Contact Info', width: 200 },
    { field: 'location', headerName: 'Location', width: 250 },
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
          <Typography variant="h6" gutterBottom sx={{ textAlign: "center", textDecoration: "underline", textUnderlineOffset: "4px" }}>Add New Pantry Staff</Typography>
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
        <DataGrid rows={pantryStaff} columns={columns} pageSize={5} getRowId={(row) => row.pantryStaff?._id ||row._id} />
      </Box>
    </Box>
  );
};

export default PantryStaff;
