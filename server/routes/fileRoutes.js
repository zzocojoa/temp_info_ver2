// server\routes\fileRoutes.js

const fs = require('fs').promises;
const express = require('express');
const multer = require('multer');
const router = express.Router();
const Papa = require('papaparse');
const path = require('path');
const FileMetadata = require('../models/FileMetadata');
const ThresholdMetadata = require('../models/ThresholdFileMetadata');
const processData = require('../utils/refining');
const plcrefining = require('../utils/plc_refining');
const calculateMedian = require('../utils/calculateMedian');
const processFilteredData = require('../utils/filteredDataProcessor');
const calculateBoxplotStats = require('../utils/boxplotStats');
const performClustering = require('../utils/performClustering');
const { v4: uuidv4 } = require('uuid');
const { spawn } = require('child_process');
const archiver = require('archiver');

// 파일 업로드 미들웨어 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, file.originalname)
});
// 정적 파일 제공을 위한 미들웨어
router.use('/files', express.static(path.join(__dirname, '../uploads')));

const upload = multer({ storage: storage });

// 파일 업로드 처리
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  const filePath = req.file.path;
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    let allData = [];
    Papa.parse(fileContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      step: (row) => {
        const { '[Date]': date, '[Time]': time, '[Temperature]': temperature } = row.data;
        allData.push({ date, time, temperature });
      }
    });

    const { averagedData, boxplotStats } = processData(allData);
    res.json({ success: true, message: 'File processed successfully', data: averagedData, boxplotStats });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).send('Error processing file');
  } finally {
    await fs.unlink(filePath);
  }
});

// PLC 파일 업로드 및 처리 엔드포인트
router.post('/upload-plc', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  const filePath = req.file.path;
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    let allData = [];
    Papa.parse(fileContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      step: (row) => {
        allData.push(row.data);
      }
    });

    const { processedData } = plcrefining(allData);
    res.json({ success: true, message: 'File processed successfully', data: processedData });
  } catch (error) {
    console.error('Error processing PLC file:', error);
    res.status(500).json({ success: false, message: 'Error processing PLC file', error: error.toString() });
  } finally {
    await fs.unlink(filePath);
  }
});

// 정제된 파일 업로드 처리 엔드포인트 (다중 파일 지원)
router.post('/upload-csv', upload.array('files'), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files uploaded.');
  }

  const uploadResults = await Promise.all(req.files.map(async (file) => {
    const filePath = file.path;
    const fileName = file.originalname;

    const match = fileName.match(/(\d{4}-\d{2}-\d2})-(\d+)_(\d+)_(\d+)_(\d+)\.csv/);
    if (!match) {
      await fs.unlink(filePath);
      return { fileName, error: 'Invalid file name format.' };
    }

    const [, filedate, countNumber, wNumber, dwNumber, dieNumber] = match;

    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      return new Promise((resolve, reject) => {
        Papa.parse(fileContent, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: async (result) => {
            const temperatureValues = result.data;

            // 시작 시간과 종료 시간 추출
            const times = temperatureValues.map(entry => entry.time).sort();
            const startTime = times[0];
            const endTime = times[times.length - 1];

            const boxplotStats = calculateBoxplotStats(temperatureValues);
            console.log("boxplotStats: ", boxplotStats)
            const newFileMetadata = new FileMetadata({
              fileName,
              temperatureData: result.data,  // 온도 데이터 저장
              boxplotStats,  // 박스플롯 통계 저장
              numbering: { countNumber, wNumber, dwNumber, dieNumber },
              filedate,
              startTime,
              endTime,
            });
            await newFileMetadata.save();
            resolve({ fileName, message: 'File uploaded and data saved successfully', boxplotStats, startTime, endTime });
          },
          error: (error) => {
            reject(error.message);
          }
        });
      });
    } catch (error) {
      console.error('Error processing file:', error);
      return { fileName, error: error.toString() };
    } finally {
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  }));

  res.json(uploadResults);
});

