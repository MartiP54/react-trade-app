import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Button, TableContainer, Paper, Box, Typography } from '@mui/material';
import AuctionTable from '../components/AuctionTable';
import formatTime from '../utils/timeUtils';
import { AuctionData } from '../types/shared';
import NotificationPopup from '../components/NotificationPopup';

const AdminPage: React.FC = () => {
  const [auctionData, setAuctionData] = useState<AuctionData | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  useEffect(() => {
    const newSocket = io(process.env.SERVER_URL!);
    setSocket(newSocket);

    newSocket.on('auctionData', (data: AuctionData) => {
      setAuctionData(data);
    });

    newSocket.on('auctionEnd', (message: string) => {
      setPopupMessage(message);
      setIsPopupOpen(true);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const startAuction = () => {
    socket?.emit('startAuction');
  };

  const endAuction = () => {
    socket?.emit('endAuction');
  };

  const closePopup = () => setIsPopupOpen(false);

  return (
    <Box
      sx={{
        padding: 2,
        maxWidth: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="h4" sx={{ textAlign: 'center', fontSize: '1.5rem' }}>
        Панель организатора торгов
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={startAuction}
          disabled={auctionData?.isAuctionActive}
          sx={{ width: '100%', maxWidth: 200 }}
        >
          Начать торги
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={endAuction}
          disabled={!auctionData?.isAuctionActive}
          sx={{ width: '100%', maxWidth: 200 }}
        >
          Завершить торги
        </Button>
      </Box>

      <Typography variant="h6" sx={{ fontSize: '1.2rem', textAlign: 'center' }}>
        Общее оставшееся время торгов:{' '}
        {auctionData ? formatTime(auctionData.totalTime) : '00:00'}
      </Typography>

      {auctionData && (
        <TableContainer
          component={Paper}
          sx={{
            width: '100%',
            overflowX: 'auto',
            marginTop: 2,
          }}
        >
          <AuctionTable
            participants={auctionData.participants}
            currentTurn={auctionData.currentTurn}
            remainingTime={auctionData.remainingTime}
            totalTime={auctionData.totalTime}
            mode="admin"
            isAuctionActive={auctionData.isAuctionActive}
          />
        </TableContainer>
      )}

      <NotificationPopup
        message={popupMessage}
        isOpen={isPopupOpen}
        onClose={closePopup}
      />
    </Box>
  );
};

export default AdminPage;
