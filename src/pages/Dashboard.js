import React, { useEffect, useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import PatientDetails from '../Components/PatientDetails';
import PantryStaff from '../Components/PantryStaff';
import MealStatus from '../Components/MealStatus';
import ResponsiveAppBar from '../Components/ResponsiveAppBar';
import DeliveryPerson from '../Components/DeliveryPerson';

const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role"); // Assuming the role is stored here
    setRole(userRole);

    if (!token) {
      navigate("/", { replace: true }); // Redirect to "/" if no token
    } else {
    }
  }, [navigate]);

  if (!role) return null; // Return nothing or a loading state if role is not yet set

  return (
    <div>
      <ResponsiveAppBar />
      <div style={{ marginTop: '20px' }}>
        {role === 'Manager' && (
          <Routes>
            <Route path="/patient" element={<PatientDetails />} />
            <Route path="/pantry-staff" element={<PantryStaff />} />
            <Route path="/meal-status" element={<MealStatus />} />
            <Route
              path="/"
              element={
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                  <h1>Welcome to the Food Manager Dashboard</h1>
                </div>
              }
            />
          </Routes>
        )}

        {role === 'PantryStaff' && (
          <Routes>
            <Route path="/delivery-person" element={<DeliveryPerson />} />
            <Route path="/meal-status" element={<MealStatus role={"PantryStaff"}/>} />
            <Route
              path="/"
              element={
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                  <h1>Welcome to the Pantry Staff Dashboard</h1>
                </div>
              }
            />
          </Routes>
        )}

        {role === 'DeliveryPersonnel' && (
          <Routes>
            <Route path="/meal-status" element={<MealStatus role={"DeliveryPersonnel"}/>} />
            <Route
              path="/"
              element={
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                  <h1>Welcome to the Delivery Personnel Dashboard</h1>
                </div>
              }
            />
          </Routes>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
