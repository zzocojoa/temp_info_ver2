// ```
// // server\routes\fileRoutes.js

// const fs = require('fs').promises;
// const path = require('path');
// const express = require('express');
// const multer = require('multer');
// const router = express.Router();
// const Papa = require('papaparse');
// const FileMetadata = require('../models/FileMetadata');
// const ThresholdMetadata = require('../models/ThresholdFileMetadata');
// const processData = require('../utils/refining');
// const calculateMedian = require('../utils/calculateMedian');
// const processFilteredData = require('../utils/filteredDataProcessor');
// const calculateBoxplotStats = require('../utils/boxplotStats');
// const performClustering = require('../utils/performClustering');
// const { v4: uuidv4 } = require('uuid');
// const { spawn } = require('child_process');
// const archiver = require('archiver');


// // 파일 업로드 미들웨어 설정
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'uploads/'),
//   filename: (req, file, cb) => cb(null, file.originalname)
// });
// // 정적 파일 제공을 위한 미들웨어
// router.use('/files', express.static(path.join(__dirname, '../uploads')));

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

// // 업로드된 파일 처리 및 정제된 데이터를 CSV로 저장
// router.post('/threshold-upload', upload.array('files'), async (req, res) => {
//   if (!req.files || req.files.length === 0) {
//     return res.status(400).send('No files uploaded.');
//   }
//   const uploadId = uuidv4();
//   try {
//     const results = await Promise.all(req.files.map(async (file) => {
//       const filePath = path.join(__dirname, '../uploads', file.filename);
//       const pythonProcess = spawn('python', [path.join(__dirname, '../utils/thresholdProcess.py'), filePath]);
//       let dataString = '';
//       pythonProcess.stdout.on('data', (data) => {
//         dataString += data.toString();
//       });
//       return new Promise((resolve, reject) => {
//         pythonProcess.stderr.on('data', (data) => {
//           console.error(`stderr: ${data}`);
//           reject('Server error during Python script execution');
//         });
//         pythonProcess.on('close', async (code) => {
//           if (code !== 0) {
//             reject(`Python script exited with code ${code}`);
//           } else {
//             try {
//               const jsonData = JSON.parse(dataString);
//               // CSV 형식으로 정제된 데이터 저장
//               const csv = Papa.unparse(jsonData[0].filtered_data);
//               // 업로드된 파일명을 기반으로 정제된 파일명 생성
//               const originalFileNameWithoutExtension = path.basename(file.originalname, path.extname(file.originalname));
//               const filteredDataFilePath = path.join(__dirname, '../OutlierFile', `${originalFileNameWithoutExtension}.csv`);
//               await fs.writeFile(filteredDataFilePath, csv);
//               const newFileMetadata = new ThresholdMetadata({
//                 uploadId,
//                 filePath: filteredDataFilePath,
//                 fileName: `${originalFileNameWithoutExtension}-filtered.csv` // 정제된 파일명 설정
//               });
//               await newFileMetadata.save();
//               resolve(jsonData);
//             } catch (error) {
//               reject(`Error parsing JSON output from Python script: ${error}`);
//             }
//           }
//         });
//       });
//     }));
//     res.json({ uploadId, files: results });
//   } catch (error) {
//     console.error('An error occurred:', error);
//     res.status(500).send('Internal Server Error');
//   }
// });

// // 업로드된 파일 데이터 다운로드
// router.get('/download-filtered-data', async (req, res) => {
//   const { uploadId } = req.query;
//   try {
//     const fileMetadatas = await ThresholdMetadata.find({ uploadId });
//     if (!fileMetadatas || fileMetadatas.length === 0) {
//       return res.status(404).send('No files found for this upload ID.');
//     }
//     const archive = archiver('zip', { zlib: { level: 9 } });
//     archive.on('error', function (err) {
//       res.status(500).send({ error: err.message });
//     });
//     res.setHeader('Content-Type', 'application/zip');
//     res.setHeader('Content-Disposition', `attachment; filename="${uploadId}.zip"`);
//     archive.pipe(res);
//     fileMetadatas.forEach(metadata => {
//       archive.file(metadata.filePath, { name: path.basename(metadata.filePath) });
//     });
//     archive.finalize();
//   } catch (error) {
//     console.error('An error occurred:', error);
//     res.status(500).send('Internal Server Error');
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
//     const dataList = await FileMetadata.find({});
//     // 데이터가 자주 변경되지 않을 경우 캐시 허용 (예: 60초)
//     res.set('Cache-Control', 'public, max-age=60');
//     res.json(dataList);
//   } catch (error) {
//     console.error('Error fetching data list:', error);
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
//     const deletedItem = await FileMetadata.findByIdAndDelete(id);

