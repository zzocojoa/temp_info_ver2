// server\app.js

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fileRoutes = require('./routes/fileRoutes');
const fs = require('fs');
const connectDB = require('./config/db');

const app = express();
const uploadDir = './uploads';

// uploads 디렉토리 확인 및 생성
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
connectDB();

app.use('/api', fileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
