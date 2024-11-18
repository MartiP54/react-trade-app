import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  useMediaQuery,
} from '@mui/material';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import renderCellContent from './renderCellContent';
import { AuctionData, Participant } from '../types/shared';

const AuctionTable: React.FC<AuctionData> = ({
  participants,
  currentTurn,
  remainingTime,
  onInputChange,
  userId,
  isAuctionActive,
  editedData,
}) => {
  const [inputValues, setInputValues] = useState<
    Record<number, Record<string, string>>
  >({});
  const isMobile = useMediaQuery('(max-width: 600px)');

  useEffect(() => {
    setInputValues((prevValues) => {
      const newValues = { ...prevValues };
      participants.forEach((participant) => {
        if (!newValues[participant.id]) {
          newValues[participant.id] = {
            manufacturingDays: String(participant.manufacturingDays),
            warrantyMonths: String(participant.warrantyMonths),
            paymentConditions: `${participant.paymentConditions ?? ''}%`,
          };
        }
      });
      return newValues;
    });
  }, [participants]);

  return (
    <TableContainer
      component={Paper}
      sx={{
        maxWidth: isMobile ? '100%' : '95%',
        marginTop: 2,
        padding: isMobile ? 1 : 2,
        overflowX: 'auto',
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        color="error"
        sx={{
          fontSize: isMobile ? '1rem' : '1.25rem',
          textAlign: isMobile ? 'center' : 'left',
        }}
      >
        Ход торгов Тестовые торги на тестовое задание
      </Typography>
      <Typography
        variant="body2"
        gutterBottom
        color="textSecondary"
        sx={{
          fontSize: isMobile ? '0.75rem' : '0.875rem',
          textAlign: 'center',
        }}
      >
        Уважаемые участники, во время вашего хода вы можете изменить параметры
        торгов, указанных в таблице:
      </Typography>
      <Table
        sx={{
          tableLayout: 'auto',
          width: '100%',
          fontSize: isMobile ? '0.75rem' : '1rem',
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                borderBottom: 'none',
                fontSize: isMobile ? '0.75rem' : '1rem',
              }}
            >
              Ход
            </TableCell>
            {participants.map((participant) => (
              <TableCell
                key={participant.id}
                sx={{
                  textAlign: 'center',
                  backgroundColor:
                    currentTurn === participant.id
                      ? 'rgba(255, 0, 0, 0.1)'
                      : 'transparent',
                  borderBottom: 'none',
                  fontSize: isMobile ? '0.75rem' : '1rem',
                }}
              >
                {currentTurn === participant.id && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <HourglassEmptyIcon
                      style={{
                        marginRight: 4,
                        fontSize: isMobile ? '16px' : '24px',
                      }}
                    />
                    <Typography
                      variant="body2"
                      color="error"
                      sx={{ fontSize: isMobile ? '0.65rem' : '0.875rem' }}
                    >
                      {remainingTime} секунд
                    </Typography>
                  </div>
                )}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '1rem' }}>
              Параметры и требования
            </TableCell>
            {participants.map((participant) => (
              <TableCell
                key={participant.id}
                sx={{
                  textAlign: 'center',
                  backgroundColor:
                    currentTurn === participant.id
                      ? 'rgba(0, 0, 0, 0.05)'
                      : 'transparent',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.75rem' : '1rem',
                }}
              >
                {participant.name}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell
              colSpan={participants.length + 1}
              sx={{
                fontWeight: 'bold',
                backgroundColor: '#f0f0f0',
                fontSize: isMobile ? '0.75rem' : '1rem',
              }}
            >
              Условия
            </TableCell>
          </TableRow>
          {[
            {
              field: 'manufacturingDays',
              label: 'Срок изготовления лота, дней',
            },
            {
              field: 'warrantyMonths',
              label: 'Гарантийные обязательства, мес.',
            },
            { field: 'paymentConditions', label: 'Условия оплаты' },
          ].map(({ field, label }) => (
            <TableRow key={field}>
              <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '1rem' }}>
                {label}
              </TableCell>
              {participants.map((participant) => (
                <TableCell
                  key={participant.id}
                  sx={{
                    textAlign: 'center',
                    backgroundColor:
                      currentTurn === participant.id
                        ? 'rgba(0, 0, 0, 0.05)'
                        : 'transparent',
                    fontSize: isMobile ? '0.75rem' : '1rem',
                  }}
                >
                  {renderCellContent({
                    participant,
                    field: field as keyof Participant,
                    currentTurn,
                    userId,
                    isAuctionActive,
                    inputValues,
                    setInputValues,
                    onInputChange,
                    editedData,
                  })}
                </TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow>
            <TableCell
              colSpan={participants.length + 1}
              sx={{
                fontWeight: 'bold',
                backgroundColor: '#f0f0f0',
                fontSize: isMobile ? '0.75rem' : '1rem',
              }}
            >
              Ставки
            </TableCell>
          </TableRow>
          {[
            { field: 'bid', label: 'Ставка' },
            { field: 'discount', label: 'Скидка' },
          ].map(({ field, label }) => (
            <TableRow key={field}>
              <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '1rem' }}>
                {label}
              </TableCell>
              {participants.map((participant) => (
                <TableCell
                  key={participant.id}
                  sx={{
                    textAlign: 'center',
                    backgroundColor:
                      currentTurn === participant.id
                        ? 'rgba(0, 0, 0, 0.05)'
                        : 'transparent',
                    fontSize: isMobile ? '0.75rem' : '1rem',
                  }}
                >
                  {renderCellContent({
                    participant,
                    field: field as keyof Participant,
                    currentTurn,
                    userId,
                    isAuctionActive,
                    inputValues,
                    setInputValues,
                    onInputChange,
                    editedData,
                  })}
                </TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow>
            <TableCell sx={{ fontSize: isMobile ? '0.75rem' : '1rem' }}>
              Итоговая цена
            </TableCell>
            {participants.map((participant) => (
              <TableCell
                key={participant.id}
                sx={{
                  textAlign: 'center',
                  color: 'green',
                  backgroundColor:
                    currentTurn === participant.id
                      ? 'rgba(0, 0, 0, 0.05)'
                      : 'transparent',
                  fontSize: isMobile ? '0.75rem' : '1rem',
                }}
              >
                {participant.finalPrice}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AuctionTable;
