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

    // 데이터 정제
    const { averagedData, boxplotStats } = processData(allData);
    // console.log(averagedData);

    // 클라이언트에 정제된 데이터 전송
    res.json({ success: true, message: 'File processed successfully', data: averagedData, boxplotStats });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).send('Error processing file');
  } finally {
    // 임시 파일 삭제
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  }
});

// 데이터 저장 처리
router.post('/save', async (req, res) => {
  const { fileName, data } = req.body; // 클라이언트로부터 받은 데이터

  try {
    // 데이터를 MongoDB에 저장
    const newFileMetadata = new FileMetadata({
      fileName: fileName,
      // 데이터 추가 필요
    });
    await newFileMetadata.save();
    res.json({ message: 'Data saved successfully', data: newFileMetadata });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).send('Error saving data');
  }
});

module.exports = router;
