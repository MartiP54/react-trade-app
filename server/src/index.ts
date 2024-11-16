import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { AuctionData } from '../types/shared';

const app = express();
const server = http.createServer(app);

app.use(cors({ origin: 'http://localhost:3000' }));

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const auctionData: AuctionData = {
  participants: [
    {
      id: 1,
      name: 'Участник 1',
      bid: 3700000,
      discount: -25000,
      finalPrice: 3675000,
      manufacturingDays: 80,
      warrantyMonths: 24,
      paymentConditions: 30,
    },
    {
      id: 2,
      name: 'Участник 2',
      bid: 3200000,
      discount: -25000,
      finalPrice: 3175000,
      manufacturingDays: 90,
      warrantyMonths: 24,
      paymentConditions: 100,
    },
    {
      id: 3,
      name: 'Участник 3',
      bid: 2800000,
      discount: -25000,
      finalPrice: 2775000,
      manufacturingDays: 75,
      warrantyMonths: 22,
      paymentConditions: 60,
    },
    {
      id: 4,
      name: 'Участник 4',
      bid: 2500000,
      discount: -25000,
      finalPrice: 2475000,
      manufacturingDays: 120,
      warrantyMonths: 36,
      paymentConditions: 50,
    },
  ],
  currentTurn: 1,
  remainingTime: 30,
  totalTime: 900,
  isAuctionActive: false,
};

let turnIntervalId: NodeJS.Timeout;
let auctionIntervalId: NodeJS.Timeout;

const resetAuctionState = () => {
  auctionData.currentTurn = 1;
  auctionData.remainingTime = 30;
  auctionData.totalTime = 900;
  auctionData.isAuctionActive = true;
};

const nextTurn = () => {
  auctionData.currentTurn =
    (auctionData.currentTurn % auctionData.participants.length) + 1;
  auctionData.remainingTime = 30;
  io.emit('auctionData', auctionData);
};

const startTurnTimer = () => {
  clearInterval(turnIntervalId);
  turnIntervalId = setInterval(() => {
    auctionData.remainingTime -= 1;
    io.emit('auctionData', auctionData);

    if (auctionData.remainingTime <= 0) {
      nextTurn();
    }
  }, 1000);
};

const endAuction = () => {
  clearInterval(turnIntervalId);
  clearInterval(auctionIntervalId);
  auctionData.isAuctionActive = false;
  io.emit('auctionData', auctionData);
  io.emit('auctionEnd', 'Торги завершены');
};

const startAuctionTimer = () => {
  clearInterval(auctionIntervalId);
  auctionIntervalId = setInterval(() => {
    auctionData.totalTime -= 1;
    io.emit('auctionData', auctionData);

    if (auctionData.totalTime <= 0) {
      endAuction();
    }
  }, 1000);
};

io.on('connection', (socket: Socket) => {
  console.log('A user connected:', socket.id);

  socket.emit('auctionData', auctionData);

  socket.on(
    'placeBid',
    ({
      userId,
      bid,
      discount,
      manufacturingDays,
      warrantyMonths,
      paymentConditions,
    }) => {
      const participant = auctionData.participants.find((p) => p.id === userId);
      if (participant && auctionData.currentTurn === userId) {
        if (bid !== undefined) participant.bid = bid;
        if (discount !== undefined) participant.discount = discount;
        if (manufacturingDays !== undefined)
          participant.manufacturingDays = manufacturingDays;
        if (warrantyMonths !== undefined)
          participant.warrantyMonths = warrantyMonths;
        if (paymentConditions !== undefined)
          participant.paymentConditions = paymentConditions;
        participant.finalPrice = participant.bid + participant.discount;
        nextTurn();
      }
    },
  );

  socket.on('startAuction', () => {
    resetAuctionState();
    startTurnTimer();
    startAuctionTimer();
    io.emit('auctionData', auctionData);
  });

  socket.on('endAuction', () => {
    endAuction();
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

server.listen(3001, () => {
  console.log('Server is running on port 3001');
});
