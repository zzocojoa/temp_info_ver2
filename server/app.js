// server\app.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const fileRoutes = require('./routes/fileRoutes');
const fs = require('fs');
const connectDB = require('./config/db');

const app = express();
const uploadDir = './uploads';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ 
  limit: '50mb',
  extended: true 
}));

app.use(cors());
app.use(morgan('dev'));

connectDB();

app.use('/api', fileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
