// server/models/FileMetadata.js

const mongoose = require('mongoose');

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
    },
    numbering: {
        wNumber: String,
        dwNumber: String,
        dieNumber: String,
    },
    filedate: String,
    userInput: String,
    timeRange: {
        startTime: {
            start:String,
            end:String,
        }
    },
});

const FileMetadata = mongoose.model('FileMetadata', fileMetadataSchema);

module.exports = FileMetadata;

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
  const { fileName, graphData, boxPlotData, numbering, filedate, userInput, timeRange } = req.body;
  console.log("Received timeRange:", timeRange);
  // timeRange가 올바른 형식인지 검사
  if (!timeRange || typeof timeRange.start !== 'string' || typeof timeRange.end !== 'string') {
    return res.status(400).send('Invalid timeRange format');
  }
  try {
    const newFileMetadata = new FileMetadata({
      fileName,
      temperatureData: graphData,
      boxplotStats: boxPlotData,
      numbering: numbering,
      filedate,
      userInput,
      timeRange: {
        startTime: {
          startTime: timeRange.start,
          endTime: timeRange.end
        }
      }
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
  const { id } = req.params;
  const { userInput } = req.body;
  try {
    const dataItem = await FileMetadata.findByIdAndUpdate(id, { $set: { userInput } }, { new: true });
    // console.log("dataItem :", dataItem)
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
    const deletedItem = await FileMetadata.findByIdAndDelete(id); // 데이터 삭제

    if (!deletedItem) {
      return res.status(404).send({ message: 'Data not found' });
    }

    res.send({ message: 'Data successfully removed' }); // 성공 메시지 반환
  } catch (error) {
    console.error('Error removing data:', error);
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

module.exports = router;



// client\src\api.js

const API_BASE_URL = 'http://localhost:5000/api';

// 파일 업로드 API
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  try {
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData,
    });
    const { data: averagedData, boxplotStats } = await response.json();
    return { averagedData, boxplotStats }; // 업로드 결과 반환
  } catch (error) {
    console.error('Error uploading file:', error);
  }
}

// 데이터 저장 API
export async function saveData(data) {
  if (data.timeRange && data.timeRange.start && data.timeRange.end === undefined) {
    data.timeRange = {
      start: data.timeRange.start.startTime, // '18:23:00'
      end: data.timeRange.start.endTime // '19:50:15'
    };
  }
  console.log("data: ", data)
  try {
    const response = await fetch(`${API_BASE_URL}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to save data');
    }
    return await response.json(); // 저장 성공 결과 반환
  } catch (error) {
    console.error('Error saving data:', error);
    throw error; // 에러를 다시 던져 컴포넌트에서 처리할 수 있게 함
  }
}

export async function updateData(id, updatedData) {
  try {
    const response = await fetch(`${API_BASE_URL}/data/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) {
      throw new Error('Data update failed');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
}

// 데이터 리스트 조회
export async function fetchDataList() {
  try {
    const response = await fetch(`${API_BASE_URL}/data-list`);
    if (response.ok) {
      const dataList = await response.json();
      return dataList;
    } else {
      console.error('Failed to fetch data list');
    }
  } catch (error) {
    console.error('Error fetching data list:', error);
  }
}

// 특정 데이터 조회
export async function fetchDataDetails(dataId) {
  try {
    const response = await fetch(`${API_BASE_URL}/data/${dataId}`);
    return response.json(); // 조회된 데이터의 상세 정보 반환
  } catch (error) {
    console.error('Error fetching data details:', error);
  }
}

// 데이터 삭제
export async function deleteData(dataId) {
  console.log("dataId :", dataId)
  const response = await fetch(`${API_BASE_URL}/data/${dataId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return await response.json();
}


// src/components/SaveCsvDataButton.js

import React from 'react';
import styles from './SaveCsvDataButton.module.css'
import { saveData } from '../api';

function SaveCsvDataButton({ data, fileName, onSaveSuccess, selectedRange }) {
  const downloadCsv = (data, fileName) => {
    // numbering 정보가 있는 경우 해당 값을 사용하고, 없는 경우 기본값 사용
    const { wNumber = 'N/A', dwNumber = 'N/A', dieNumber = 'N/A' } = data.numbering || {};
    const graphData = data.graphData;

    // 파일명에서 날짜 추출
    const dateMatch = fileName.match(/\d{4}-\d{2}-\d{2}/);
    const dateFromFileName = dateMatch ? dateMatch[0] : new Date().toISOString().split('T')[0];

    const finalFileName = `${dateFromFileName}_${wNumber}_${dwNumber}_${dieNumber}.csv`;
    console.log("finalFileName :", finalFileName);
    let csvContent = "data:text/csv;charset=utf-8,Date,Time,Temperature\n";

    // graphData가 정의되지 않았을 경우를 처리
    (graphData || []).forEach(row => {
      const { Date, Time, Temperature } = row;
      csvContent += `${Date},${Time},${Temperature}\n`;
    });

    // CSV 파일 다운로드 로직
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', finalFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveData = async () => {
    // const { startTime, endTime } = selectedRange;
    const { start: startTime } = selectedRange;
    try {
      const dateMatch = fileName.match(/\d{4}-\d{2}-\d{2}/);
      const filedate = dateMatch ? dateMatch[0] : new Date().toISOString().split('T')[0]; // 파일명에서 날짜 추출
      const { userInput } = data;
      // console.log("selectedRange: ", selectedRange)

      // console.log("startTime: ", startTime)

      await saveData({ 
        ...data, 
        filedate, 
        userInput,
        timeRange: startTime,
      });
      
      onSaveSuccess();
    } catch (error) {
      alert('Error saving data.');
    }
    downloadCsv(data, fileName);
  };

  return (
    <button className={styles['DownloadBtn']} onClick={handleSaveData}>Download CSV</button>
  );
}

export default SaveCsvDataButton;


// src\components\LineGraph.js

import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Tooltip, Brush, ReferenceLine,
} from 'recharts';
import styles from './LineGraph.module.css'

function LineGraph({ averagedData, wNumber, dwNumber, dieNumber, onDetailsChange, onBrushChange }) {
  const [chartSize, setChartSize] = useState({ width: 600, height: 300 });
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // 그래프 반응형 로직
  useEffect(() => {
    const handleResize = () => {
      setChartSize({
        width: Math.min(window.innerWidth * 0.9, 1000), // 최대 너비를 1000으로 제한
        height: 400
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // 컴포넌트 마운트 시에도 크기 조정

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (startTime && endTime) {
      const findClosestIndex = (time) => {
        return averagedData.findIndex(data => data.Time >= time);
      };

      const startIndex = findClosestIndex(startTime);
      const endIndex = findClosestIndex(endTime);
      if (startIndex !== -1 && endIndex !== -1 && (averagedData[startIndex].Time !== startTime || averagedData[endIndex].Time !== endTime)) {
        onBrushChange(startIndex, endIndex);
      }
    }
  }, [startTime, endTime, onBrushChange, averagedData]);

  // Brush 컴포넌트에서 시간 범위 변경 시 호출될 함수
  const handleBrushChange = (e) => {
    if (!e) return; 

    const { startIndex, endIndex } = e;
    const newStartTime = averagedData[startIndex]?.Time;
    const newEndTime = averagedData[endIndex]?.Time;

    if (newStartTime && newEndTime) {
      setStartTime(newStartTime);
      setEndTime(newEndTime);
      // onBrushChange 콜백에 { start, end } 형태로 전달합니다.
      onBrushChange({ start: newStartTime, end: newEndTime });
      console.log("newStartTime: ", newStartTime)
    }
  };

  // 입력 필드 변경 처리 로직
  const handleTimeChange = (type, value) => {
    if (type === 'start' && value !== startTime) {
      setStartTime(value);
    } else if (type === 'end' && value !== endTime) {
      setEndTime(value);
    }
  };

  const temperatureFormatter = (value) => `${value.toFixed(2)}°C`;

  // 중앙값 계산 함수
  const calculateMedian = (data) => {
    const temps = data.map(item => item.Temperature).sort((a, b) => a - b);
    const mid = Math.floor(temps.length / 2);
    return temps.length % 2 !== 0 ? temps[mid] : (temps[mid - 1] + temps[mid]) / 2;
  };

  const medianValue = calculateMedian(averagedData);

  return (
    <>
      <div className={styles['lineGrahpWrap']}>
        <div className={styles['textWrap']}>
          <div className={styles['textContainer']}>
            <div className={styles['NumberWrap']}>
              <div className={styles['ExWrap']}>
                <span className={styles['ExNumber']}>W_Number</span>
                <input
                  type="text"
                  placeholder="0000"
                  className={styles['ExInfo']}
                  value={wNumber}
                  onChange={(e) => onDetailsChange('wNumber', e.target.value)}
                />
              </div>
              <div className={styles['ExWrap']}>
                <span className={styles['ExNumber']}>DW_Number</span>
                <input
                  type="text"
                  placeholder="0000"
                  className={styles['ExInfo']}
                  value={dwNumber}
                  onChange={(e) => onDetailsChange('dwNumber', e.target.value)}
                />
              </div>
              <div className={styles['ExWrap']}>
                <span className={styles['ExNumber']}>Die_Number</span>
                <input
                  type="text"
                  placeholder="0000"
                  className={styles['ExInfo']}
                  value={dieNumber}
                  onChange={(e) => onDetailsChange('dieNumber', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className={styles['timeInputWrap']}>
          <div className={styles['timeInputContainer']}>
            <div className={styles['startTimeBox']}>
              <span className={styles['startTimeTitle']}>Start Time</span>
              <input
                className={styles['startTimeInput']}
                type="time"
                value={startTime}
                onChange={(e) => handleTimeChange('start', e.target.value)}
                readOnly
              />
            </div>
            <div className={styles['endTimeBox']}>
              <span className={styles['endTimeTitle']}>End Time</span>
              <input
                className={styles['endTimeInput']}
                type="time"
                value={endTime}
                onChange={(e) => handleTimeChange('end', e.target.value)}
                readOnly
              />
            </div>
          </div>
        </div>
        <LineChart className={styles['lineChart']}
          width={chartSize.width}
          height={chartSize.height}
          data={averagedData}
          margin={{
            top: 20, right: 45, left: -10, bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip formatter={temperatureFormatter} />
          <XAxis dataKey="Time"
          // label={{ value: '시간', position: 'insideBottomRight', offset: -20 }}
          />
          <YAxis domain={['auto', 'auto']}
          // label={{ value: '온도', angle: -90, position: 'insideLeft' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="Temperature"
            stroke="#8884d8"
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Brush
            dataKey="Time"
            height={30}
            stroke="#8884d8"
            onChange={handleBrushChange}
          />
          <ReferenceLine y={medianValue} label="Median" stroke="red" strokeDasharray="3 3" />
        </LineChart>
      </div>
    </>
  );
}

export default LineGraph;
