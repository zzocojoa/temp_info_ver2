// client\src\components\tempgraph\tempgraphmodule\LineGraph.js

import React, { useState, useEffect, useRef } from 'react';
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
  onBrushChange,
  initialStartTime,
  initialEndTime,
  setBoxplotStats
}) => {
  const { startTime, endTime, handleBrushChange } = useLineGraphData(averagedData, initialStartTime, initialEndTime, onBrushChange, setBoxplotStats);
  const [medianValue, setMedianValue] = useState(0);
  const plotRef = useRef(null);

  useEffect(() => {
    console.log("averagedData changed:", averagedData);
  }, [averagedData]);

  useEffect(() => {
    console.log("startTime or endTime changed:", { startTime, endTime });
  }, [startTime, endTime]);

  useEffect(() => {
    console.log("medianValue changed:", medianValue);
  }, [medianValue]);

  useEffect(() => {
    const fetchMedian = async () => {
      console.log("Fetching median for data:", averagedData);
      const temperatures = averagedData.map(item => item.temperature);
      try {
        const median = await calculateMedian(temperatures);
        console.log("Median value fetched:", median);
        setMedianValue(median.median);
      } catch (error) {
        console.error('Error calculating median:', error);
      }
    };

    if (averagedData.length > 0) {
      console.log("Averaged data available, fetching median");
      fetchMedian(averagedData);
    }
  }, [averagedData]);

  useEffect(() => {
    if (!averagedData || averagedData.length === 0) {
      if (plotRef.current) {
        Plotly.purge(plotRef.current);
      }
      return;
    }

    const xValues = averagedData.map(d => d.time);

    const temperatureTrace = {
      x: xValues,
      y: averagedData.map(d => d.temperature),
      type: 'scatter',
      mode: 'lines',
      line: { color: '#8884d8' },
      hovertemplate: '%{y:.2f}°C<extra></extra>',
      name: 'Temperature'
    };

    const mainPressureTrace = {
      x: xValues,
      y: averagedData.map(d => d.mainPressure),
      type: 'scatter',
      mode: 'lines',
      line: { color: '#ff7f0e' },
      hovertemplate: '%{y:.2f}<extra></extra>',
      name: 'Main Pressure'
    };

    const containerTempFrontTrace = {
      x: xValues,
      y: averagedData.map(d => d.containerTempFront),
      type: 'scatter',
      mode: 'lines',
      line: { color: '#2ca02c' },
      hovertemplate: '%{y:.2f}<extra></extra>',
      name: 'Container Temp Front'
    };

    const containerTempBackTrace = {
      x: xValues,
      y: averagedData.map(d => d.containerTempBack),
      type: 'scatter',
      mode: 'lines',
      line: { color: '#d62728' },
      hovertemplate: '%{y:.2f}<extra></extra>',
      name: 'Container Temp Back'
    };

    // currentSpeed를 오른쪽 y축(y2)에 표시
    const currentSpeedTrace = {
      x: xValues,
      y: averagedData.map(d => d.currentSpeed),
      type: 'scatter',
      mode: 'lines',
      line: { color: '#9467bd' },
      hovertemplate: '%{y:.2f}<extra></extra>',
      name: 'Current Speed',
      yaxis: 'y2' // currentSpeed는 오른쪽 y축 사용
    };

    const plotData = [
      temperatureTrace,
      mainPressureTrace,
      containerTempFrontTrace,
      containerTempBackTrace,
      currentSpeedTrace
    ];

    const layout = {
      title: 'Temperature Over Time',
      xaxis: { title: 'Time' },
      yaxis: { title: 'Temperature (°C)', autorange: true },
      yaxis2: {
        title: 'Current Speed',
        overlaying: 'y',
        side: 'right',
        showgrid: false,
        autorange: true
      },
      showlegend: true,
      legend: {
        orientation: 'h', // 범주를 가로로 정렬
        x: 0,
        y: 0.97, // 그래프 위쪽에 위치
        xanchor: 'left',
        yanchor: 'bottom'
      },
      paper_bgcolor: '#e2d1c7',
      plot_bgcolor: '#e2d1c7',
      margin: {
        l: 60,
        r: 60, // 오른쪽 여백 확대
        t: 40,
        b: 80
      },
      shapes: [
        {
          type: 'line',
          x0: averagedData[0]?.time,
          x1: averagedData[averagedData.length - 1]?.time,
          y0: medianValue,
          y1: medianValue,
          line: {
            color: 'red',
            width: 2,
            dash: 'dash'
          },
          name: 'Median'
        }
      ],
      dragmode: 'zoom',
      selectdirection: 'h',
      autosize: true,
      responsive: true
    };

    const handleRelayout = (eventdata) => {
      console.log("eventdata:", eventdata);

      if (eventdata['xaxis.range[0]'] && eventdata['xaxis.range[1]']) {
        const startRange = Math.round(eventdata['xaxis.range[0]']);
        const endRange = Math.round(eventdata['xaxis.range[1]']);

        console.log("startRange:", startRange, "endRange:", endRange);

        const startIndex = Math.max(0, startRange);
        const endIndex = Math.min(averagedData.length - 1, endRange);

        console.log("startIndex and endIndex changed:", { startIndex, endIndex });

        if (startIndex !== endIndex) {
          console.log("Brush changed:", { startIndex, endIndex });
          handleBrushChange({ startIndex, endIndex });
        } else {
          console.log("Invalid range selected, indices not found.");
        }
      }
    };

    const lineChartElement = document.getElementById('lineChart');
    if (lineChartElement) {
      Plotly.newPlot(lineChartElement, plotData, layout, { responsive: true });
      lineChartElement.on('plotly_relayout', handleRelayout);

      const resizeObserver = new ResizeObserver(() => {
        Plotly.Plots.resize(lineChartElement);
      });
      resizeObserver.observe(lineChartElement);

      return () => {
        resizeObserver.disconnect();
        Plotly.purge(lineChartElement);
      };
    }
  }, [averagedData, medianValue, handleBrushChange]);

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
                onChange={(e) => {
                  console.log("C_Number changed:", e.target.value);
                  onDetailsChange('countNumber', e.target.value);
                }}
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
                onChange={(e) => {
                  console.log("W_Number changed:", e.target.value);
                  onDetailsChange('wNumber', e.target.value);
                }}
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
                onChange={(e) => {
                  console.log("DW_Number changed:", e.target.value);
                  onDetailsChange('dwNumber', e.target.value);
                }}
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
                onChange={(e) => {
                  console.log("Die_Number changed:", e.target.value);
                  onDetailsChange('dieNumber', e.target.value);
                }}
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
      <div id="lineChart" className={styles['lineChart']} />
    </div>
  );
});

export default LineGraph;
