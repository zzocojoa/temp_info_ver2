// src\components\LineGraph.js

import React, { useState, useEffect } from 'react';
import {
  Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, Brush
} from 'recharts';
import styles from './LineGraph.module.css'

function LineGraph({ averagedData, wNumber, dwNumber, dieNumber, onDetailsChange, onBrushChange }) {
  const [chartSize, setChartSize] = useState({ width: 500, height: 300 });

  useEffect(() => {
    const handleResize = () => {
      // 예: 창 너비의 80%를 그래프의 너비로 설정
      setChartSize({
        width: window.innerWidth * 0.5,
        height: 400 // 높이는 고정값 또는 비율로 조정 가능
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // 컴포넌트 마운트 시에도 크기 조정

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleBrush = (e) => {
    // Brush 컴포넌트에서 제공하는 startIndex와 endIndex를 사용하여 선택된 데이터 범위 캡처
    if (e && e.startIndex !== undefined && e.endIndex !== undefined) {
      // 선택된 데이터의 범위를 onBrushChange를 통해 상위 컴포넌트로 전달
      onBrushChange(e.startIndex, e.endIndex);
    }
  };

  return (
    <>
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
      <LineChart
        width={chartSize.width}
        height={chartSize.height}
        data={averagedData}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
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

