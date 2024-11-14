import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminPage from './pages/AdminPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h1>Добро пожаловать на торговую платформу</h1>
              <p>Для участия в торгах перейдите по своей уникальной ссылке.</p>
            </div>
          }
        />
        <Route path="/admin" element={<AdminPage />} />;
        <Route path="*" element={<h2>Страница не найдена</h2>} />
      </Routes>
    </Router>
  );
};

export default App;
