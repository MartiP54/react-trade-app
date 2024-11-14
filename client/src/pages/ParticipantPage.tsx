import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { Button } from '@mui/material';
import formatTime from '../utils/timeUtils';
import { AuctionData } from '../types/shared';

const ParticipantPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [auctionData, setAuctionData] = useState<AuctionData | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [editedData, setEditedData] = useState<
    Record<number, Record<string, number>>
  >({});

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

  const handlePassTurn = () => {
    if (socket && auctionData?.currentTurn === Number(userId)) {
      const updatedData = editedData[Number(userId)];
      socket.emit('placeBid', { userId: Number(userId), ...updatedData });
      setEditedData({});
    }
  };
  return (
    <div>
      <h1>Торги для участника #{userId}</h1>
      <h2>
        Общее оставшееся время торгов: {formatTime(auctionData?.totalTime || 0)}
      </h2>

      <div>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePassTurn}
          disabled={
            auctionData?.currentTurn !== Number(userId) ||
            !auctionData?.isAuctionActive
          }
          sx={{
            marginTop: 2,
            padding: '10px 20px',
            fontWeight: 'bold',
            fontSize: '16px',
          }}
        >
          сделать ставку и передать ход
        </Button>
      </div>
    </div>
  );
};

export default ParticipantPage;
