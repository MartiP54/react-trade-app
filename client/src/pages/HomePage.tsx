import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Box, Typography } from '@mui/material';
import { Dashboard, GitHub } from '@mui/icons-material';

const HomePage: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
        minHeight: '90vh',
        padding: 4,
        backgroundColor: '#f9f9f9',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Добро пожаловать на торговую платформу
      </Typography>
      <Button
        variant="contained"
        component={Link}
        to="/admin"
        startIcon={<Dashboard />}
        sx={{
          width: '300px',
          padding: '12px 20px',
          fontSize: '18px',
          textTransform: 'uppercase',
          borderRadius: '12px',
          background: 'linear-gradient(90deg, #ff8a00 0%, #da1b60 100%)',
          color: 'white',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.4)',
          },
        }}
      >
        Панель организатора
      </Button>
      <Typography variant="h6" sx={{ marginTop: 2 }}>
        Выберите участника для участия в торгах:
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {[1, 2, 3, 4].map((userId) => (
          <Button
            key={userId}
            variant="outlined"
            color="secondary"
            component={Link}
            to={`/auction/${userId}`}
            sx={{
              width: '150px',
              padding: '10px 0',
              fontSize: '14px',
            }}
          >
            Участник {userId}
          </Button>
        ))}
      </Box>
      <Button
        variant="outlined"
        startIcon={<GitHub />}
        component="a"
        href="https://github.com/MartiP54"
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          marginTop: 'auto',
          borderRadius: '8px',
          fontSize: '16px',
          padding: '10px 20px',
          color: '#333',
          borderColor: '#333',
          '&:hover': {
            backgroundColor: '#333',
            color: 'white',
            borderColor: '#333',
          },
        }}
      >
        Автор проекта: MartiP54
      </Button>
    </Box>
  );
};

export default HomePage;
