// ```
// // server/config/db.js

// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     await mongoose.connect('mongodb://127.0.0.1:27017/temp_dataset', { useNewUrlParser: true, useUnifiedTopology: true });
//     console.log('MongoDB 연결됨');
//   } catch (err) {
//     console.error('MongoDB 연결 오류:', err);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;

// ```
// ```
// // server/models/FileMetadata.js

// const mongoose = require('mongoose');

// const fileMetadataSchema = new mongoose.Schema({
//     fileName: String,
//     uploadDate: { type: Date, default: Date.now },
//     temperatureData: [{
//         date: String,
//         time: String,
//         temperature: Number
//     }],
//     boxplotStats: {
//         min: Number,
//         q1: Number,
//         median: Number,
//         q3: Number,
//         max: Number,
//         outliers: [Number]
//     },
//     numbering: {
//         countNumber: String,
//         wNumber: String,
//         dwNumber: String,
//         dieNumber: String,
//     },
//     filedate: String,
//     userInput: String,
//     startTime: String, 
//     endTime: String,
// });

// const FileMetadata = mongoose.model('FileMetadata', fileMetadataSchema);

// module.exports = FileMetadata;

// ```
// ```
// // server\routes\fileRoutes.js

// const path = require('path');
// const express = require('express');
// const multer = require('multer');
// const fs = require('fs').promises;
// const router = express.Router();
// const Papa = require('papaparse');
// const FileMetadata = require('../models/FileMetadata');
// const processData = require('../utils/refining');
// const calculateMedian = require('../utils/calculateMedian');
// const processFilteredData = require('../utils/filteredDataProcessor');
// const calculateBoxplotStats = require('../utils/boxplotStats');

// // 파일 업로드 미들웨어 설정
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'uploads/'),
//   filename: (req, file, cb) => cb(null, file.originalname)
// });

// const upload = multer({ storage: storage });

// // 파일 업로드 처리
// router.post('/upload', upload.single('file'), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }
//   const filePath = req.file.path;
//   let allData = [];
//   try {
//     const fileContent = await fs.readFile(filePath, 'utf8');
//     Papa.parse(fileContent, {
//       header: true,
//       dynamicTyping: true,
//       skipEmptyLines: true,
//       step: (row) => {
//         const { '[Date]': date, '[Time]': time, '[Temperature]': temperature } = row.data;
//         allData.push({ date, time, temperature });
//       }
//     });
//     const { averagedData, boxplotStats } = processData(allData);

//     res.json({ success: true, message: 'File processed successfully', data: averagedData, boxplotStats });
//   } catch (error) {
//     console.error('Error processing file:', error);
//     res.status(500).send('Error processing file');
//   } finally {
//     try {
//       await fs.unlink(filePath);
//     } catch (error) {
//       console.error('Error deleting file:', error);
//     }
//   }
// });

// // 정제된 파일 업로드 처리 엔드포인트 (다중 파일 지원)
// router.post('/upload-csv', upload.array('files'), async (req, res) => {
//   if (!req.files || req.files.length === 0) {
//     return res.status(400).send('No files uploaded.');
//   }

//   const uploadResults = await Promise.all(req.files.map(async (file) => {
//     const filePath = file.path;
//     const fileName = file.originalname;

//     // 파일 이름에서 정보 추출
//     const match = fileName.match(/(\d{4}-\d{2}-\d{2})-(\d+)_(\d+)_(\d+)_(\d+)\.csv/);
//     if (!match) {
//       // 파일 삭제 로직을 에러 처리 전에 배치하여, 파일이 올바르게 삭제되도록 함
//       await fs.unlink(filePath);
//       return { fileName, error: 'Invalid file name format.' };
//     }

//     const [, filedate, countNumber, wNumber, dwNumber, dieNumber] = match;

//     try {
//       const fileContent = await fs.readFile(filePath, 'utf8');
//       return new Promise((resolve, reject) => {
//         Papa.parse(fileContent, {
//           header: true,
//           dynamicTyping: true,
//           skipEmptyLines: true,
//           complete: async (result) => {
//             const temperatureValues = result.data;
//             const boxplotStats = calculateBoxplotStats(temperatureValues);
//             const newFileMetadata = new FileMetadata({
//               fileName,
//               temperatureData: result.data,
//               boxplotStats,
//               numbering: { countNumber, wNumber, dwNumber, dieNumber },
//               filedate,
//             });
//             await newFileMetadata.save();
//             resolve({ fileName, message: 'File uploaded and data saved successfully', boxplotStats });
//           },
//           error: (error) => {
//             reject(error.message);
//           }
//         });
//       });
//     } catch (error) {
//       console.error('Error processing file:', error);
//       return { fileName, error: error.toString() };
//     } finally {
//       try {
//         await fs.unlink(filePath); // 임시 업로드 파일 삭제
//       } catch (error) {
//         console.error('Error deleting file:', error);
//       }
//     }
//   }));


