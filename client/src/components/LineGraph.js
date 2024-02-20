// src\components\LineGraph.js

import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Tooltip, Brush, ReferenceLine,
} from 'recharts';
import styles from './LineGraph.module.css'

function LineGraph({ averagedData, wNumber, dwNumber, dieNumber, onDetailsChange, onBrushChange }) {
  const [chartSize, setChartSize] = useState({ width: 600, height: 300 });

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

  const handleBrush = (e) => {
    if (e && e.startIndex !== undefined && e.endIndex !== undefined) {
      onBrushChange(e.startIndex, e.endIndex);
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
      <div className={styles['textWrap']}>
        <div className={styles['textContainer']}>
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
      <LineChart className={styles['lineChart']}
        width={chartSize.width}
        height={chartSize.height}
        data={averagedData}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
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
          onChange={handleBrush}
        />
        <ReferenceLine y={medianValue} label="Median" stroke="red" strokeDasharray="3 3" />
      </LineChart>
    </>
  );
}

export default LineGraph;