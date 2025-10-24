// Simple fallback server for testing without MongoDB
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'SkinVox Mock API Server is running!',
    version: '1.0.0',
    status: 'healthy',
    note: 'This is a mock server for testing without MongoDB'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});


// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Mock Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔧 Note: This is a mock server for testing without MongoDB`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
    app.listen(PORT + 1, () => {
      console.log(`🚀 Mock Server running on port ${PORT + 1}`);
      console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } else {
    console.error('❌ Server error:', err);
  }
});