//   // 모든 파일 처리 결과 반환
//   res.json(uploadResults);
// });

// // boxplot dynamic data
// router.post('/process-filtered-data', async (req, res) => {
//   const { filteredData } = req.body;
//   console.log("filteredData: ", filteredData)
//   try {
//     const { boxplotStats } = processData(filteredData);
//     res.json({ success: true, message: 'Filtered data processed successfully', boxplotStats });
//   } catch (error) {
//     console.error('Error processing filtered data:', error);
//     res.status(500).send('Error processing filtered data');
//   }
// });

// // 필터링된 데이터 처리 및 중앙값 계산 엔드포인트
// router.post('/filtered-linegraph-data', async (req, res) => {
//   const { data, startTime, endTime } = req.body;
//   try {
//     const { filteredData, median } = processFilteredData(data, startTime, endTime);
//     res.json({ success: true, filteredData, median });
//   } catch (error) {
//     console.error('Error processing filtered data:', error);
//     res.status(500).send('Error processing filtered data');
//   }
// });

// // 데이터 저장 처리
// router.post('/save', async (req, res) => {
//   const { fileName, graphData, boxPlotData, numbering, filedate, userInput, startTime, endTime } = req.body;
//   try {
//     const newFileMetadata = new FileMetadata({
//       fileName,
//       temperatureData: graphData,
//       boxplotStats: boxPlotData,
//       numbering: numbering,
//       filedate,
//       userInput,
//       startTime,
//       endTime,
//     });
//     await newFileMetadata.save();
//     res.json({ message: 'Data saved successfully', data: newFileMetadata });
//   } catch (error) {
//     console.error('Error saving data:', error);
//     res.status(500).send('Error saving data');
//   }
// });

// // 특정 데이터 항목의 상세 정보 업데이트
// router.patch('/data/:id', async (req, res) => {
//   const { id } = req.params;
//   const { userInput } = req.body; // 요청 본문에서 수정된 userInput 값을 받기
//   try {
//     // findByIdAndUpdate 메서드를 사용하여 해당 ID의 문서를 찾고, userInput 필드를 업데이트
//     const updatedItem = await FileMetadata.findByIdAndUpdate(id, { $set: { userInput: userInput } }, { new: true });

//     if (!updatedItem) {
//       return res.status(404).send('Data not found');
//     }
//     res.json({ message: 'Data updated successfully', data: updatedItem });
//   } catch (error) {
//     console.error('Error updating data:', error);
//     res.status(500).send('Error updating data');
//   }
// });

// // 데이터 리스트 조회 
// router.get('/data-list', async (req, res) => {
//   try {
//     const dataList = await FileMetadata.find({}); // 모든 데이터 리스트 조회console.log
//     res.json(dataList); // 클라이언트에 데이터 리스트 응답
//   } catch (error) {
//     console.error('Error fetching data list:', error); // 에러 로깅
//     res.status(500).send('Error fetching data list');
//   }
// });

// // 특정 데이터 항목의 상세 정보 조회
// router.get('/data/:id', async (req, res) => {
//   const { id } = req.params;
//   const { userInput } = req.body;
//   try {
//     const dataItem = await FileMetadata.findByIdAndUpdate(id, { $set: { userInput } }, { new: true });
//     if (!dataItem) {
//       return res.status(404).send('Data not found');
//     }
//     res.json(dataItem);
//   } catch (error) {
//     console.error('Error fetching data item:', error);
//     res.status(500).send('Server error');
//   }
// });

// // 특정 데이터 항목의 상세 정보 삭제
// router.delete('/data/:id', async (req, res) => {
//   try {
//     const id = req.params.id;
//     const deletedItem = await FileMetadata.findByIdAndDelete(id); // 데이터 삭제

//     if (!deletedItem) {
//       return res.status(404).send({ message: 'Data not found' });
//     }

//     res.send({ message: 'Data successfully removed' }); // 성공 메시지 반환
//   } catch (error) {
//     console.error('Error removing data:', error);
//     res.status(500).send('Internal server error');
//   }
// });

