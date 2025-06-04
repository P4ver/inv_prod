const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const { errorHandler } = require('./middlewares/errorMiddleware');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const entreeRoutes = require('./routes/entreeRoutes');
const sortieRoutes = require('./routes/sortieRoutes');
const reportRoutes = require('./routes/reportRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const path = require('path');
const cookieParser = require('cookie-parser');

require('dotenv').config();
const app = express();

// app.use(cors());
app.use(cors({
  // origin: 'http://localhost:5173',
  origin: true,
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/entrees', entreeRoutes);
app.use('/api/sorties', sortieRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/categories', categoryRoutes);

// Serve frontend static files
// // const frontendPath = path.join(__dirname, '../frontend/indusUI/dist');

const frontendPath = path.join(__dirname, './client/dist');
app.use(express.static(frontendPath));

// React Router fallback for SPA
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Error Middleware
app.use(errorHandler);
// Start Server
const PORT = process.env.PORT || 5000;
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected...');
    await sequelize.sync({ alter: true }); // sync tables

    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('Unable to connect to DB:', error);
  }
})();
