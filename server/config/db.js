// server\config\db.js

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/temp_dataset', { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('MongoDB 연결됨');
  } catch (err) {
    console.error('MongoDB 연결 오류:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
