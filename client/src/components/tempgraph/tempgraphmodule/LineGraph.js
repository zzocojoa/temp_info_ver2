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
    if ((averagedData.length > 0 || plcData.length > 0) && plotRef.current) {
      const currentPlotRef = plotRef.current;

      try {
        const plotData = [];
        // 수정됨: 기본 레이아웃 설정
        const layout = {
          title: 'Data Over Time',
          xaxis: { title: 'Time' },
          showlegend: true,
          paper_bgcolor: '#e2d1c7',
          plot_bgcolor: '#e2d1c7',
          margin: { l: 60, r: 80, t: 40, b: 80 },
          shapes: [],
          dragmode: 'zoom',
          selectdirection: 'h',
          autosize: true,
          responsive: true,
          width: chartSize.width
        };

        // 수정됨: averagedData가 있을 때 temperature 데이터 및 y축 추가
        if (averagedData.length > 0) {
          layout.yaxis = { 
            title: 'Temperature (°C)', 
            autorange: true,
            showgrid: true,
            zeroline: true
          };

          plotData.push({
            x: averagedData.map(d => d.time),
            y: averagedData.map(d => d.temperature),
            type: 'scatter',
            mode: 'lines',
            line: { color: '#8884d8' },
            hovertemplate: '%{y:.2f}°C<extra></extra>',
            name: 'T.P',
            yaxis: 'y'
          });

          // Temperature median line
          layout.shapes.push({
            type: 'line',
            x0: averagedData[0]?.time,
            x1: averagedData[averagedData.length - 1]?.time,
            y0: medianValue,
            y1: medianValue,
            line: { color: 'red', width: 2, dash: 'dash' },
            name: 'Temperature Median'
          });
        }

        // 수정됨: PLC 데이터가 있을 때 처리
        if (plcData.length > 0) {
          // 수정됨: 기본 y축이 없는 경우 pressure를 기본 y축으로 설정
          if (!layout.yaxis) {
            layout.yaxis = {
              title: 'P.S',
              autorange: true,
              showgrid: true,
              zeroline: true
            };
          }

          // 수정됨: y축 설정을 미리 정의
          const yaxisConfigs = {
            speed: {
              axis: averagedData.length > 0 ? 'y2' : 'y',
              title: 'CTF',
              color: '#82ca9d',
              position: averagedData.length > 0 ? 1 : undefined,
              side: 'right'
            },
            pressure: {
              axis: 'y3',
              title: 'P.S',
              color: '#ff6347',
              position: 1,
              side: 'right'
            },
            ctb: {
              axis: 'y3',
              title: 'CTB',
              color: '#4682b4',
              position: 1,
              side: 'right'
            },
            ctf: {
              axis: 'y3',
              title: 'Speed',
              color: '#daa520',
              position: 1,
              side: 'right'
            }
          };

          // 수정됨: PLC 데이터의 각 필드에 대한 처리
          Object.entries(yaxisConfigs).forEach(([field, config]) => {
            if (plcData[0][field] !== undefined) {
              // y축 설정 추가
              if (config.axis !== 'y') {
                layout[`yaxis${config.axis.slice(1)}`] = {
                  title: config.title,
                  overlaying: 'y',
                  side: config.side,
                  position: config.position,
                  autorange: true,
                  showgrid: true,
                  zeroline: true
                };
              }

              // 데이터 추가
              plotData.push({
                x: plcData.map(d => d.time),
                y: plcData.map(d => d[field]),
                type: 'scatter',
                mode: 'lines',
                line: { color: config.color },
                hovertemplate: '%{y:.2f}<extra></extra>',
                name: config.title,
                yaxis: config.axis
              });
            }
          });

          // PLC median line
          // if (plcData[0].pressure !== undefined) {
          //   layout.shapes.push({
          //     type: 'line',
          //     x0: plcData[0]?.time,
          //     x1: plcData[plcData.length - 1]?.time,
          //     y0: plcMedianValue,
          //     y1: plcMedianValue,
          //     line: { color: 'green', width: 2, dash: 'dash' },
          //     name: 'PLC Median',
          //     yref: averagedData.length > 0 ? 'y2' : 'y'
          //   });
          // }
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