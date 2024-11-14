import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { Button } from '@mui/material';
import { AuctionData } from '../types/shared';
import formatTime from '../utils/timeUtils';

const AdminPage: React.FC = () => {
  const [auctionData, setAuctionData] = useState<AuctionData | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('auctionData', (data: AuctionData) => {
      setAuctionData(data);
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
    </div>
  );
};

export default AdminPage;
