export interface Participant {
  id: number;
  name: string;
  bid: number;
  discount: number;
  finalPrice: number;
  manufacturingDays: number;
  warrantyMonths: number;
  paymentConditions: number;
}

export interface AuctionData {
  participants: Participant[];
  currentTurn: number;
  remainingTime: number;
  totalTime: number;
  isAuctionActive?: boolean;
  mode: 'admin' | 'participant';
  editedData?: Record<number, Record<string, number>>;
  onInputChange?: (id: number, field: keyof Participant, value: number) => void;
  userId?: number;
}
