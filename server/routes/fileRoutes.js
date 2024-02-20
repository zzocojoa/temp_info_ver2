// server\routes\fileRoutes.js

const path = require('path');
const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const router = express.Router();
const Papa = require('papaparse');
const FileMetadata = require('../models/FileMetadata');
const processData = require('../utils/refining');


// 파일 업로드 미들웨어 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, file.originalname)
});

const upload = multer({ storage: storage });

// 파일 업로드 처리
router.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // 파일 경로
  const filePath = req.file.path;
  let allData = [];

  try {
    // 파일 읽기 및 파싱
    const fileContent = await fs.readFile(filePath, 'utf8');
    Papa.parse(fileContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      step: (row) => {
        const { '[Date]': date, '[Time]': time, '[Temperature]': temperature } = row.data;
        allData.push({ date, time, temperature });
      }
    });

    // 데이터 정제 processData
    const { averagedData, boxplotStats } = processData(allData);
    // console.log(averagedData);

    res.json({ success: true, message: 'File processed successfully', data: averagedData, boxplotStats });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).send('Error processing file');
  } finally {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }
});

// 데이터 저장 처리
router.post('/save', async (req, res) => {
  const { fileName, graphData, boxPlotData, numbering, filedate, selectedRange, additionalInfo } = req.body;
  try {
    const newFileMetadata = new FileMetadata({
      fileName,
      temperatureData: graphData,
      boxplotStats: boxPlotData,
      numbering: numbering,
      filedate: filedate,
      selectedRange: selectedRange,
      additionalInfo: additionalInfo, // 클라이언트에서 받은 추가 정보 저장
    });
    await newFileMetadata.save();

    res.json({ message: 'Data saved successfully', data: newFileMetadata });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).send('Error saving data');
  }
});

// 데이터 리스트 조회 
router.get('/data-list', async (req, res) => {
  try {
    const dataList = await FileMetadata.find({}); // 모든 데이터 리스트 조회
    // console.log(dataList); // 콘솔에 조회된 데이터 리스트 출력
    res.json(dataList); // 클라이언트에 데이터 리스트 응답
  } catch (error) {
    console.error('Error fetching data list:', error); // 에러 로깅
    res.status(500).send('Error fetching data list');
  }
});

// 특정 데이터 항목의 상세 정보 조회
router.get('/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const dataItem = await FileMetadata.findById(id);
    if (!dataItem) {
      // 데이터가 존재하지 않을 때 JSON 형식의 응답 반환
      return res.status(404).json({ message: 'Data not found' });
    }
    res.json(dataItem);
  } catch (error) {
    // 서버 오류 처리
    console.error('Error fetching data item:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// 특정 데이터 항목의 상세 정보 삭제
router.delete('/data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await FileMetadata.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Data not found' });
    }
    res.json({ message: 'Data successfully removed' });
  } catch (error) {
    console.error('Error removing data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
