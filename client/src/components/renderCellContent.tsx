import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import handleNumberInputChange from '../utils/handleNumberInputChange';
import { Participant } from '../types/shared';

type RenderCellContentProps = {
  participant: Participant;
  field: keyof Participant | 'paymentConditions';
  currentTurn: number;
  userId?: number;
  isAuctionActive?: boolean;
  inputValues: Record<number, Record<string, string>>;
  setInputValues: React.Dispatch<
    React.SetStateAction<Record<number, Record<string, string>>>
  >;
  onInputChange?: (id: number, field: keyof Participant, value: number) => void;
  editedData?: Record<number, Partial<Participant>>;
};

const renderCellContent = ({
  participant,
  field,
  currentTurn,
  userId,
  isAuctionActive,
  inputValues,
  setInputValues,
  onInputChange,
  editedData,
}: RenderCellContentProps): React.ReactNode => {
  const isCurrentTurn = currentTurn === participant.id;
  const isEditable =
    isAuctionActive && userId !== undefined && userId === participant.id;

  if (isEditable && isCurrentTurn) {
    return (
      <TextField
        type={field === 'paymentConditions' ? 'text' : 'number'}
        value={
          field === 'paymentConditions'
            ? inputValues[participant.id]?.[field]?.replace('%', '') || ''
            : (editedData?.[participant.id]?.[field] ??
              String(participant[field as keyof Participant]))
        }
        onChange={(e) => {
          const inputValue = e.target.value;
          const numericValue =
            field === 'paymentConditions'
              ? parseFloat(inputValue)
              : parseInt(inputValue, 10);

          handleNumberInputChange(
            e,
            participant.id,
            field as keyof Participant,
            setInputValues,
            (id, inputField) => {
              if (onInputChange) {
                onInputChange(id, inputField, numericValue);
              }
            },
          );
        }}
        variant="standard"
        disabled={!isEditable}
        InputProps={{
          endAdornment:
            field === 'paymentConditions' ? (
              <InputAdornment position="end">%</InputAdornment>
            ) : undefined,
        }}
        sx={{
          width: '30%',
          '.MuiInputBase-input': {
            textAlign: 'center',
          },
        }}
      />
    );
  }

  if (field === 'paymentConditions') {
    return `${participant.paymentConditions}%`;
  }

  return participant[field as keyof Participant];
};

export default renderCellContent;
