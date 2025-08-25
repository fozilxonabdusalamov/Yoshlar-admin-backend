const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/banner', require('./routes/banner'));
app.use('/api/news', require('./routes/news'));
app.use('/api/directions', require('./routes/directions'));
app.use('/api/choose', require('./routes/choose'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/images', require('./routes/images'));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB ga muvaffaqiyatli ulanildi'))
.catch(err => console.error('MongoDB ulanishida xatolik:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Server xatoligi',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Ichki server xatoligi'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'API endpoint topilmadi' 
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishlamoqda`);
});
