import { Server } from 'socket.io';

let ioInstance = null;
const activeTrackers = new Map();

export function initOrderSockets(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH'],
    },
  });

  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`🔌 WebSockets: Client connected (${socket.id})`);

    socket.on('join_order_room', ({ orderId }) => {
      if (orderId) {
        socket.join(`order_${orderId}`);
        console.log(`📡 Socket ${socket.id} joined live tracking room for order #${orderId}`);
        
        // Start emitting simulated live GPS coordinates if not already running
        startDriverGpsSimulation(orderId);
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 WebSockets: Client disconnected (${socket.id})`);
    });
  });

  return io;
}

export function emitOrderStatusChange(orderId, status) {
  if (ioInstance) {
    ioInstance.to(`order_${orderId}`).emit('order_status_update', { orderId, status, timestamp: new Date().toISOString() });
    ioInstance.emit('global_order_update', { orderId, status });
  }
}

// Simulate real-time GPS driver movement along a path in Pune
function startDriverGpsSimulation(orderId) {
  if (activeTrackers.has(orderId)) return;

  // Base coordinates around Senapati Bapat Road / Koregaon Park, Pune
  let lat = 18.5204 + (Math.random() * 0.01 - 0.005);
  let lng = 73.8567 + (Math.random() * 0.01 - 0.005);
  let speed = 0.0003;

  const interval = setInterval(() => {
    lat += (Math.random() * 0.0002 - 0.0001) + speed;
    lng += (Math.random() * 0.0002 - 0.0001) + speed;

    if (ioInstance) {
      ioInstance.to(`order_${orderId}`).emit('driver_location_update', {
        orderId,
        lat,
        lng,
        heading: Math.floor(Math.random() * 360),
        estimatedMinutes: Math.max(2, Math.floor(Math.random() * 15)),
        driverName: 'Ramesh Kumar (Delivery Partner)',
        driverPhone: '+91 98230 11223',
        timestamp: new Date().toISOString(),
      });
    }
  }, 2500);

  activeTrackers.set(orderId, interval);
}
