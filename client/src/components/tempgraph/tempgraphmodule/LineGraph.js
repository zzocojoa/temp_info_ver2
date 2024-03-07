// src\components\LineGraph.js

import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Tooltip, Brush, ReferenceLine,
} from 'recharts';
import { sendFilteredData } from '../../../api';
import styles from './LineGraph.module.css'

function LineGraph({
  averagedData, onDetailsChange,
  countNumber, dieNumber, wNumber, dwNumber,
  onBrushChange, initialStartTime, initialEndTime, setBoxplotStats
}) {
  const [startTime, setStartTime] = useState(initialStartTime || '');
  const [endTime, setEndTime] = useState(initialEndTime || '');
  const [chartSize, setChartSize] = useState({ width: 600, height: 300 });

  // 그래프 반응형 로직
  useEffect(() => {
    const handleResize = () => {
      // 창 너비가 1145px 이하일 때는 window.innerWidth * 0.9, 그렇지 않으면 1000을 width로 사용
      const maxWidth = 1145;
      const calculatedWidth = window.innerWidth <= maxWidth ? window.innerWidth * 0.9 : Math.min(window.innerWidth * 0.6, 1000);
  
      setChartSize({
        // 최대 너비를 1000으로 제한하되, 창 너비가 1145px 이하일 경우는 90%를 적용
        width: Math.min(calculatedWidth, 1000),
        height: 400
      });
    };
  
    window.addEventListener('resize', handleResize);
    handleResize(); // 컴포넌트 마운트 시에도 크기 조정
  
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setStartTime(initialStartTime);
    setEndTime(initialEndTime);
  }, [initialStartTime, initialEndTime]);

  const handleBrushChange = async (e) => {
    if (!e) {
      const startIndex = 0;
      const endIndex = averagedData.length - 1;
      onBrushChange(startIndex, endIndex);
      return;
    }

    const { startIndex, endIndex } = e;
    onBrushChange(startIndex, endIndex);

    if (averagedData[startIndex]?.time && averagedData[endIndex]?.time) {
      const newStartTime = averagedData[startIndex].time;
      const newEndTime = averagedData[endIndex].time;

      setStartTime(newStartTime);
      setEndTime(newEndTime);

      const filteredData = averagedData.slice(startIndex, endIndex + 1);

      try {
        const { boxplotStats } = await sendFilteredData(filteredData); // await 사용하여 비동기 처리
        setBoxplotStats(boxplotStats); // 상태 업데이트
      } catch (error) {
        console.error('필터링된 데이터를 처리하는 중 오류 발생:', error);
      }
    } else {
      console.log('선택된 데이터 범위에 유효한 Time 속성이 없습니다.');
    }
  };

  const temperatureFormatter = (value) => `${value.toFixed(2)}°C`;

  // 중앙값 계산 함수
  const calculateMedian = (data) => {
    const temps = data.map(item => item.temperature).sort((a, b) => a - b);
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
                <span className={styles['ExNumber']}>C_Number</span>
                <input
                  type="text"
                  placeholder="0000"
                  className={styles['ExInfo']}
                  value={countNumber || ''}
                  onChange={(e) => onDetailsChange('countNumber', e.target.value)}
                />
              </div>
              <div className={styles['ExWrap']}>
                <span className={styles['ExNumber']}>W_Number</span>
                <input
                  type="text"
                  placeholder="0000"
                  className={styles['ExInfo']}
                  value={wNumber || ''}
                  onChange={(e) => onDetailsChange('wNumber', e.target.value)}
                />
              </div>
              <div className={styles['ExWrap']}>
                <span className={styles['ExNumber']}>DW_Number</span>
                <input
                  type="text"
                  placeholder="0000"
                  className={styles['ExInfo']}
                  value={dwNumber || ''}
                  onChange={(e) => onDetailsChange('dwNumber', e.target.value)}
                />
              </div>
              <div className={styles['ExWrap']}>
                <span className={styles['ExNumber']}>Die_Number</span>
                <input
                  type="text"
                  placeholder="0000"
                  className={styles['ExInfo']}
                  value={dieNumber || ''}
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
                value={startTime || ''}
                readOnly
              />
            </div>
            <div className={styles['endTimeBox']}>
              <span className={styles['endTimeTitle']}>End Time</span>
              <input
                className={styles['endTimeInput']}
                type="time"
                value={endTime || ''}
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
          <XAxis dataKey="time"
          // label={{ value: '시간', position: 'insideBottomRight', offset: -20 }}
          />
          <YAxis domain={['auto', 'auto']}
          // label={{ value: '온도', angle: -90, position: 'insideLeft' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="temperature"
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
