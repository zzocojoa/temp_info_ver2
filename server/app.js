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

// uploads 디렉토리 확인 및 생성
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware 구성 변경
// body-parser 미들웨어는 express 내장 미들웨어로 대체될 수 있음
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ 
  limit: '50mb',
  extended: true 
}));

app.use(cors());
app.use(morgan('dev'));

// MongoDB 연결
connectDB();

// 파일 라우트 설정
app.use('/api', fileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
