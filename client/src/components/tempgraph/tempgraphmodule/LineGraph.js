// client/src/components/tempgraph/tempgraphmodule/LineGraph.js

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';
import { useLineGraphData } from './hooks/useLineGraphData';
import { calculateMedian } from '../../../api';
import styles from './LineGraph.module.css';

const LineGraph = React.memo(({
  averagedData = [],
  plcData = [],
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
  const [chartSize, setChartSize] = useState({ width: 600 });
  const [medianValue, setMedianValue] = useState(0);
  const [plcMedianValue, setPlcMedianValue] = useState(0);
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

  const fetchMedian = useCallback(async (data) => {
    if (data && data.length > 0) {
      const temperatures = data.map(item => item.temperature);
      try {
        const median = await calculateMedian(temperatures);
        return median.median;
      } catch (error) {
        console.error('Error calculating median:', error);
        return 0;
      }
    }
    return 0;
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (averagedData.length > 0) {
        const median = await fetchMedian(averagedData);
        setMedianValue(median);
      }
    };
    fetchData();
  }, [averagedData, fetchMedian]);

  useEffect(() => {
    const fetchData = async () => {
      if (plcData.length > 0) {
        const median = await fetchMedian(plcData.map(item => ({ temperature: item.pressure })));
        setPlcMedianValue(median);
      }
    };
    fetchData();
  }, [plcData, fetchMedian]);

  useEffect(() => {
    console.log("averagedData:", averagedData);
    console.log("plcData:", plcData);
    if (plcData.length > 0) {
      console.log("PLC data sample:", plcData[0]);
    }

    if ((averagedData.length > 0 || plcData.length > 0) && plotRef.current) {
      const currentPlotRef = plotRef.current;

      try {
        const plotData = [];

        if (averagedData.length > 0) {
          plotData.push({
            x: averagedData.map(d => d.time),
            y: averagedData.map(d => d.temperature),
            type: 'scatter',
            mode: 'lines',
            line: { color: '#8884d8' },
            hovertemplate: '%{y:.2f}°C<extra></extra>',
            name: 'Temperature Data'
          });
        }

        if (plcData.length > 0) {
          plotData.push({
            x: plcData.map(d => d.time),
            y: plcData.map(d => d.pressure),
            type: 'scatter',
            mode: 'lines',
            line: { color: '#82ca9d' },
            hovertemplate: '%{y:.2f}<extra></extra>',
            name: 'PLC Pressure',
            yaxis: 'y2'
          });
          console.log("PLC data added to plot");
        }

        const layout = {
          title: 'Temperature and Pressure Over Time',
          xaxis: { title: 'Time' },
          yaxis: { title: 'Temperature (°C)', autorange: true },
          yaxis2: {
            title: 'Pressure',
            overlaying: 'y',
            side: 'right',
            autorange: true,
            range: plcData.length > 0 ? [Math.min(...plcData.map(d => d.pressure)), Math.max(...plcData.map(d => d.pressure))] : null
          },
          showlegend: true,
          paper_bgcolor: '#e2d1c7',
          plot_bgcolor: '#e2d1c7',
          margin: {
            l: 60,
            r: 60,
            t: 40,
            b: 80
          },
          shapes: [],
          dragmode: 'zoom',
          selectdirection: 'h',
          autosize: true,
          responsive: true,
          width: chartSize.width
        };

        if (averagedData.length > 0) {
          layout.shapes.push({
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
            name: 'Temperature Median'
          });
        }

        if (plcData.length > 0) {
          layout.shapes.push({
            type: 'line',
            x0: plcData[0]?.time,
            x1: plcData[plcData.length - 1]?.time,
            y0: plcMedianValue,
            y1: plcMedianValue,
            line: {
              color: 'green',
              width: 2,
              dash: 'dash'
            },
            name: 'PLC Median',
            yref: 'y2'
          });
        }

        const handleRelayout = (eventdata) => {
          if (eventdata['xaxis.range[0]'] && eventdata['xaxis.range[1]']) {
            const startRange = Math.round(eventdata['xaxis.range[0]']);
            const endRange = Math.round(eventdata['xaxis.range[1]']);
            const startIndex = Math.max(0, startRange);
            const endIndex = Math.min(averagedData.length - 1, endRange);

            if (startIndex !== endIndex) {
              handleBrushChange({ startIndex, endIndex });
            }
          }
        };

        Plotly.newPlot(currentPlotRef, plotData, layout);
        currentPlotRef.on('plotly_relayout', handleRelayout);

        const resizeObserver = new ResizeObserver(() => {
          Plotly.Plots.resize(currentPlotRef);
        });
        resizeObserver.observe(currentPlotRef);

        return () => {
          resizeObserver.disconnect();
          if (currentPlotRef) {
            Plotly.purge(currentPlotRef);
          }
        };
      } catch (error) {
        console.error("Error creating plot:", error);
      }
    }
  }, [averagedData, plcData, medianValue, plcMedianValue, handleBrushChange, chartSize]);

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
      <div ref={plotRef} className={styles['lineChart']} />
    </div>
  );
});

export default LineGraph;