// src\components\BoxGraph.js

import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import styles from './BoxGraph.module.css';

function BoxGraph({ boxplotStats, selectedRange, temperatureValues, averagedData, initialStartTime, initialEndTime }) {

  // const [filteredStats, setFilteredStats] = useState(boxplotStats);
  const [startTime, setStartTime] = useState(initialStartTime || '');
  const [endTime, setEndTime] = useState(initialEndTime || '');
  const [filteredAveragedData, setFilteredAveragedData] = useState([]);
  const [selectedRangeStats, setselectedRangeStats] = useState(selectedRange);
  const [temperatureValuesStats, settemperatureValuesStats] = useState(temperatureValues);

  useEffect(() => {
    // boxplotStats 변경 시 필터링 로직 실행
    const filterDataByTimeRange = () => {
      // setFilteredStats(boxplotStats);
      setselectedRangeStats(selectedRange);
      settemperatureValuesStats(temperatureValues);
    };

    filterDataByTimeRange();
  }, [boxplotStats, selectedRange, temperatureValues]);

  // 초기 시간 설정 및 averagedData 필터링을 결합한 useEffect
  useEffect(() => {
    if (!selectedRange || (selectedRange.start === 0 && selectedRange.end === 0)) {
      setStartTime(initialStartTime);
      setEndTime(initialEndTime);
      setFilteredAveragedData(averagedData);

    } else {
      if (averagedData && selectedRange) {
        const filteredData = averagedData.slice(selectedRange.start, selectedRange.end + 1);
        
        setFilteredAveragedData(filteredData);
        settemperatureValuesStats(filteredData)
        setStartTime(filteredData[0]?.Time || initialStartTime);
        setEndTime(filteredData[filteredData.length - 1]?.Time || initialEndTime);
      }
    }
  }, [initialStartTime, initialEndTime, averagedData, selectedRange]);

  const stats = boxplotStats || {
    min: 0,
    q1: 0,
    median: 0,
    q3: 0,
    max: 0,
    outliers: []
  };

  const options = {
    chart: {
      type: 'boxPlot',
      height: 350
    },
    title: {
      text: 'Box Plot',
      align: 'left'
    },
    xaxis: {
      categories: ['Box Plot'] // 박스 플롯의 x축 카테고리
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val.toFixed(0); // 소수점 없이 정수만 표시
        }
      }
    },
    plotOptions: {
      boxPlot: {
        colors: {
          upper: '#5C4742',
          lower: '#A5978B'
        }
      }
    }
  };

  const series = [{
    name: 'Temperature',
    type: 'boxPlot',
    data: [{
      x: 'Temperature',
      y: [stats.min, stats.q1, stats.median, stats.q3, stats.max, ...stats.outliers]
    }]
  }];

  const formatNumber = (num) => num ? num.toFixed(2) : 'N/A';

  return (
    <div className={styles.graphDataWrap}>
      <div className={styles.graphDataSVG}>
        <ReactApexChart options={options} series={series} type="boxPlot" height={350} />
      </div>
      <div className={styles.graphDataTable}>
        {stats && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>최소값</th>
                <td className={styles.td}>{formatNumber(stats.min)}</td>
              </tr>
              <tr>
                <th className={styles.th}>Q1 (25번째 백분위수)</th>
                <td className={styles.td}>{formatNumber(stats.q1)}</td>
              </tr>
              <tr>
                <th className={styles.th}>중앙값</th>
                <td className={styles.td}>{formatNumber(stats.median)}</td>
              </tr>
              <tr>
                <th className={styles.th}>Q3 (75번째 백분위수)</th>
                <td className={styles.td}>{formatNumber(stats.q3)}</td>
              </tr>
              <tr>
                <th className={styles.th}>최대값</th>
                <td className={styles.td}>{formatNumber(stats.max)}</td>
              </tr>
            </thead>
          </table>
        )}
      </div>
    </div>
  );
}

export default BoxGraph;