//     if (!deletedItem) {
//       console.log(`Data with id ${id} not found for deletion.`);
//       return res.status(404).send({ message: 'Data not found' });
//     }

//     console.log(`Data with id ${id} successfully deleted.`);
//     res.send({ message: 'Data successfully removed' });
//   } catch (error) {
//     console.error(`Error removing data with id ${req.params.id}:`, error);
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

// // 클러스터링된 데이터를 제공하는 엔드포인트
// router.post('/clustered-data', async (req, res) => {
//   const { dwNumber, k } = req.body;

//   try {
//     if (typeof k !== 'number' || k <= 0) {
//       return res.status(400).json({ message: 'k는 양의 정수이며 데이터 포인트 수보다 작아야 합니다.' });
//     }

//     const files = await FileMetadata.find({ "numbering.dwNumber": dwNumber });

//     if (!files || files.length === 0) {
//       return res.status(404).json({ message: '입력한 DW 번호에 해당하는 데이터가 없습니다.' });
//     }

//     // 클러스터링에 사용될 데이터를 추출 및 필터링하고 dieNumber 값이 있는지 확인
//     const dataForClustering = files.map(file => ({
//       median: file.boxplotStats.median,
//       dieNumber: file.numbering.dieNumber,
//     })).filter(item => {
//       const isValidMedian = !isNaN(parseFloat(item.median));
//       const hasDieNumber = item.dieNumber && item.dieNumber.trim() !== '';
//       if (!hasDieNumber) {
//         console.log(`Die number missing for median: ${item.median}`);
//       }
//       return isValidMedian && hasDieNumber;
//     });

//     if (dataForClustering.length === 0) {
//       return res.status(400).json({ message: 'dieNumber에 대한 값이 없습니다.' });
//     }

//     if (k >= dataForClustering.length) {
//       return res.status(400).json({ message: `입력한 k 값 (${k})은 데이터 포인트의 수 (${dataForClustering.length})보다 작아야 합니다.` });
//     }

//     const { clusters, centroids } = await performClustering(dataForClustering, k);

//     const clusteredData = clusters.map((clusterIdx, i) => ({
//       cluster: clusterIdx,
//       median: dataForClustering[i].median,
//       dieNumber: dataForClustering[i].dieNumber,
//     }));

//     res.json({ success: true, data: clusteredData, centroids });
//   } catch (error) {
//     console.error('클러스터링 데이터 조회 중 오류 발생:', error);
//     res.status(500).json({ message: '클러스터링 작업을 수행하는 동안 서버에서 오류가 발생했습니다.' });
//   }
// });

// // cluster dwnumber search endpoint
// router.get('/search-dw', async (req, res) => {
//   const searchQuery = req.query.q;
//   try {
//     if (!searchQuery) {
//       return res.json([]);
//     }

//     const results = await FileMetadata.find({
//       'numbering.dwNumber': { $regex: searchQuery, $options: 'i' }
//     }, 'numbering.dwNumber');

//     // 조회된 결과에서 중복된 dwNumber를 제거
//     const uniqueResults = Array.from(new Set(results.map(result => result.numbering.dwNumber)));

//     // 중복이 제거된 dwNumber 목록을 클라이언트에 반환
//     res.json(uniqueResults.slice(0, 10));
//   } catch (error) {
//     console.error('DW 번호 검색 중 오류 발생:', error);
//     res.status(500).json({ message: '서버에서 DW 번호 검색 중 오류가 발생했습니다.' });
//   }
// });

// // 다이별 온도 프로필 데이터 제공
// router.get('/die-temperature-profile', async (req, res) => {
//   try {
//     const allData = await FileMetadata.find({});
//     const aggregatedData = {};

