import React, { useState, useEffect, useCallback, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';
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
  initialStartTime,
  initialEndTime,
  setBoxplotStats
}) => {
  const { startTime, endTime, handleBrushChange } = useLineGraphData(averagedData, initialStartTime, initialEndTime, setBoxplotStats);
  const [chartSize, setChartSize] = useState({ width: 600 });
  const [medianValue, setMedianValue] = useState(0);
  const plotRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const maxWidth = 1145;
      const calculatedWidth = window.innerWidth <= maxWidth ? window.innerWidth * 0.9 : Math.min(window.innerWidth * 0.6, 950);

      setChartSize({
        width: Math.min(calculatedWidth, 950)
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  useEffect(() => {
    if (averagedData.length > 0) {
      const times = averagedData.map(item => item.time);
      const temperatures = averagedData.map(item => item.temperature);

      const data = [
        {
          x: times,
          y: temperatures,
          type: 'scatter',
          mode: 'lines',
          name: 'Temperature',
        },
        {
          x: times,
          y: Array(times.length).fill(medianValue),
          type: 'scatter',
          mode: 'lines',
          name: 'Median',
          line: { dash: 'dash', color: 'red' },
        },
      ];

      const layout = {
        title: 'Temperature Over Time',
        xaxis: {
          title: 'Time',
        },
        yaxis: {
          title: 'Temperature (°C)',
        },
        width: chartSize.width,
        height: '100%',
        showlegend: false,
        paper_bgcolor: '#e2d1c7', // 전체 차트 배경색
        plot_bgcolor: '#e2d1c7', // 플롯 영역 배경색
        margin: {
          l: 60,
          r: 20,
          t: 40,
          b: 80
        },
        shapes: [
          {
            type: 'rect',
            xref: 'x',
            yref: 'paper',
            x0: startTime,
            x1: endTime,
            y0: 0,
            y1: 1,
            fillcolor: '#d3d3d3',
            opacity: 0.5,
            line: {
              width: 0,
            },
          },
        ],
      };

      Plotly.newPlot(plotRef.current, data, layout);
    } 
  }, [averagedData, medianValue, startTime, endTime, chartSize]);

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
      <div ref={plotRef} className={styles['plotly-chart']}></div>
    </div>
  );
});

export default LineGraph;