// PLC 파일 처리 로직 수정
router.post('/upload-csv', upload.array('files'), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files uploaded.');
  }

  const uploadResults = await Promise.all(req.files.map(async (file) => {
    const filePath = file.path;
    const fileName = file.originalname;

    // 날짜 형식 정규 표현식 수정
    const match = fileName.match(/(\d{4}-\d{2}-\d{2})-(\d+)\.csv/); 
    if (!match) {
      await fs.unlink(filePath);
      return { fileName, error: 'Invalid file name format.' };
    }

    const [, filedate, countNumber] = match;

    try {
      const fileContent = await fs.readFile(filePath, 'utf8');
      return new Promise((resolve, reject) => {
        Papa.parse(fileContent, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: async (result) => {
            try {
              const { pressures } = preprocessPLCData(result.data); // PLC 데이터 처리

              // 시작 시간과 종료 시간 추출
              const times = pressures.map(entry => entry.time).sort();
              const startTime = times[0];
              const endTime = times[times.length - 1];

              // FileMetadata에 PLC 데이터 저장
              const newFileMetadata = new FileMetadata({
                fileName,
                plcData: pressures,  // PLC 데이터 저장
                numbering: { countNumber },
                filedate,
                startTime,
                endTime,
              });
              await newFileMetadata.save();
              resolve({ fileName, message: 'PLC file uploaded and data saved successfully', startTime, endTime });
            } catch (error) {
              console.error('Error saving file metadata:', error);
              reject(error.message);
            }
          },
          error: (error) => {
            console.error('Error parsing file:', error);
            reject(error.message);
          }
        });
      });
    } catch (error) {
      console.error('Error processing file:', error);
      return { fileName, error: error.toString() };
    } finally {
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
  }));

  res.json(uploadResults);
});

// boxplot dynamic data
router.post('/process-filtered-data', async (req, res) => {
  const { filteredData } = req.body;
  // 초기 데이터 확인
  // console.log("filteredData: ", filteredData); 

  // 데이터 유효성 검사를 추가하여 디버깅에 도움을 줍니다.
  if (!filteredData || !Array.isArray(filteredData) || filteredData.length === 0) {
    console.error('Invalid or empty filtered data:', filteredData);
    return res.status(400).json({ success: false, message: 'Invalid or empty filtered data' });
  }

  try {
    const { boxplotStats } = processData(filteredData);
    // 결과 데이터 확인
    // console.log("boxplotStats: ", boxplotStats); 
    res.json({ success: true, message: 'Filtered data processed successfully', boxplotStats });
  } catch (error) {
    console.error('Error processing filtered data:', error);
    res.status(500).send('Error processing filtered data');
  }
});


// 정제된 파일 업로드 처리 엔드포인트 (다중 파일 지원)
router.post('/threshold-upload', upload.array('files'), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files uploaded.');
  }
  const uploadId = uuidv4();
  try {
    const results = await Promise.all(req.files.map(async (file) => {
      const filePath = path.join(__dirname, '../uploads', file.filename);
      const pythonProcess = spawn('python', [path.join(__dirname, '../utils/thresholdProcess.py'), filePath]);
      let dataString = '';
      pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
      });
      return new Promise((resolve, reject) => {
        pythonProcess.stderr.on('data', (data) => {
          console.error(`stderr: ${data}`);
          reject('Server error during Python script execution');
        });
        pythonProcess.on('close', async (code) => {
          if (code !== 0) {
            reject(`Python script exited with code ${code}`);
          } else {
            try {
              const jsonData = JSON.parse(dataString);
              // CSV 형식으로 정제된 데이터 저장
              const csv = Papa.unparse(jsonData[0].filtered_data);
              // 업로드된 파일명을 기반으로 정제된 파일명 생성
              const originalFileNameWithoutExtension = path.basename(file.originalname, path.extname(file.originalname));
              const filteredDataFilePath = path.join(__dirname, '../OutlierFile', `${originalFileNameWithoutExtension}.csv`);
              await fs.writeFile(filteredDataFilePath, csv);
              const newFileMetadata = new ThresholdMetadata({
                uploadId,
                filePath: filteredDataFilePath,
                fileName: `${originalFileNameWithoutExtension}-filtered.csv` // 정제된 파일명 설정
              });
              await newFileMetadata.save();
              resolve(jsonData);
            } catch (error) {
              reject(`Error parsing JSON output from Python script: ${error}`);
            }
          }
        });
      });
    }));
    res.json({ uploadId, files: results });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('Internal Server Error');
  }
});


// 업로드된 파일 데이터 다운로드
router.get('/download-filtered-data', async (req, res) => {
  const { uploadId } = req.query;
  try {
    const fileMetadatas = await ThresholdMetadata.find({ uploadId });
    if (!fileMetadatas || fileMetadatas.length === 0) {
      return res.status(404).send('No files found for this upload ID.');
    }
    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', function (err) {
      res.status(500).send({ error: err.message });
    });
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${uploadId}.zip"`);
    archive.pipe(res);
    fileMetadatas.forEach(metadata => {
      archive.file(metadata.filePath, { name: path.basename(metadata.filePath) });
    });
    archive.finalize();
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('Internal Server Error');
  }
});