//     allData.forEach(entry => {
//       const dieNumber = entry.numbering.dieNumber;
//       console.log(`Processing dieNumber: ${dieNumber}`);
//       if (!aggregatedData[dieNumber]) {
//         aggregatedData[dieNumber] = { min: [], median: [], max: [] };
//       }

//       entry.temperatureData.forEach(data => {
//         aggregatedData[dieNumber].min.push(data.temperature);
//         aggregatedData[dieNumber].median.push(data.temperature);
//         aggregatedData[dieNumber].max.push(data.temperature);
//       });
//     });

//     const result = Object.keys(aggregatedData).map(dieNumber => {
//       const min = Math.min(...aggregatedData[dieNumber].min);
//       const median = aggregatedData[dieNumber].median.sort((a, b) => a - b)[Math.floor(aggregatedData[dieNumber].median.length / 2)];
//       const max = Math.max(...aggregatedData[dieNumber].max);

//       return { dieNumber, min, median, max };
//     });

//     res.json(result);
//   } catch (error) {
//     console.error('Error fetching die temperature profile:', error);
//     res.status(500).send('Internal server error');
//   }
// });

// module.exports = router;

// ```
// ```
// // server\models\ThresholdFileMetadata.js

// const mongoose = require('mongoose');

// // 스키마 정의
// const ThresholdMetadataSchema = new mongoose.Schema({
//   fileName: {
//     type: String,
//     required: true
//   },
//   uploadDate: {
//     type: Date,
//     default: Date.now
//   },
//   uploadId: {
//     type: String,
//     required: true
//   },
//   temperatureData: [{
//     date: String,
//     time: String,
//     temperature: Number
//   }],
//   filePath: {
//     type: String,
//     required: true
//   }
// });

// // 모델 생성
// const ThresholdMetadata = mongoose.model('ThresholdMetadata', ThresholdMetadataSchema);

// module.exports = ThresholdMetadata;

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
//             // Math.floor(moment(item.time, 'HH:mm:ss').seconds() / 15) * 15
//             moment(item.time, 'HH:mm:ss').seconds()
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
// // server/utils/performClustering.js

// const { kmeans } = require('ml-kmeans');

// /**
//  * 데이터를 클러스터링하는 함수.
//  * @param {Array} data - 클러스터링할 데이터 배열. 각 요소는 {median, dieNumber} 형태의 객체.
//  * @param {number} k - 클러스터의 수.
//  */

// const performClustering = (data, k) => {
//   const points = data.map(item => [item.median, parseFloat(item.dieNumber)]);
//   const result = kmeans(points, k);

//   // centroids 배열의 구조를 확인하여 올바르게 접근
//   const centroids = result.centroids.map(centroid => ({
//     x: centroid[0], // 각 중심점의 첫 번째 요소를 x 좌표로 사용
//     y: centroid[1], // 각 중심점의 두 번째 요소를 y 좌표로 사용
//   }));

//   return {
//     clusters: result.clusters,
//     centroids: centroids,
//   };
// };

// module.exports = performClustering;
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

// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ 
//   limit: '50mb',
//   extended: true 
// }));

// app.use(cors());
// app.use(morgan('dev'));

// connectDB();

// app.use('/api', fileRoutes);

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// ```
// ```
// # server\utils\thresholdProcess.py

// import sys
// import pandas as pd
// import json

// def thresholdProcess(file_path):
//     data = pd.read_csv(file_path, encoding='utf-8')
//     median_temperature = data['temperature'].median()
//     threshold = data['temperature'].quantile(0.25)
//     filtered_data = data[data['temperature'] >= threshold]
//     median_filtered = filtered_data['temperature'].median()

//     result = {
//         'file_path': file_path,
//         'threshold': threshold,
//         'outliers_detected': len(data) - len(filtered_data),
//         'median_before': median_temperature,
//         'median_after': median_filtered,
//         'filtered_data': filtered_data.to_dict(orient='records')
//     }

//     return result

// if __name__ == '__main__':
//     file_paths = sys.argv[1:]
//     results = [thresholdProcess(file_path) for file_path in file_paths]
//     print(json.dumps(results, ensure_ascii=False))

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
