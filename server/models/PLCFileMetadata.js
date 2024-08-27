// server\models\PLCFileMetadata.js

const mongoose = require('mongoose');

const plcFileMetadataSchema = new mongoose.Schema({
  fileName: String,
  uploadDate: { type: Date, default: Date.now },
  pressureData: [{
    date: String,
    time: String,
    pressure: Number
  }],
  filePath: {
    type: String,
    required: true
  },
  numbering: {
    countNumber: String,
    wNumber: String,
    dwNumber: String,
    dieNumber: String
  },
  filedate: String,
  startTime: String,
  endTime: String
});

const PLCFileMetadata = mongoose.model('PLCFileMetadata', plcFileMetadataSchema);

module.exports = PLCFileMetadata;
