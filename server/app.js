// server/app.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const fileRoutes = require('./routes/fileRoutes');
const fs = require('fs');
const connectDB = require('./config/db');

const app = express();
const uploadDir = './uploads';

// 업로드 디렉토리 생성
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 요청 바디 크기 제한 설정
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ 
  limit: '50mb',
  extended: true 
}));

// CORS 설정: Preflight 요청 캐싱, 허용 메서드 설정
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // 모든 도메인에서 접근 허용
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // 허용할 HTTP 메서드 설정
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cache-Control'); // 'Cache-Control' 헤더 허용 추가
  res.header('Access-Control-Max-Age', '86400'); // Preflight 요청 캐싱: 24시간(86400초)
  next();
});

// HTTP 요청 로깅
app.use(morgan('dev'));

// MongoDB 연결
connectDB();

// API 라우트 설정
app.use('/api', fileRoutes);

// 서버 포트 설정
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  .on('error', (err) => {
    console.error(`Error starting server: ${err.message}`);
  });
