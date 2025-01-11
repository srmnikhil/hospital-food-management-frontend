import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Modal, IconButton, Radio, RadioGroup, FormControlLabel, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import viewIcon from "../assets/viewIcon.svg";
import { Edit } from '@mui/icons-material';
import assignIcon from "../assets/assignIcon.png";
import deliveredIcon from "../assets/delivered.png";

const MealStatus = ({ role }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openAssignModal, setOpenAssignModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [deliveryPersonnel, setDeliveryPersonnel] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState('');

  // Fetch meal data from API
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const loginToken = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/manager/preparationStatus`, {
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
        console.log(data)
        // Transform data to match the grid structure
        const formattedData = data.map((meal, index) => ({
          serial: index + 1,
          id: meal._id,
          patientName: meal.patientId.name,
          bedNumber: meal.patientId.bedNumber,
          mealType: meal.mealType,
          assignedAt: new Date(meal.assignedAt).toLocaleString(),
          assignedTo: meal.assignedTo.name,
          preparationStatus: meal.preparationStatus,
          deliveryAssignedTo: meal.deliveryAssignedTo ? meal.deliveryAssignedTo.name : 'Not Assigned Yet',
          deliveryStatus: meal.deliveryStatus,
          deliveredAt: meal.deliveredAt ? new Date(meal.deliveredAt).toLocaleString() : 'Not Delivered Yet',
          dietChart: meal.dietChart,
        }));
        setMeals(formattedData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching meal data:", err);
        setError("Failed to fetch meal data.");
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  const handleOpenAssignModal = async (meal) => {
    try {
      const loginToken = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/pantry/getDeliveryPersonnel`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${loginToken}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success && data.deliveryPersons) {
        setDeliveryPersonnel(data.deliveryPersons);
      }
    } catch (error) {
      console.error('Error fetching pantry staff.', error);
    }
    setSelectedMeal(meal);
    setOpenAssignModal(true);
  };

  const handleCloseAssignModal = () => {
    setOpenAssignModal(false);
    setSelectedDeliveryPerson('');
  };

  const handleOpenModal = (meal) => {
    setSelectedMeal(meal);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedMeal(null);
    setOpenModal(false);
  };

  const handleAssignDelivery = async () => {
    try {
      const loginToken = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/pantry/assignDelivery/${selectedMeal.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${loginToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deliveryPersonId: selectedDeliveryPerson }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Failed to assign delivery person: ${errorData.error || 'Unknown error'}`);
        return;
      }

      const updatedMeal = await response.json();
      setMeals((prevMeals) =>
        prevMeals.map((meal) =>
          meal.id === updatedMeal._id
            ? { ...meal, deliveryStatus: 'Out for Delivery', deliveryAssignedTo: updatedMeal.deliveryAssignedTo }
            : meal
        )
      );

      handleCloseAssignModal();
      alert("Delivery person assigned successfully!");
    } catch (error) {
      console.error("Error assigning delivery personnel:", error);
      alert("An error occurred while assigning the delivery personnel.");
    }
  };

  const handleEditPreparationStatus = async (meal) => {
    setSelectedMeal(meal);
    setSelectedStatus(meal.preparationStatus); // Default to the current status
    setEditModalOpen(true);
  };

  const handleMarkAsDelivered = (mealId) => {
    handleUpdateDeliveryStatus(mealId, 'Delivered');
  };

  const handleUpdateDeliveryStatus = async (mealId, newStatus) => {
    try {
      const loginToken = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/delivery/updateDeliveryStatus/${mealId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${loginToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deliveryStatus: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Failed to update delivery status: ${errorData.error || 'Unknown error'}`);
        return;
      }

      const updatedMeal = await response.json();
      // Update the local state with the updated meal data
      setMeals((prevMeals) =>
        prevMeals.map((meal) =>
          meal.id === updatedMeal._id
            ? { ...meal, deliveryStatus: updatedMeal.deliveryStatus }
            : meal
        )
      );

      alert(`Delivery status updated to: ${newStatus}`);
    } catch (error) {
      console.error("Error updating delivery status:", error);
      alert("An error occurred while updating the delivery status.");
    }
  };


  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedMeal(null);
    setSelectedStatus('');
  };

  const handleSubmitEdit = async () => {
    try {
      const loginToken = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/pantry/task/${selectedMeal.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${loginToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preparationStatus: selectedStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Failed to update preparation status: ${errorData.error || 'Unknown error'}`);
        return;
      }
      const updatedMeal = await response.json();
      // Update the local state with the updated meal data
      setMeals((prevMeals) =>
        prevMeals.map((meal) =>
          meal.id === updatedMeal._id
            ? { ...meal, preparationStatus: updatedMeal.preparationStatus }
            : meal
        )
      );

      handleCloseEditModal();
      alert("Preparation status updated successfully!");
    } catch (error) {
      console.error("Error updating preparation status:", error);
      alert("An error occurred while updating the preparation status.");
    }
    setMeals((prevMeals) =>
      prevMeals.map((meal) =>
        meal.id === selectedMeal.id
          ? { ...meal, preparationStatus: selectedStatus }
          : meal
      )
    );
    handleCloseEditModal();
  };

  const columns = [
    {
      field: 'serial',
      headerName: 'S.No',
      width: 50,
    },
    { field: 'patientName', headerName: 'Patient Name', width: 120 },
    { field: 'bedNumber', headerName: 'Bed Number', width: 100 },
    { field: 'mealType', headerName: 'Meal Type', width: 100 },
    { field: 'assignedAt', headerName: 'Assigned At', width: 150 },
    { field: 'assignedTo', headerName: 'Assigned To', width: 100 },
    { field: 'preparationStatus', headerName: 'Preparation Status', width: 130 },
    { field: 'deliveryAssignedTo', headerName: 'Delivery Assigned To', width: 150 },
    { field: 'deliveryStatus', headerName: 'Delivery Status', width: 120 },
    { field: 'deliveredAt', headerName: 'Delivered At', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 80,
      renderCell: (params) => (
        <Box>
          {role === 'PantryStaff' && (
            <>
              <IconButton
                color="warning"
                onClick={() => handleEditPreparationStatus(params.row)}
                aria-label="edit"
              >
                <Edit />
              </IconButton>
              <IconButton
                onClick={() => handleOpenAssignModal(params.row)}
                aria-label="assign"
              >
                <img src={assignIcon} alt="Assign Person" style={{ width: 24, height: 24 }} />
              </IconButton>
            </>
          )}
          {role === 'DeliveryPersonnel' && params.row.deliveryStatus === 'Out for Delivery' && (
            <IconButton
              onClick={() => handleMarkAsDelivered(params.row.id)}
              aria-label="mark-delivered"
            >
              <img src={deliveredIcon} alt="Mark as Delivered" style={{ width: 24, height: 24 }} />
            </IconButton>
          )}
          <IconButton
            onClick={() => handleOpenModal(params.row)}
            aria-label="view-chart"
          >
            <img src={viewIcon} alt="View Chart" style={{ width: 24, height: 24 }} />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        {role === "DeliveryPersonnel" ? "Meal Delivery" : "Meal Status"}
      </Typography>

      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}

      {/* Diet Chart Modal */}
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
          {selectedMeal && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ textAlign: "center", textDecoration: "underline", textUnderlineOffset: "4px" }}>
                Diet Chart Details
              </Typography>
              <Typography><strong>Morning Meal:</strong> {selectedMeal.dietChart.morningMeal}</Typography>
              <Typography><strong>Evening Meal:</strong> {selectedMeal.dietChart.eveningMeal}</Typography>
              <Typography><strong>Night Meal:</strong> {selectedMeal.dietChart.nightMeal}</Typography>
              <Typography><strong>Ingredients:</strong> {selectedMeal.dietChart.ingredients}</Typography>
              <Typography><strong>Instructions:</strong> {selectedMeal.dietChart.instructions}</Typography>
            </Box>
          )}
        </Box>
      </Modal>

      {/* Edit Preparation Status Modal */}
      <Modal open={editModalOpen} onClose={handleCloseEditModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            bgcolor: 'background.paper',
            border: '1px solid grey',
            borderRadius: "1rem",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Edit Preparation Status
          </Typography>
          <RadioGroup
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <FormControlLabel value="In Progress" control={<Radio />} label="In Progress" />
            <FormControlLabel value="Prepared" control={<Radio />} label="Prepared" />
          </RadioGroup>
          <Button variant="contained" color="primary" onClick={handleSubmitEdit}>
            Submit
          </Button>
        </Box>
      </Modal>

      {/* Modal for assigning delivery person */}
      <Modal open={openAssignModal} onClose={handleCloseAssignModal}>
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
          <Typography variant="h6" gutterBottom>Assign Delivery Personnel</Typography>

          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Delivery Personnel</InputLabel>
            <Select
              value={selectedDeliveryPerson}
              onChange={(e) => setSelectedDeliveryPerson(e.target.value)}
              label="Delivery Personnel"
            >
              {deliveryPersonnel.map((person) => (
                <MenuItem key={person._id} value={person._id}>
                  {person.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            onClick={handleAssignDelivery}
            disabled={!selectedDeliveryPerson}
          >
            Assign
          </Button>
        </Box>
      </Modal>

      <Box sx={{ height: 450, width: '100%' }}>
        <DataGrid rows={meals} columns={columns} pageSize={5} />
      </Box>
    </Box>
  );
};

export default MealStatus;
