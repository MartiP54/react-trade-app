import { Participant } from '../types/shared';

const handleNumberInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  participantId: number,
  field: keyof Participant,
  setInputValues: React.Dispatch<
    React.SetStateAction<Record<number, Record<string, string>>>
  >,
  onInputChange?: (id: number, field: keyof Participant, value: number) => void,
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

export default handleNumberInputChange;
