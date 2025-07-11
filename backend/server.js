// Import modul-modul
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Setup Express App
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup static folder (untuk PDF)
app.use(express.static(path.join(__dirname, 'public')));

// Setup Socket.IO
const setupSocket = require('./sockets/socketHandler');

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const io = setupSocket(server);

// Export io supaya bisa dipakai di controller
const apiContext = { io };

// Setup routes
const queueRoutes = require('./routes/queueRoutes');
const downloadRoutes = require('./routes/downloadRoutes');
app.use('/api/queue', queueRoutes(apiContext));
app.use('/api/download', downloadRoutes);

// route default ketika hanya akses host
app.use('/', (req, res) => {
  res.status(200).json({message:'Selamat Datang! service berjalan dengan baik'});
})



// 8. Setup MongoDB connection
const connectDB = require('./config/db');
connectDB();

// 9. Socket.IO listener untuk update data
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
});