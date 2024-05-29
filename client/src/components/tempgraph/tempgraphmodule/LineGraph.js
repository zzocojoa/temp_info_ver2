import React, { useState, useEffect, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Tooltip, Brush, ReferenceLine,
} from 'recharts';
import { useLineGraphData } from './hooks/useLineGraphData';
import { calculateMedian } from '../../../api';
import styles from './LineGraph.module.css';

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
      const maxWidth = 1145;
      const calculatedWidth = window.innerWidth <= maxWidth ? window.innerWidth * 0.9 : Math.min(window.innerWidth * 0.6, 1000);
  
      setChartSize({
        width: Math.min(calculatedWidth, 1000),
        height: 400
      });
    };
  
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const temperatureFormatter = useCallback((value) => `${value.toFixed(2)}°C`, []);

  const fetchMedian = useCallback(async (averagedData) => {
    const temperatures = averagedData.map(item => item.temperature);
    try {
      const median = await calculateMedian(temperatures);
      setMedianValue(median.median);
    } catch (error) {
      console.error('Error calculating median:', error);
    }
  }, []);

  useEffect(() => {
    if (averagedData.length > 0) {
      fetchMedian(averagedData);
    }
  }, [averagedData, fetchMedian]);

  return (
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
        <XAxis dataKey="time" />
        <YAxis domain={['auto', 'auto']} />
        <Legend />
        <Line
          type="monotone"
          dataKey="temperature"
          stroke="#8884d8"
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Brush
          dataKey="time"
          height={30}
          stroke="#8884d8"
          onChange={handleBrushChange}
        />
        <ReferenceLine y={medianValue} label="Median" stroke="red" strokeDasharray="3 3" />
      </LineChart>
    </div>
  );
});

export default LineGraph;
