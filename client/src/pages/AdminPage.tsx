import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Button, TableContainer, Paper } from '@mui/material';
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
    const newSocket = io(process.env.SERVER_URL);
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
    <div>
      <h1>Панель организатора торгов</h1>
      <Button
        variant="contained"
        color="primary"
        onClick={startAuction}
        disabled={auctionData?.isAuctionActive}
      >
        Начать торги
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={endAuction}
        style={{ marginLeft: '10px' }}
        disabled={!auctionData?.isAuctionActive}
      >
        Завершить торги
      </Button>

      <h2>
        Общее оставшееся время торгов:{' '}
        {auctionData ? formatTime(auctionData.totalTime) : '00:00'}
      </h2>

      {auctionData && (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
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
    </div>
  );
};

export default AdminPage;
