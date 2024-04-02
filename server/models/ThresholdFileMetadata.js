// server\models\ThresholdFileMetadata.js

const mongoose = require('mongoose');

// 스키마 정의
const ThresholdMetadataSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true
  },
  uploadDate: {
    type: Date,
    default: Date.now
  },
  uploadId: {
    type: String,
    required: true
  },
  temperatureData: [{
    date: String,
    time: String,
    temperature: Number
  }],
  filePath: {
    type: String,
    required: true
  }
});

// 모델 생성
const ThresholdMetadata = mongoose.model('ThresholdMetadata', ThresholdMetadataSchema);

module.exports = ThresholdMetadata;
