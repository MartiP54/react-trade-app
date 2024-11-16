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
      sx={{ maxWidth: '95%', marginTop: 2, padding: 2, overflowX: 'auto' }}
    >
      <Typography variant="h6" gutterBottom color="error">
        Ход торгов Тестовые торги на тестовое задание
      </Typography>
      <Typography variant="body2" gutterBottom color="textSecondary">
        Уважаемые участники, во время вашего хода вы можете изменить параметры
        торгов, указанных в таблице:
      </Typography>
      <Table sx={{ tableLayout: 'auto', width: '100%' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ borderBottom: 'none' }}>Ход</TableCell>
            {participants.map((participant) => (
              <TableCell
                key={participant.id}
                style={{
                  textAlign: 'center',
                  backgroundColor:
                    currentTurn === participant.id
                      ? 'rgba(255, 0, 0, 0.1)'
                      : 'transparent',
                  borderBottom: 'none',
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
                    <HourglassEmptyIcon style={{ marginRight: 4 }} />
                    <Typography variant="body2" color="error">
                      {remainingTime} секунд
                    </Typography>
                  </div>
                )}
              </TableCell>
            ))}
          </TableRow>
          <TableRow>
            <TableCell>Параметры и требования</TableCell>
            {participants.map((participant) => (
              <TableCell
                key={participant.id}
                style={{
                  textAlign: 'center',
                  backgroundColor:
                    currentTurn === participant.id
                      ? 'rgba(0, 0, 0, 0.05)'
                      : 'transparent',
                  fontWeight: 'bold',
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
              style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}
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
              <TableCell>{label}</TableCell>
              {participants.map((participant) => (
                <TableCell
                  key={participant.id}
                  style={{
                    textAlign: 'center',
                    backgroundColor:
                      currentTurn === participant.id
                        ? 'rgba(0, 0, 0, 0.05)'
                        : 'transparent',
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
              style={{ fontWeight: 'bold', backgroundColor: '#f0f0f0' }}
            >
              Ставки
            </TableCell>
          </TableRow>
          {[
            { field: 'bid', label: 'Ставка' },
            { field: 'discount', label: 'Скидка' },
          ].map(({ field, label }) => (
            <TableRow key={field}>
              <TableCell>{label}</TableCell>
              {participants.map((participant) => (
                <TableCell
                  key={participant.id}
                  style={{
                    textAlign: 'center',
                    backgroundColor:
                      currentTurn === participant.id
                        ? 'rgba(0, 0, 0, 0.05)'
                        : 'transparent',
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
            <TableCell>Итоговая цена</TableCell>
            {participants.map((participant) => (
              <TableCell
                key={participant.id}
                style={{
                  textAlign: 'center',
                  color: 'green',
                  backgroundColor:
                    currentTurn === participant.id
                      ? 'rgba(0, 0, 0, 0.05)'
                      : 'transparent',
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
