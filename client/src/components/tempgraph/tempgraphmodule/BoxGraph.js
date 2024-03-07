// src\components\BoxGraph.js

import React, { useState, useEffect, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import { sendFilteredData } from '../../../api';
import styles from './BoxGraph.module.css';

function BoxGraph({ boxplotStats, selectedRange, averagedData, initialStartTime, initialEndTime }) {
  const [currentBoxplotStats, setCurrentBoxplotStats] = useState({
    ...boxplotStats,
    min: boxplotStats?.min || 0,
    q1: boxplotStats?.q1 || 0,
    median: boxplotStats?.median || 0,
    q3: boxplotStats?.q3 || 0,
    max: boxplotStats?.max || 0,
    outliers: boxplotStats?.outliers || []
  });
  const [startTime, setStartTime] = useState(initialStartTime || '');
  const [endTime, setEndTime] = useState(initialEndTime || '');

  useEffect(() => {
    setCurrentBoxplotStats(boxplotStats || {
      min: 0,
      q1: 0,
      median: 0,
      q3: 0,
      max: 0,
      outliers: []
    });
  }, [boxplotStats]);

  useEffect(() => {
    if (!selectedRange || (selectedRange.start === 0 && selectedRange.end === 0)) {
      setStartTime(initialStartTime);
      setEndTime(initialEndTime);
    } else if (averagedData && averagedData.length > 0) {
      const filteredData = averagedData.slice(selectedRange.start, selectedRange.end + 1);
      setStartTime(filteredData[0]?.time || initialStartTime);
      setEndTime(filteredData[filteredData.length - 1]?.time || initialEndTime);

      sendFilteredData(filteredData)
        .then(response => {
          if (response && response.boxplotStats) {
            setCurrentBoxplotStats(response.boxplotStats);
          }
        })
        .catch(error => {
          console.error('Failed to send filtered data:', error);
        });
    }
  }, [initialStartTime, initialEndTime, averagedData, selectedRange]);

  const options = {
    chart: { type: 'boxPlot', height: 350 },
    title: { text: 'Box Plot', align: 'left' },
    xaxis: { categories: ['Box Plot'] },
    yaxis: { labels: { formatter: (val) => val.toFixed(0) } },
    plotOptions: {
      boxPlot: { colors: { upper: '#5C4742', lower: '#A5978B' } }
    }
  };

  const series = useMemo(() => [{
    name: 'temperature',
    type: 'boxPlot',
    data: [{
      x: 'Temperature',
      y: [
        currentBoxplotStats.min,
        currentBoxplotStats.q1,
        currentBoxplotStats.median,
        currentBoxplotStats.q3,
        currentBoxplotStats.max,
        ...currentBoxplotStats.outliers
      ]
    }]
  }], [currentBoxplotStats]);


  const formatNumber = (num) => isNaN(parseFloat(num)) ? 'N/A' : parseFloat(num).toFixed(2);

  return (
    <div className={styles.graphDataWrap}>
      <div className={styles.graphDataSVG}>
        <ReactApexChart options={options} series={series} type="boxPlot" height={350} />
      </div>
      <div className={styles.graphDataTable}>
        <table className={styles.table}>
          <thead>
            <tr><th className={styles.th}>최대값</th><td className={styles.td}>{formatNumber(currentBoxplotStats.max)}</td></tr>
            <tr><th className={styles.th}>Q3 (75번째 백분위수)</th><td className={styles.td}>{formatNumber(currentBoxplotStats.q3)}</td></tr>
            <tr><th className={styles.th}>중앙값</th><td className={styles.td}>{formatNumber(currentBoxplotStats.median)}</td></tr>
            <tr><th className={styles.th}>Q1 (25번째 백분위수)</th><td className={styles.td}>{formatNumber(currentBoxplotStats.q1)}</td></tr>
            <tr><th className={styles.th}>최소값</th><td className={styles.td}>{formatNumber(currentBoxplotStats.min)}</td></tr>
          </thead>
        </table>
      </div>
    </div>
  );
}

export default BoxGraph;

