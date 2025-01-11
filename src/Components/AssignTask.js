import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import assignIcon from "../assets/assignIcon.png"
import viewIcon from "../assets/viewIcon.svg"

const AssignTask = () => {
  const [diet, setDiet] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDiet, setSelectedDiet] = useState(null);

  const handleOpenModal = (diet) => {
    setSelectedDiet(diet);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedDiet(null);
    setOpenModal(false);
  };
  // Initialize with two sample entries
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
            serial: index + 1, // Add serial number dynamically
            name: dietChart.patientId?.name || 'Unknown',
          }));
          setDiet(dietChartWithSerialAndName);
        }
      } catch (error) {
        console.error("Error fetching Data Chart.", error);
      }
    };

    fetchDietChart();
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
        </>
      ),
    },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Assign Meal Tasks
      </Typography>

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
              <Typography variant="h6" gutterBottom sx={{ textAlign: "center", textDecoration: "underline", textUnderlineOffset: "4px" }}>
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
