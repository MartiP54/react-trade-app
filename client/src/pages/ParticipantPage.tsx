import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { Button } from '@mui/material';
import AuctionTable from '../components/AuctionTable';
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

  const handleInputChange = (
    participantId: number,
    field: string,
    value: number,
  ) => {
    setEditedData((prev) => ({
      ...prev,
      [participantId]: {
        ...prev[participantId],
        [field]: value,
      },
    }));
  };

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
        {auctionData && (
          <AuctionTable
            participants={auctionData.participants}
            currentTurn={auctionData.currentTurn}
            remainingTime={auctionData.remainingTime}
            totalTime={auctionData.totalTime}
            mode="participant"
            editedData={editedData}
            onInputChange={handleInputChange}
            userId={Number(userId)}
          />
        )}
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