// // CSV 변환을 위한 함수
// const objectToCsv = (data) => {
//   const csvRows = data.map(item => {
//     const { userInput, numbering, boxplotStats } = item;
//     return `"${userInput}","${numbering.wNumber}","${numbering.dwNumber}","${numbering.dieNumber}","${boxplotStats.median}"`;
//   });
//   return `userInput,wNumber,dwNumber,dieNumber,median\n${csvRows.join("\n")}`;
// };

// // 선택된 데이터를 CSV로 변환하여 반환하는 엔드포인트
// router.post('/export-csv', async (req, res) => {
//   const { ids } = req.body; // 클라이언트에서 전송한 데이터 ID 배열
//   try {
//     const data = await FileMetadata.find({ '_id': { $in: ids } });
//     if (!data.length) {
//       return res.status(404).send('Data not found');
//     }
//     const csvData = objectToCsv(data);
//     res.header('Content-Type', 'text/csv');
//     res.attachment('exported_data.csv');
//     return res.send(csvData);
//   } catch (error) {
//     console.error('Error exporting to CSV:', error);
//     return res.status(500).send('Internal Server Error');
//   }
// });

// // 중앙값 계산 엔드포인트
// router.post('/calculate-median', (req, res) => {
//   const { data } = req.body; // 클라이언트에서 전송한 데이터 배열
//   if (!Array.isArray(data)) {
//     return res.status(400).json({ message: 'Invalid data format' });
//   }
//   try {
//     const median = calculateMedian(data);
//     res.json({ success: true, median });
//   } catch (error) {
//     console.error('Error calculating median:', error);
//     res.status(500).json({ message: 'Error calculating median' });
//   }
// });

// module.exports = router;

// ```
// ```
// // server/utils/boxplotStats.js

// const quartile = require('./quartile');

// const calculateBoxplotStats = (averagedData) => {
//   console.log("averagedData: ", averagedData)
//   const temperatureValues = averagedData.map(entry => entry.temperature).filter(t => !isNaN(t));
//   if (temperatureValues.length === 0) {
//     return { min: null, q1: null, median: null, q3: null, max: null, outliers: [] };
//   }

//   const q1 = quartile(temperatureValues, 0.25);
//   const median = quartile(temperatureValues, 0.5);
//   const q3 = quartile(temperatureValues, 0.75);
//   const iqr = q3 - q1;
//   const lowerBound = q1 - 1.5 * iqr;
//   const upperBound = q3 + 1.5 * iqr;

//   const min = Math.min(...temperatureValues);
//   const max = Math.max(...temperatureValues);
//   const outliers = temperatureValues.filter(t => t < lowerBound || t > upperBound);

//   return { min, q1, median, q3, max, outliers };
// };

// module.exports = calculateBoxplotStats;

// ```
// ```
// // server/utils/averageData.js

// const moment = require('moment');

// const calculateAveragedData = (filteredData) => {
//     let groupedData = new Map();
//     filteredData.forEach(item => {
//         const roundedTime = moment(item.time, 'HH:mm:ss').startOf('minute').seconds(
//             Math.floor(moment(item.time, 'HH:mm:ss').seconds() / 15) * 15
//         ).format('HH:mm:ss');

//         const dateTimeKey = `${item.date} ${roundedTime}`;
//         if (!groupedData.has(dateTimeKey)) {
//             groupedData.set(dateTimeKey, { sum: 0, count: 0, date: item.date, time: roundedTime });
//         }
//         let entry = groupedData.get(dateTimeKey);
//         entry.sum += item.temperature;
//         entry.count += 1;
//     });

//     return Array.from(groupedData.values()).map(entry => ({
//         date: entry.date,
//         time: entry.time,
//         temperature: entry.sum / entry.count
//     }));
// };

// module.exports = calculateAveragedData;

// ```
// ```
// // server/utils/filteredDataProcessor.js

// const calculateMedian = require('./calculateMedian');

// // 데이터 필터링 및 중앙값 계산 함수
// const processFilteredData = (data, startTime, endTime) => {
//     // 주어진 시간 범위에 맞는 데이터만 필터링
//     const filteredData = data.filter(item => {
//         const itemTime = new Date(`1970/01/01 ${item.time}`);
//         const startTimeDate = new Date(`1970/01/01 ${startTime}`);
//         const endTimeDate = new Date(`1970/01/01 ${endTime}`);
//         return itemTime >= startTimeDate && itemTime <= endTimeDate;
//     });

//     // 중앙값 계산
//     const temperatures = filteredData.map(item => item.temperature);
//     const median = calculateMedian(temperatures);

//     return { filteredData, median };
// };

// module.exports = processFilteredData;

// ```
// ```
// // server/utils/calculateMedian.js

