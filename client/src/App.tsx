import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Typography } from '@mui/material';
import AdminPage from './pages/AdminPage';
import ParticipantPage from './pages/ParticipantPage';
import HomePage from './pages/HomePage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/auction/:userId" element={<ParticipantPage />} />
        <Route
          path="*"
          element={<Typography variant="h5">Страница не найдена</Typography>}
        />
      </Routes>
    </Router>
  );
};

export default App;
