const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/temp_dataset')
    .then(() => console.log('MongoDB에 연결되었습니다.'))
    .catch(err => console.error('MongoDB 연결 실패:', err));


const fileMetadataSchema = new mongoose.Schema({
    fileName: String,
    uploadDate: { type: Date, default: Date.now },
    temperatureData: [{ 
        Date: String, 
        Time: String, 
        Temperature: Number 
    }],
    boxplotStats: {
        min: Number,
        q1: Number,
        median: Number,
        q3: Number,
        max: Number,
        outliers: [Number]
    }
});

const FileMetadata = mongoose.model('FileMetadata', fileMetadataSchema);

// // 특정 파일 메타데이터의 temperatureData 필드만 조회
// const fileNameToQuery = 'LandData 2023-08-09-11-13-39.csv';
// FileMetadata.findOne({ fileName: fileNameToQuery }, 'temperatureData')
//     .then(fileMetadata => {
//         if (fileMetadata && fileMetadata.temperatureData) {
//             fileMetadata.temperatureData.forEach(entry => {
//                 console.log(`Date: ${entry.Date}, Time: ${entry.Time}, Temperature: ${entry.Temperature}`);
//             });
//         } else {
//             console.log('해당 파일 메타데이터가 없거나 temperatureData가 비어있습니다.');
//         }
//     })
//     .catch(error => {
//         console.error('쿼리 오류:', error);
//     });

// 특정 파일 메타데이터의 boxplotStats 필드만 조회
const fileNameToQuery = 'LandData 2023-08-09-11-13-39.csv';
FileMetadata.findOne({ fileName: fileNameToQuery }, 'boxplotStats')
    .then(fileMetadata => {
        if (fileMetadata) {
            console.log('Boxplot Stats:', fileMetadata.boxplotStats);
        } else {
            console.log('해당 파일 메타데이터가 없습니다.');
        }
    })
    .catch(error => {
        console.error('쿼리 오류:', error);
    });

// node queryFileMetadata.js