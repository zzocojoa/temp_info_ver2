// src\components\BoxGraph.js

import React, { useState, useEffect, useMemo } from 'react';
import ReactApexChart from 'react-apexcharts';
import { sendFilteredData } from '../../../api';
import styles from './BoxGraph.module.css';

// React.memo를 사용하여 컴포넌트를 최적화함. props가 변경될 때만 리렌더링되도록 함.
const BoxGraph = React.memo(({ boxplotStats, selectedRange, averagedData, initialStartTime, initialEndTime }) => {
  // 현재 박스플롯 통계 상태를 관리하기 위한 state. 초기 상태는 props에서 받은 boxplotStats 값으로 설정함.
  const [currentBoxplotStats, setCurrentBoxplotStats] = useState({
    ...boxplotStats,
    min: boxplotStats?.min || 0,
    q1: boxplotStats?.q1 || 0,
    median: boxplotStats?.median || 0,
    q3: boxplotStats?.q3 || 0,
    max: boxplotStats?.max || 0,
    outliers: boxplotStats?.outliers || []
  });
  // 시작 시간과 종료 시간 상태를 관리하기 위한 state.
  const [startTime, setStartTime] = useState(initialStartTime || '');
  const [endTime, setEndTime] = useState(initialEndTime || '');

  // boxplotStats prop이 변경될 때마다 현재 박스플롯 통계 상태를 업데이트함.
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

  // 선택된 범위나 평균화된 데이터가 변경될 때만 필터링된 데이터를 처리함.
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

  // useMemo를 사용하여 차트 옵션과 시리즈 데이터를 계산함. 이는 리렌더링을 최소화하는 데 도움을 줌.
  const { options, series } = useMemo(() => {
    const chartOptions = {
      chart: { type: 'boxPlot', height: 350 },
      title: { text: 'Box Plot', align: 'left' },
      xaxis: { categories: ['Box Plot'] },
      yaxis: { labels: { formatter: (val) => val.toFixed(0) } },
      plotOptions: {
        boxPlot: { colors: { upper: '#5C4742', lower: '#A5978B' } }
      }
    };

    const chartSeries = [{
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
    }];

    return { options: chartOptions, series: chartSeries };
  }, [currentBoxplotStats]);

  // 숫자 형식을 포맷하는 함수
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
});

export default BoxGraph;