// const calculateMedian = (data) => {
//   if (!data || data.length === 0) return 0;

//   const sortedData = data.slice().sort((a, b) => a - b);
//   const midIndex = Math.floor(sortedData.length / 2);

//   if (sortedData.length % 2 === 0) {
//     return (sortedData[midIndex - 1] + sortedData[midIndex]) / 2;
//   } else {
//     return sortedData[midIndex];
//   }
// };

// module.exports = calculateMedian;
// ```
// ```
// // server\utils\quartile.js

// const quartile = (arr, q) => {
//     const sorted = arr.slice().sort((a, b) => a - b);
//     const pos = (sorted.length - 1) * q;
//     const base = Math.floor(pos);
//     const rest = pos - base;
//     if (sorted[base + 1] !== undefined) {
//         return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
//     } else {
//         return sorted[base];
//     }
// };

// module.exports = quartile;

// ```
// ```
// // server/utils/preprocessData.js

// function preprocessData(data) {
//     let dateCounts = {};
//     let temperatures = [];

//     // 데이터 전처리
//     for (const item of data) {
//         const date = item['date'];
//         const time = item['time'];
//         const temperature = parseFloat(item['temperature']);

//         if (!isNaN(temperature)) {
//             dateCounts[date] = (dateCounts[date] || 0) + 1;
//             temperatures.push({ date, time, temperature });
//         }
//     }
//     // console.log("temperatures: ", temperatures);

//     // dateCounts 객체가 비어있는 경우 처리
//     const mostDataDate = Object.keys(dateCounts).length > 0
//         ? Object.keys(dateCounts).reduce((a, b) => dateCounts[a] > dateCounts[b] ? a : b)
//         : null;

//     if (mostDataDate) {
//         temperatures = temperatures.filter(item => item.date === mostDataDate);
//     } else {
//         temperatures = []; // mostDataDate가 없는 경우, temperatures 배열을 비웁니다.
//     }

//     const tempValues = temperatures.map(item => item.temperature);

//     return { temperatures, tempValues };
// }

// module.exports = preprocessData;

// ```
// ```
// // server/utils/refining.js

// const moment = require('moment');
// const calculateQuartiles = require('./quartileCalculations');
// const calculateAveragedData = require('./averageData');
// const calculateBoxplotStats = require('./boxplotStats');
// const preprocessData = require('./preprocessData');

// function processData(data) {
//     // 데이터 전처리 로직 호출
//     const { temperatures, tempValues } = preprocessData(data);

//     // Quartile 관련 계산 로직 호출
//     const { q1, q3, lowerBound, upperBound } = calculateQuartiles(tempValues);

//     // 필터링 및 데이터 변환 로직 호출
//     let filteredData = temperatures.filter(item => item.temperature >= lowerBound && item.temperature <= upperBound)
//         .map(item => ({
//             date: item.date,
//             time: moment(item.time, 'HH:mm:ss:SSS').format('HH:mm:ss'),
//             temperature: item.temperature
//         }));

//     // AveragedData 계산 로직 호출
//     const averagedData = calculateAveragedData(filteredData);

//     // BoxplotStats 계산 로직 호출
//     const boxplotStats = calculateBoxplotStats(averagedData, q1, q3, lowerBound, upperBound);

//     console.log("averagedData: ", averagedData);
//     return { averagedData, boxplotStats };
// }

// module.exports = processData;

// ```
// ```
// // server/utils/quartileCalculations.js

// const quartile = require('./quartile');


// const calculateQuartiles = (tempValues) => {
//     const q1 = quartile(tempValues, 0.25);
//     const q3 = quartile(tempValues, 0.75);
//     const iqr = q3 - q1;
//     const lowerBound = q1 - 1.5 * iqr;
//     const upperBound = q3 + 1.5 * iqr;

//     return { q1, q3, iqr, lowerBound, upperBound };
// };

// module.exports = calculateQuartiles;

// ```
// ```
// // server\app.js

// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const morgan = require('morgan');
// const fileRoutes = require('./routes/fileRoutes');
// const fs = require('fs');
// const connectDB = require('./config/db');

// const app = express();
// const uploadDir = './uploads';

// // uploads 디렉토리 확인 및 생성
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }
// app.use(bodyParser.json({ limit: '50mb' }));
// // URL 인코딩 본문 파서의 크기 제한을 50MB로 설정
// app.use(bodyParser.urlencoded({ 
//   limit: '50mb',
//   extended: true 
// }));

// app.use(cors());
// app.use(express.json());
// app.use(morgan('dev'));
// connectDB();

// app.use('/api', fileRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// ```