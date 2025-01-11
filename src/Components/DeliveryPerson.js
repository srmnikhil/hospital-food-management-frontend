import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Modal, Box, Typography, TextField } from '@mui/material';

const DeliveryPerson = () => {
  const [deliveryPersonnel, setDeliveryPersonnel] = useState([]);
  const [openFormModal, setOpenFormModal] = useState(false);
  const [newPersonnel, setNewPersonnel] = useState({
    name: '',
    contactInfo: '',
    otherDetails: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch delivery personnel from the backend
  const fetchDeliveryPersonnel = async () => {
    setLoading(true);
    try {
      const loginToken = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/pantry/getDeliveryPersonnel`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${loginToken}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setDeliveryPersonnel(
        data.deliveryPersons.map((person, index) => ({
          id: person._id, // Use MongoDB ID as unique identifier
          name: person.name,
          contactInfo: person.contactInfo,
          otherDetails: person.otherDetails,
          serial: index + 1, // Add serial number dynamically
        }))
      );
    } catch (err) {
      console.error("Error fetching delivery personnel:", err);
      setError("Failed to fetch delivery personnel.");
    } finally {
      setLoading(false);
    }
  };

  // Add new delivery personnel
  const addDeliveryPersonnel = async () => {
    try {
      const loginToken = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/pantry/addDeliveryPersonnel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${loginToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPersonnel),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const addedPersonnel = await response.json();
      setDeliveryPersonnel((prevPersonnel) => [
        ...prevPersonnel,
        { ...addedPersonnel, id: addedPersonnel._id, serial: prevPersonnel.length + 1 },
      ]);
      setOpenFormModal(false);
      setNewPersonnel({
        name: '',
        contactInfo: '',
        otherDetails: '',
      });
    } catch (err) {
      console.error("Error adding delivery personnel:", err);
      setError("Failed to add delivery personnel.");
    }
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
    addDeliveryPersonnel();
  };

  useEffect(() => {
    fetchDeliveryPersonnel();
  }, []);

  const columns = [
    { field: 'serial', headerName: 'S.No.', width: 100 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'contactInfo', headerName: 'Contact Info', width: 150 },
    { field: 'otherDetails', headerName: 'Other Details', width: 250 },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <Typography variant="h4" gutterBottom>
          Delivery Personnel
        </Typography>
        <Button variant="contained" color="primary" onClick={() => setOpenFormModal(true)}>
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
        <DataGrid rows={deliveryPersonnel} columns={columns} pageSize={5} loading={loading} />
      </Box>
      {error && <Typography color="error">{error}</Typography>}
    </Box>
  );
};

export default DeliveryPerson;
