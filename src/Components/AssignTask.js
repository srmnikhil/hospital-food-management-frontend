import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Modal, Box, Typography, IconButton, Radio, RadioGroup, FormControlLabel, Button } from '@mui/material';
import assignIcon from "../assets/assignIcon.png";
import viewIcon from "../assets/viewIcon.svg";

const AssignTask = () => {
  const [diet, setDiet] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedDiet, setSelectedDiet] = useState(null);
  const [pantryStaff, setPantryStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [selectedMealType, setSelectedMealType] = useState(null);

  const handleOpenModal = (diet) => {
    setSelectedDiet(diet);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedDiet(null);
    setOpenModal(false);
  };

  const handleAssignOpen = (diet) => {
    setSelectedDiet(diet);
    setAssignModalOpen(true);
  };

  const handleAssignClose = () => {
    setSelectedDiet(null);
    setSelectedStaff(null);
    setSelectedMealType(null);
    setAssignModalOpen(false);
  };

  const handleAssignSubmit = async () => {
    if (!selectedStaff) {
      alert('Please select a staff member.');
      return;
    }

    if (!selectedMealType) {
      alert('Please select a meal type.');
      return;
    }

    const loginToken = localStorage.getItem('token');
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/manager/assignPreparationTask`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${loginToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dietChartId: selectedDiet._id,
          pantryStaffId: selectedStaff,
          mealType: selectedMealType,
          patientId: selectedDiet.patientId?._id,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Diet chart assigned successfully!');
        handleAssignClose();
      } else {
        alert('Failed to assign diet chart.');
      }
    } catch (error) {
      console.error('Error assigning diet chart:', error);
    }
  };

  useEffect(() => {
    const loginToken = localStorage.getItem('token');

    const fetchDietChart = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/manager/getDietChart`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${loginToken}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (data.success && data.dietChart) {
          const dietChartWithSerialAndName = data.dietChart.map((dietChart, index) => ({
            ...dietChart,
            serial: index + 1,
            name: dietChart.patientId?.name || 'Unknown',
          }));
          setDiet(dietChartWithSerialAndName);
        }
      } catch (error) {
        console.error('Error fetching diet chart.', error);
      }
    };

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
          setPantryStaff(data.pantryStaff);
        }
      } catch (error) {
        console.error('Error fetching pantry staff.', error);
      }
    };

    fetchDietChart();
    fetchPantryStaff();
  }, []);

  const columns = [
    {
      field: 'serial',
      headerName: 'S.No',
      width: 100,
    },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'morningMeal', headerName: 'Morning Meal', width: 150 },
    { field: 'eveningMeal', headerName: 'Evening Meal', width: 150 },
    { field: 'nightMeal', headerName: 'Night Meal', width: 150 },
    { field: 'ingredients', headerName: 'Ingredients', width: 200 },
    { field: 'instructions', headerName: 'Instructions', width: 250 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleAssignOpen(params.row)} aria-label="assign">
            <img src={assignIcon} alt="Assign Person" style={{ width: 24, height: 24 }} />
          </IconButton>
          <IconButton onClick={() => handleOpenModal(params.row)} aria-label="view">
            <img src={viewIcon} alt="View Details" style={{ width: 24, height: 24 }} />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Assign Meal Tasks
      </Typography>

      <Modal open={assignModalOpen} onClose={handleAssignClose}>
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
          <Typography variant="h6" gutterBottom sx={{ textAlign:"center" }}>
            Select Meal Time
          </Typography>
          <RadioGroup
            row
            value={selectedMealType}
            onChange={(e) => setSelectedMealType(e.target.value)}
          >
            {['Morning', 'Evening', 'Night'].map((mealType) => (
              <FormControlLabel
                key={mealType}
                value={mealType}
                control={<Radio />}
                label={mealType}
              />
            ))}
          </RadioGroup>
          <Typography variant="h6" gutterBottom sx={{mt: 2, textAlign:"center"}}>
            Select Pantry Staff
          </Typography>
          <RadioGroup
            value={selectedStaff}
            onChange={(e) => setSelectedStaff(e.target.value)}
          >
            {pantryStaff.map((staff) => (
              <FormControlLabel
                key={staff._id}
                value={staff._id}
                control={<Radio />}
                label={staff.name}
              />
            ))}
          </RadioGroup>
          <Box sx={{ textAlign: 'center', marginTop: 2 }}>
            <Button variant="contained" onClick={handleAssignSubmit}>
              Assign
            </Button>
          </Box>
        </Box>
      </Modal>

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
          {selectedDiet && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Diet Chart Details
              </Typography>
              <Typography><strong>Name:</strong> {selectedDiet.patientId?.name}</Typography>
              <Typography><strong>Morning Meal:</strong> {selectedDiet.morningMeal}</Typography>
              <Typography><strong>Evening Meal:</strong> {selectedDiet.eveningMeal}</Typography>
              <Typography><strong>Night Meal:</strong> {selectedDiet.nightMeal}</Typography>
              <Typography><strong>Ingredients:</strong> {selectedDiet.ingredients}</Typography>
              <Typography><strong>Instructions:</strong> {selectedDiet.instructions}</Typography>
            </Box>
          )}
        </Box>
      </Modal>

      <Box sx={{ height: 450, width: '100%' }}>
        <DataGrid rows={diet} columns={columns} pageSize={5} getRowId={(row) => row._id} />
      </Box>
    </Box>
  );
};

export default AssignTask;
