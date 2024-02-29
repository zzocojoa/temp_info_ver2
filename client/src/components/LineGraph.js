// src\components\LineGraph.js

import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Tooltip, Brush, ReferenceLine,
} from 'recharts';
import styles from './LineGraph.module.css'

function LineGraph({
  averagedData, onDetailsChange,
  countNumber, dieNumber, wNumber, dwNumber,  
  onBrushChange, initialStartTime, initialEndTime
}) {
  const [chartSize, setChartSize] = useState({ width: 600, height: 300 });
  const [startTime, setStartTime] = useState(initialStartTime || '');
  const [endTime, setEndTime] = useState(initialEndTime || '');

  // 그래프 반응형 로직
  useEffect(() => {
    const handleResize = () => {
      setChartSize({
        // 최대 너비를 1000으로 제한
        width: Math.min(window.innerWidth * 0.9, 1000),
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

  const handleBrushChange = (e) => {
    if (!e) {
      // Brush 이벤트가 없을 경우 초기 시간으로 설정
      // setStartTime(initialStartTime);
      // setEndTime(initialEndTime);
      // 초기 인덱스 값으로 onBrushChange 호출
      const startIndex = 0;
      const endIndex = averagedData.length - 1;
      onBrushChange(startIndex, endIndex);
      return;
    }

    const { startIndex, endIndex } = e;
    // console.log(`Brush event triggered: startIndex = ${startIndex}, endIndex = ${endIndex}`);
    // 변경 사항이 없는 경우도 포함하여 onBrushChange 호출
    onBrushChange(startIndex, endIndex);

    // averagedData의 유효한 인덱스인지 확인하고 Time 속성이 있는지 확인
    if (averagedData[startIndex]?.Time && averagedData[endIndex]?.Time) {
      const newStartTime = averagedData[startIndex].Time;
      const newEndTime = averagedData[endIndex].Time;

      setStartTime(newStartTime);
      setEndTime(newEndTime);
    } else {
      console.log('averagedData에 유효한 Time 속성이 없습니다.');
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
