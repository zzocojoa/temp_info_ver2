// client\src\components\tempgraph\tempgraphmodule\LineGraph.js

import React, { useState, useEffect } from 'react';
import Plotly from 'plotly.js-dist-min';
import { useLineGraphData } from './hooks/useLineGraphData';
import { calculateMedian } from '../../../api';
import styles from './LineGraph.module.css';

const LineGraph = React.memo(({
  averagedData,
  plcData,
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
  const [plcMedianValue, setPlcMedianValue] = useState(0);
  console.log("plcData: ", plcData)

  useEffect(() => {
    // console.log("averagedData changed:", averagedData);
  }, [averagedData]);

  useEffect(() => {
    // console.log("startTime or endTime changed:", { startTime, endTime });
  }, [startTime, endTime]);

  useEffect(() => {
    // console.log("medianValue changed:", medianValue);
  }, [medianValue]);

  useEffect(() => {
    const fetchMedian = async () => {
      // console.log("Fetching median for data:", averagedData);
      const temperatures = averagedData.map(item => item.temperature);
      try {
        const median = await calculateMedian(temperatures);
        // console.log("Median value fetched:", median);
        setMedianValue(median.median);
      } catch (error) {
        console.error('Error calculating median:', error);
      }
    };

    if (averagedData.length > 0) {
      // console.log("Averaged data available, fetching median");
      fetchMedian(averagedData);
    }
  }, [averagedData]);

  useEffect(() => {
    const fetchPlcMedian = async () => {
      console.log("Fetching median for PLC data:", plcData);
      const temperatures = plcData.map(item => item.temperature);
      try {
        const median = await calculateMedian(temperatures);
        // console.log("PLC Median value fetched:", median);
        setPlcMedianValue(median.median);
      } catch (error) {
        console.error('Error calculating PLC median:', error);
      }
    };

    if (plcData.length > 0) {
      // console.log("PLC data available, fetching median");
      fetchPlcMedian(plcData);
    }
  }, [plcData]);

  useEffect(() => {
    const plotData = [
      {
        x: averagedData.map(d => d.time),
        y: averagedData.map(d => d.temperature),
        type: 'scatter',
        mode: 'lines',
        line: { color: '#8884d8' },
        hovertemplate: '%{y:.2f}°C<extra></extra>',
        name: 'Original Data'
      },
      {
        x: plcData.map(d => d.time),
        y: plcData.map(d => d.temperature),
        type: 'scatter',
        mode: 'lines',
        line: { color: '#82ca9d' },
        hovertemplate: '%{y:.2f}°C<extra></extra>',
        name: 'PLC Data',
        yaxis: 'y2'
      }
    ];

    const layout = {
      title: 'Temperature Over Time',
      xaxis: { title: 'Time' },
      yaxis: { title: 'Temperature (°C)', autorange: true },
      yaxis2: {
        title: 'PLC Temperature (°C)',
        overlaying: 'y',
        side: 'right',
        autorange: true
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
        },
        {
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
        }
      ],
      dragmode: 'zoom',
      selectdirection: 'h',
      autosize: true,
      responsive: true
    };

    const handleRelayout = (eventdata) => {
      // console.log("eventdata:", eventdata);

      if (eventdata['xaxis.range[0]'] && eventdata['xaxis.range[1]']) {
        const startRange = Math.round(eventdata['xaxis.range[0]']);
        const endRange = Math.round(eventdata['xaxis.range[1]']);

        // console.log("startRange:", startRange, "endRange:", endRange);

        const startIndex = Math.max(0, startRange);
        const endIndex = Math.min(averagedData.length - 1, endRange);

        // console.log("startIndex and endIndex changed:", { startIndex, endIndex });

        if (startIndex !== endIndex) {
          // console.log("Brush changed:", { startIndex, endIndex });
          handleBrushChange({ startIndex, endIndex });
        } else {
          // console.log("Invalid range selected, indices not found.");
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
  }, [averagedData, plcData, medianValue, plcMedianValue, handleBrushChange]);

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
                  // console.log("C_Number changed:", e.target.value);
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
                  // console.log("W_Number changed:", e.target.value);
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
                  // console.log("DW_Number changed:", e.target.value);
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
                  // console.log("Die_Number changed:", e.target.value);
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
