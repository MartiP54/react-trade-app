import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { Button, Box, Typography } from '@mui/material';
import AuctionTable from '../components/AuctionTable';
import formatTime from '../utils/timeUtils';
import { AuctionData } from '../types/shared';
import NotificationPopup from '../components/NotificationPopup';

const ParticipantPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [auctionData, setAuctionData] = useState<AuctionData | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [editedData, setEditedData] = useState<
    Record<number, Record<string, number>>
  >({});
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
      setPopupMessage('Ваша ставка принята');
      setIsPopupOpen(true);
    }
  };

  const closePopup = () => setIsPopupOpen(false);

  return (
    <Box
      sx={{
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxWidth: '100%',
        overflowX: 'hidden',
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontSize: { xs: '20px', sm: '24px' },
          textAlign: 'center',
          marginBottom: 2,
          wordWrap: 'break-word',
        }}
      >
        Торги для участника #{userId}
      </Typography>
      <Typography
        variant="h6"
        sx={{
          fontSize: { xs: '16px', sm: '18px' },
          textAlign: 'center',
          marginBottom: 3,
          wordWrap: 'break-word',
        }}
      >
        Общее оставшееся время торгов: {formatTime(auctionData?.totalTime || 0)}
      </Typography>

      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {auctionData && (
          <Box
            sx={{
              width: '100%',
              overflowX: 'auto',
            }}
          >
            <AuctionTable
              participants={auctionData.participants}
              currentTurn={auctionData.currentTurn}
              remainingTime={auctionData.remainingTime}
              totalTime={auctionData.totalTime}
              mode="participant"
              editedData={editedData}
              onInputChange={handleInputChange}
              userId={Number(userId)}
              isAuctionActive={auctionData.isAuctionActive}
            />
          </Box>
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
            padding: { xs: '8px 16px', sm: '10px 20px' },
            fontWeight: 'bold',
            fontSize: { xs: '14px', sm: '16px' },
            width: { xs: '100%', sm: 'auto' },
            maxWidth: '400px',
            alignSelf: { xs: 'center', sm: 'flex-start' },
          }}
        >
          Сделать ставку и передать ход
        </Button>
      </Box>
      <NotificationPopup
        message={popupMessage}
        isOpen={isPopupOpen}
        onClose={closePopup}
      />
    </Box>
  );
};

export default ParticipantPage;
