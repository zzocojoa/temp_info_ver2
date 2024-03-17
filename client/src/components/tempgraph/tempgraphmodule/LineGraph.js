// client\src\components\tempgraph\tempgraphmodule\LineGraph.js

import React, { useState, useEffect, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Tooltip, Brush, ReferenceLine,
} from 'recharts';
import { useLineGraphData } from './hooks/useLineGraphData';
import { calculateMedian } from '../../../api';
// import useCalculateMedian from './hooks/useCalculateMedian';

import styles from './LineGraph.module.css'

const LineGraph = React.memo(({
  averagedData,
  onDetailsChange,
  countNumber,
  dieNumber,
  wNumber,
  dwNumber,
  onBrushChange,
  initialStartTime,
  initialEndTime,
  setBoxplotStats
}) => {
  const { startTime, endTime, handleBrushChange } = useLineGraphData(averagedData, initialStartTime, initialEndTime, onBrushChange, setBoxplotStats);
  const [chartSize, setChartSize] = useState({ width: 600, height: 300 });
  const [medianValue, setMedianValue] = useState(0);

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
    // 컴포넌트 마운트 시에도 크기 조정
    handleResize();

    // 이벤트 리스너 제거를 통한 메모리 누수 방지
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // useCallback을 사용하여 함수 재생성 방지
  const temperatureFormatter = useCallback((value) => `${value.toFixed(2)}°C`, []);

  // useCalculateMedian 커스텀 훅을 사용하여 중앙값 계산 최적화
  const fetchMedian = useCallback(async (averagedData) => {
    const temperatures = averagedData.map(item => item.temperature);
    try {
      const median = await calculateMedian(temperatures);
      setMedianValue(median);
    } catch (error) {
      console.error('Error calculating median:', error);
      // 에러 처리 로직을 추가하거나, 상태를 업데이트하지 않습니다.
    }
  }, []);

  // 로드된 데이터에 대한 중앙값을 계산합니다.
  useEffect(() => {
    if (averagedData.length > 0) {
      fetchMedian(averagedData);
    }
  }, [averagedData, fetchMedian]);

  return (
    <>
      <div className={styles['lineGrahpWrap']}>
        <div className={styles['textWrap']}>
          <div className={styles['textContainer']}>
            <div className={styles['NumberWrap']}>
              <div className={styles['ExWrap']}>
                <span className={styles['ExNumber']}>C_Number</span>
                <input
                  pattern='\d+'
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
                  pattern='\d+'
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
                  pattern='\d+'
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
                  pattern='\d+'
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
          />
          <YAxis domain={['auto', 'auto']}
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
});

export default LineGraph;
