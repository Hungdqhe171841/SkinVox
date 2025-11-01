// Load environment variables first (only if .env file exists)
try {
  require('dotenv').config();
} catch (error) {
  console.log('📝 No .env file found, using environment variables from Render');
}

// Set default JWT secret if not provided
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'skinvox_jwt_secret_key_2025_very_secure_random_string_12345';
  console.log('⚠️  Warning: Using default JWT_SECRET. Please set JWT_SECRET in environment variables for production.');
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Debug environment variables
console.log('🔧 Server Debug - Environment variables:');
console.log('🔧 Server Debug - PORT:', process.env.PORT);
console.log('🔧 Server Debug - MONGODB_URI:', process.env.MONGODB_URI);
console.log('🔧 Server Debug - JWT_SECRET:', process.env.JWT_SECRET ? 'Present' : 'Missing');
console.log('🔧 Server Debug - NODE_ENV:', process.env.NODE_ENV);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(morgan('combined'));

// CORS Configuration - Dynamic origin checking
const allowedOrigins = [
  'https://ddaa7.vercel.app',
  'https://skinvox-client.vercel.app',
  'https://skinvox.vercel.app', 
  'https://skin-vox.vercel.app',
  'http://localhost:3000',
  'http://localhost:3002', 
  'http://localhost:5173'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or curl)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow all .vercel.app domains
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }
    
    // Reject other origins
    console.log('❌ CORS blocked origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

console.log('🌐 Server Debug - CORS origins:', allowedOrigins);
console.log('🌐 Server Debug - Also allowing all *.vercel.app domains');
app.use(cors(corsOptions));

// CORS Debug middleware
app.use((req, res, next) => {
  console.log('🌐 Server Debug - CORS request from origin:', req.headers.origin);
  console.log('🌐 Server Debug - Request method:', req.method);
  console.log('🌐 Server Debug - Request URL:', req.url);
  next();
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
console.log('🔗 Server Debug - Connecting to MongoDB...');
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/SkinVox'
console.log('🔗 Server Debug - MongoDB URI:', mongoURI);
mongoose.connect(mongoURI, {
  dbName: 'SkinVox' // Use existing database
})
.then(() => console.log('✅ Connected to MongoDB - SkinVox database'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'SkinVox API Server is running!',
    version: '1.0.0',
    status: 'healthy'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Static file serving for uploads
const uploadPath = process.env.UPLOAD_PATH || path.join(__dirname, 'public/uploads');
app.use('/uploads', express.static(uploadPath));

// API Routes
console.log('🛣️ Server Debug - Setting up API routes...');
app.use('/api/auth', require('./routes/auth'));
console.log('🛣️ Server Debug - Auth routes mounted at /api/auth');
app.use('/api/products', require('./routes/products'));
console.log('🛣️ Server Debug - Products routes mounted at /api/products');
app.use('/api/admin', require('./routes/admin'));
console.log('🛣️ Server Debug - Admin routes mounted at /api/admin');
app.use('/api/beautybar', require('./routes/beautybar'));
console.log('🛣️ Server Debug - BeautyBar routes mounted at /api/beautybar');
app.use('/api/blog', require('./routes/blog'));
console.log('🛣️ Server Debug - Blog routes mounted at /api/blog');
app.use('/api/reviews', require('./routes/reviews'));
console.log('🛣️ Server Debug - Reviews routes mounted at /api/reviews');
app.use('/api/premium', require('./routes/premium'));
console.log('🛣️ Server Debug - Premium routes mounted at /api/premium');
app.use('/api/chatbot', require('./routes/chatbot'));
console.log('🛣️ Server Debug - Chatbot routes mounted at /api/chatbot');
// app.use('/api/users', require('./routes/users'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
    app.listen(PORT + 1, () => {
      console.log(`🚀 Server running on port ${PORT + 1}`);
      console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } else {
    console.error('❌ Server error:', err);
  }
});
