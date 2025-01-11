import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Typography, Modal, IconButton, Radio, RadioGroup, FormControlLabel, Button } from '@mui/material';
import viewIcon from "../assets/viewIcon.svg";
import { Edit } from '@mui/icons-material';
import assignIcon from "../assets/assignIcon.png";
import deliveredIcon from "../assets/delivered.png";

const MealStatus = ({ role }) => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');

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
        // Transform data to match the grid structure
        const formattedData = data.map((meal, index) => ({
          serial: index + 1,
          id: meal._id,
          patientName: meal.patientId.name,
          mealType: meal.mealType,
          assignedAt: new Date(meal.assignedAt).toLocaleString(),
          assignedTo: meal.assignedTo.name,
          preparationStatus: meal.preparationStatus,
          deliveryStatus: meal.deliveryStatus,
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

  const handleOpenModal = (meal) => {
    setSelectedMeal(meal);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedMeal(null);
    setOpenModal(false);
  };

  const handleEditPreparationStatus = (meal) => {
    setSelectedMeal(meal);
    setSelectedStatus(meal.preparationStatus); // Default to the current status
    setEditModalOpen(true);
  };

  const handleMarkAsDelivered = (mealId) => {
    setMeals((prevMeals) =>
      prevMeals.map((meal) =>
        meal.id === mealId ? { ...meal, deliveryStatus: 'Delivered' } : meal
      )
    );
    alert("Delivered Successfully...");
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedMeal(null);
    setSelectedStatus('');
  };

  const handleSubmitEdit = () => {
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
      width: 100,
    },
    { field: 'patientName', headerName: 'Patient Name', width: 200 },
    { field: 'mealType', headerName: 'Meal Type', width: 150 },
    { field: 'assignedAt', headerName: 'Assigned At', width: 200 },
    { field: 'assignedTo', headerName: 'Assigned To', width: 150 },
    { field: 'preparationStatus', headerName: 'Preparation Status', width: 200 },
    { field: 'deliveryStatus', headerName: 'Delivery Status', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
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
                onClick={() => alert('Assign functionality')}
                aria-label="assign"
              >
                <img src={assignIcon} alt="Assign Person" style={{ width: 24, height: 24 }} />
              </IconButton>
            </>
          )}
          {role === 'DeliveryPersonnel' && (
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
        Meal Status
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

      <Box sx={{ height: 450, width: '100%' }}>
        <DataGrid rows={meals} columns={columns} pageSize={5} />
      </Box>
    </Box>
  );
};

export default MealStatus;
