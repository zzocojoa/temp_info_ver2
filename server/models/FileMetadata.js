// server/models/FileMetadata.js

const mongoose = require('mongoose');

const fileMetadataSchema = new mongoose.Schema({
    fileName: String,
    uploadDate: { type: Date, default: Date.now },
    temperatureData: [{
        date: String,
        time: String,
        temperature: Number
    }],
    // PLC 데이터를 위한 새로운 필드 추가
    plcData: [{
        date: String,
        time: String,
        pressure: Number,
        ctf: Number,
        ctb: Number,
        speed: Number
    }],
    boxplotStats: {
        min: Number,
        q1: Number,
        median: Number,
        q3: Number,
        max: Number,
        outliers: [Number]
    },
    // PLC 데이터에 대한 boxplot 통계 추가
    plcBoxplotStats: {
        pressure: {
            min: Number,
            q1: Number,
            median: Number,
            q3: Number,
            max: Number,
            outliers: [Number]
        },
        // 필요한 경우 ctf, ctb, speed에 대한 boxplot 통계도 추가할 수 있습니다.
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
    // PLC 파일 관련 메타데이터 추가
    plcFileName: String,
    plcUploadDate: { type: Date },
});

const FileMetadata = mongoose.model('FileMetadata', fileMetadataSchema);

module.exports = FileMetadata;