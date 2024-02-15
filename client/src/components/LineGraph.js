// src\components\LineGraph.js

import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Tooltip, Brush,
} from 'recharts';
import styles from './LineGraph.module.css'

function LineGraph({ averagedData, wNumber, dwNumber, dieNumber, onDetailsChange, onBrushChange }) {
  const [chartSize, setChartSize] = useState({ width: 500, height: 300 });
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [filteredData, setFilteredData] = useState(averagedData);

  // 그래프반응형 로직
  useEffect(() => {
    const handleResize = () => {
      setChartSize({
        width: window.innerWidth * 0.5,
        height: 400
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // 컴포넌트 마운트 시에도 크기 조정

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (startTime && endTime) { // 시작 시간과 끝 시간이 모두 유효한 경우에만 실행
      const filtered = averagedData.filter(item => {
        const itemTime = new Date(`1970/01/01 ${item.Time}`).getTime();
        const startTimeDate = new Date(`1970/01/01 ${startTime}`).getTime();
        const endTimeDate = new Date(`1970/01/01 ${endTime}`).getTime();
        return itemTime >= startTimeDate && itemTime <= endTimeDate;
      });

      if (filtered.length > 0 && (filteredData.length !== filtered.length || filteredData[0].Time !== filtered[0].Time)) {
        setFilteredData(filtered); // 실제로 필요한 경우에만 상태 업데이트
        // 필터링된 데이터의 인덱스 범위를 onBrushChange로 전달
        onBrushChange(averagedData.indexOf(filtered[0]), averagedData.indexOf(filtered[filtered.length - 1]));
      }
    }
  }, [startTime, endTime, averagedData, onBrushChange]);

  const handleBrush = (e) => {
    if (e && e.startIndex !== undefined && e.endIndex !== undefined) {
      onBrushChange(e.startIndex, e.endIndex);
    }
  };

  const temperatureFormatter = (value) => `${value.toFixed(2)}°C`;

  return (
    <>
      <div className={styles['textWrap']}>
        <div className={styles['textContainer']}>
          <div className={styles['timeContaier']}>
            <label>
              <p>Start Time:</p>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </label>
            <label>
              <p>End Time:</p>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </label>
          </div>
          <div className={styles['NumberWrap']}>
            <label>
              <p>W_number:</p>
              <input type="text" value={wNumber} onChange={(e) => onDetailsChange('wNumber', e.target.value)} />
            </label>
            <label>
              <p>DW_number:</p>
              <input type="text" value={dwNumber} onChange={(e) => onDetailsChange('dwNumber', e.target.value)} />
            </label>
            <label>
              <p>Die_number:</p>
              <input type="text" value={dieNumber} onChange={(e) => onDetailsChange('dieNumber', e.target.value)} />
            </label>
          </div>
        </div>
      </div>
      <LineChart
        width={chartSize.width}
        height={chartSize.height}
        data={filteredData}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip formatter={temperatureFormatter} />
        <XAxis dataKey="Time" />
        <YAxis />
        <Legend />
        <Line type="monotone" dataKey="Temperature" stroke="#8884d8" />
        <Brush dataKey="Time" height={30} stroke="#8884d8" onChange={handleBrush} />
      </LineChart>
    </>
  );
}

export default LineGraph;

