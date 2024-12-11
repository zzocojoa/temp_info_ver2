// server\models\FileMetadata.js

const mongoose = require('mongoose');

const fileMetadataSchema = new mongoose.Schema({
    fileName: String,
    uploadDate: { type: Date, default: Date.now },
    temperatureData: [{
        date: String,
        time: String,
        temperature: Number,
        mainPressure: { type: Number, default: null },
        containerTempFront: { type: Number, default: null },
        containerTempBack: { type: Number, default: null },
        currentSpeed: { type: Number, default: null }
    }],
    boxplotStats: {
        min: Number,
        q1: Number,
        median: Number,
        q3: Number,
        max: Number,
        outliers: [Number]
    },
    numbering: {
        countNumber: String,
        wNumber: String,
        dwNumber: String,
        dieNumber: String,
    },
    filedate: String,
    userInput: String,
    startTime: String,
    endTime: String,
});

const FileMetadata = mongoose.model('FileMetadata', fileMetadataSchema);

module.exports = FileMetadata;
