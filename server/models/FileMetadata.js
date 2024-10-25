// server\models\FileMetadata.js

const mongoose = require('mongoose');

const fileMetadataSchema = new mongoose.Schema({
    fileName: String,
    uploadDate: { type: Date, default: Date.now },
    // 온도 데이터
    temperatureData: [{
        date: String,
        time: String,
        temperature: Number
    }],
    // 통합된 PLC 데이터 필드 (박스플롯 통계는 없음)
    plcData: [{
        date: String,
        time: String,
        pressure: Number,
        ctf: Number,
        ctb: Number,
        speed: Number
    }],
    // 온도 데이터를 위한 박스플롯 통계만 유지
    boxplotStats: {
        min: Number,
        q1: Number,
        median: Number,
        q3: Number,
        max: Number,
        outliers: [Number]
    },
    // 파일을 구분하는 정보
    numbering: {
        countNumber: String,
        wNumber: String,
        dwNumber: String,
        dieNumber: String,
    },
    // 파일 메타데이터
    filedate: String,
    userInput: String,
    startTime: String, 
    endTime: String,
    // PLC 파일 관련 추가 메타데이터
    plcFileName: String,
    plcUploadDate: { type: Date },
});

const FileMetadata = mongoose.model('FileMetadata', fileMetadataSchema);

module.exports = FileMetadata;