// 필터링된 데이터 처리 및 중앙값 계산 엔드포인트
router.post('/filtered-linegraph-data', async (req, res) => {
  const { data, startTime, endTime } = req.body; // newStartTime, newEndTime 추가
  // console.log('Data received for filtering:', { data, startTime, endTime });

  try {
    const { filteredData, median } = processFilteredData(data, startTime, endTime); // newStartTime, newEndTime 전달
    // console.log('Filtered data:', filteredData);
    res.json({ success: true, filteredData, median });
  } catch (error) {
    console.error('Error processing filtered data:', error);
    res.status(500).send('Error processing filtered data');
  }
});

// 데이터 저장 처리
router.post('/save', async (req, res) => {
  const { fileName, graphData, boxPlotData, plcData, plcFileName, numbering, filedate, userInput, startTime, endTime } = req.body;
  try {
    const newFileMetadata = new FileMetadata({
      fileName,
      temperatureData: graphData,
      plcData: plcData, // PLC 데이터 추가
      boxplotStats: boxPlotData,
      plcFileName, // PLC 파일명 추가
      plcUploadDate: plcData ? new Date() : null, // PLC 데이터가 있을 경우 현재 날짜 저장
      numbering: numbering,
      filedate,
      userInput,
      startTime,
      endTime,
    });
    await newFileMetadata.save();
    res.json({ message: 'Data saved successfully', data: newFileMetadata });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).send('Error saving data');
  }
});

// 특정 데이터 항목의 상세 정보 업데이트
router.patch('/data/:id', async (req, res) => {
  const { id } = req.params;
  const { userInput } = req.body; // 요청 본문에서 수정된 userInput 값을 받기
  try {
    // findByIdAndUpdate 메서드를 사용하여 해당 ID의 문서를 찾고, userInput 필드를 업데이트
    const updatedItem = await FileMetadata.findByIdAndUpdate(id, { $set: { userInput: userInput } }, { new: true });

    if (!updatedItem) {
      return res.status(404).send('Data not found');
    }
    res.json({ message: 'Data updated successfully', data: updatedItem });
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).send('Error updating data');
  }
});

// 데이터 리스트 조회 
router.get('/data-list', async (req, res) => {
  try {
    const dataList = await FileMetadata.find({});
    // 데이터가 자주 변경되지 않을 경우 캐시 허용 (예: 60초)
    res.set('Cache-Control', 'public, max-age=60');
    res.json(dataList);
  } catch (error) {
    console.error('Error fetching data list:', error);
    res.status(500).send('Error fetching data list');
  }
});

// 특정 데이터 항목의 상세 정보 조회
router.get('/data/:id', async (req, res) => {
  const { id } = req.params;
  const { userInput } = req.body;
  try {
    const dataItem = await FileMetadata.findByIdAndUpdate(id, { $set: { userInput } }, { new: true });
    if (!dataItem) {
      return res.status(404).send('Data not found');
    }
    res.json(dataItem);
  } catch (error) {
    console.error('Error fetching data item:', error);
    res.status(500).send('Server error');
  }
});

// 특정 데이터 항목의 상세 정보 삭제
router.delete('/data/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const deletedItem = await FileMetadata.findByIdAndDelete(id);

    if (!deletedItem) {
      // console.log(`Data with id ${id} not found for deletion.`);
      return res.status(404).send({ message: 'Data not found' });
    }

    // console.log(`Data with id ${id} successfully deleted.`);
    res.send({ message: 'Data successfully removed' });
  } catch (error) {
    console.error(`Error removing data with id ${req.params.id}:`, error);
    res.status(500).send('Internal server error');
  }
});

// CSV 변환을 위한 함수
const objectToCsv = (data) => {
  const csvRows = data.map(item => {
    const { userInput, numbering, boxplotStats } = item;
    return `"${userInput}","${numbering.wNumber}","${numbering.dwNumber}","${numbering.dieNumber}","${boxplotStats.median}"`;
  });
  return `userInput,wNumber,dwNumber,dieNumber,median\n${csvRows.join("\n")}`;
};

// 선택된 데이터를 CSV로 변환하여 반환하는 엔드포인트
router.post('/export-csv', async (req, res) => {
  const { ids } = req.body; // 클라이언트에서 전송한 데이터 ID 배열
  try {
    const data = await FileMetadata.find({ '_id': { $in: ids } });
    if (!data.length) {
      return res.status(404).send('Data not found');
    }
    const csvData = objectToCsv(data);
    res.header('Content-Type', 'text/csv');
    res.attachment('exported_data.csv');
    return res.send(csvData);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    return res.status(500).send('Internal Server Error');
  }
});

