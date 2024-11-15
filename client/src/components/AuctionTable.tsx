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
  TextField,
  InputAdornment,
} from '@mui/material';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { AuctionData, Participant } from '../types/shared';

const AuctionTable: React.FC<AuctionData> = ({
  participants,
  currentTurn,
  remainingTime,
  editedData,
  onInputChange,
  userId,
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

  const handleNumberInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    participantId: number,
    field: keyof Participant,
  ) => {
    const { value } = e.target;
    const numericValue = value.replace('%', '');

    if (field === 'paymentConditions') {
      const numberValue = Number(numericValue);
      if (Number.isNaN(numberValue) || numberValue < 0 || numberValue > 100) {
        return;
      }
    }

    const displayValue =
      field === 'paymentConditions' ? `${numericValue}%` : numericValue;

    setInputValues((prevValues) => ({
      ...prevValues,
      [participantId]: {
        ...prevValues[participantId],
        [field]: displayValue,
      },
    }));

    if (onInputChange && numericValue && !Number.isNaN(Number(numericValue))) {
      onInputChange(participantId, field, Number(numericValue));
    }
  };

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
                  {(() => {
                    if (
                      currentTurn === participant.id &&
                      userId === participant.id
                    ) {
                      return (
                        <TextField
                          value={
                            inputValues[participant.id]?.[field]?.replace(
                              '%',
                              '',
                            ) || ''
                          }
                          onChange={(e) =>
                            handleNumberInputChange(
                              e,
                              participant.id,
                              field as keyof Participant,
                            )
                          }
                          variant="standard"
                          disabled={userId !== participant.id}
                          InputProps={{
                            endAdornment:
                              field === 'paymentConditions' ? (
                                <InputAdornment position="end">
                                  %
                                </InputAdornment>
                              ) : undefined,
                          }}
                        />
                      );
                    }

                    if (field === 'paymentConditions') {
                      return `${participant.paymentConditions}%`;
                    }

                    return participant[field as keyof Participant];
                  })()}
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
                  {currentTurn === participant.id &&
                  userId === participant.id ? (
                    <TextField
                      type="number"
                      value={
                        editedData?.[participant.id]?.[field] ??
                        String(participant[field as keyof Participant])
                      }
                      onChange={(e) =>
                        handleNumberInputChange(
                          e,
                          participant.id,
                          field as keyof Participant,
                        )
                      }
                      variant="standard"
                      disabled={userId !== participant.id}
                    />
                  ) : (
                    participant[field as keyof Participant]
                  )}
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