// 중앙값 계산 엔드포인트
router.post('/calculate-median', (req, res) => {
  const { data } = req.body; // 클라이언트에서 전송한 데이터 배열
  if (!Array.isArray(data)) {
    return res.status(400).json({ message: 'Invalid data format' });
  }
  try {
    const median = calculateMedian(data);
    res.json({ success: true, median });
  } catch (error) {
    console.error('Error calculating median:', error);
    res.status(500).json({ message: 'Error calculating median' });
  }
});

// 클러스터링된 데이터를 제공하는 엔드포인트
router.post('/clustered-data', async (req, res) => {
  const { dwNumber, k } = req.body;

  try {
    if (typeof k !== 'number' || k <= 0) {
      return res.status(400).json({ message: 'k는 양의 정수이며 데이터 포인트 수보다 작아야 합니다.' });
    }

    const files = await FileMetadata.find({ "numbering.dwNumber": dwNumber });

    if (!files || files.length === 0) {
      return res.status(404).json({ message: '입력한 DW 번호에 해당하는 데이터가 없습니다.' });
    }

    // 클러스터링에 사용될 데이터를 추출 및 필터링하고 dieNumber 값이 있는지 확인
    const dataForClustering = files.map(file => ({
      median: file.boxplotStats.median,
      dieNumber: file.numbering.dieNumber,
    })).filter(item => {
      const isValidMedian = !isNaN(parseFloat(item.median));
      const hasDieNumber = item.dieNumber && item.dieNumber.trim() !== '';
      if (!hasDieNumber) {
        console.log(`Die number missing for median: ${item.median}`);
      }
      return isValidMedian && hasDieNumber;
    });

    if (dataForClustering.length === 0) {
      return res.status(400).json({ message: 'dieNumber에 대한 값이 없습니다.' });
    }

    if (k >= dataForClustering.length) {
      return res.status(400).json({ message: `입력한 k 값 (${k})은 데이터 포인트의 수 (${dataForClustering.length})보다 작아야 합니다.` });
    }

    const { clusters, centroids } = await performClustering(dataForClustering, k);

    const clusteredData = clusters.map((clusterIdx, i) => ({
      cluster: clusterIdx,
      median: dataForClustering[i].median,
      dieNumber: dataForClustering[i].dieNumber,
    }));

    res.json({ success: true, data: clusteredData, centroids });
  } catch (error) {
    console.error('클러스터링 데이터 조회 중 오류 발생:', error);
    res.status(500).json({ message: '클러스터링 작업을 수행하는 동안 서버에서 오류가 발생했습니다.' });
  }
});

// cluster dwnumber search endpoint
router.get('/search-dw', async (req, res) => {
  const searchQuery = req.query.q;
  try {
    if (!searchQuery) {
      return res.json([]);
    }

    const results = await FileMetadata.find({
      'numbering.dwNumber': { $regex: searchQuery, $options: 'i' }
    }, 'numbering.dwNumber');

    // 조회된 결과에서 중복된 dwNumber를 제거
    const uniqueResults = Array.from(new Set(results.map(result => result.numbering.dwNumber)));

    // 중복이 제거된 dwNumber 목록을 클라이언트에 반환
    res.json(uniqueResults.slice(0, 10));
  } catch (error) {
    console.error('DW 번호 검색 중 오류 발생:', error);
    res.status(500).json({ message: '서버에서 DW 번호 검색 중 오류가 발생했습니다.' });
  }
});

// 다이별 온도 프로필 데이터 제공
router.get('/die-temperature-profile', async (req, res) => {
  try {
    const allData = await FileMetadata.find({});
    const aggregatedData = {};

    allData.forEach(entry => {
      const dieNumber = entry.numbering.dieNumber;
      console.log(`Processing dieNumber: ${dieNumber}`);
      if (!aggregatedData[dieNumber]) {
        aggregatedData[dieNumber] = { min: [], median: [], max: [] };
      }

      entry.temperatureData.forEach(data => {
        aggregatedData[dieNumber].min.push(data.temperature);
        aggregatedData[dieNumber].median.push(data.temperature);
        aggregatedData[dieNumber].max.push(data.temperature);
      });
    });

    const result = Object.keys(aggregatedData).map(dieNumber => {
      const min = Math.min(...aggregatedData[dieNumber].min);
      const median = aggregatedData[dieNumber].median.sort((a, b) => a - b)[Math.floor(aggregatedData[dieNumber].median.length / 2)];
      const max = Math.max(...aggregatedData[dieNumber].max);

      return { dieNumber, min, median, max };
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching die temperature profile:', error);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
