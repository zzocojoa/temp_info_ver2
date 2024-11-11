// client\src\components\tempgraph\tempgraphmodule\BoxGraph.js

import React, { useEffect } from 'react';
import CustomApexChart from './CustomApexChart'; // 차트 컴포넌트
import StatisticsTable from './StatisticsTable'; // 통계 테이블 컴포넌트
import styles from './BoxGraph.module.css';

const BoxGraph = ({ boxplotStats = null, initialStartTime, initialEndTime }) => {

  useEffect(() => {
  }, [initialStartTime, initialEndTime]);

  // boxplotStats 데이터 유효성 검사: 데이터가 없거나 유효하지 않으면 경고 출력 후 메시지 반환
  if (!boxplotStats || Object.keys(boxplotStats).length === 0 || 
      typeof boxplotStats.min === 'undefined' || typeof boxplotStats.q1 === 'undefined' || 
      typeof boxplotStats.median === 'undefined' || typeof boxplotStats.q3 === 'undefined' || 
      typeof boxplotStats.max === 'undefined') {
    console.warn('Invalid or missing boxplotStats data:', boxplotStats);
    return <div>No boxplot data available</div>; // 데이터가 없을 경우 출력할 메시지
  }

  // 차트 설정 (박스플롯)
  const chartOptions = {
    chart: { type: 'boxPlot', height: 350 },
    title: { text: 'Temperature Box Plot', align: 'left' },
    xaxis: { categories: ['Temperature'] },
    yaxis: { 
      labels: { formatter: (val) => val.toFixed(0) }, 
      title: { text: 'Temperature (°C)' } 
    },
    plotOptions: { 
      boxPlot: { 
        colors: { upper: '#5C4742', lower: '#A5978B' } // 박스플롯 색상 설정
      } 
    }
  };

  // 박스플롯 시리즈 데이터 구성
  const chartSeries = [{
    name: 'Temperature',
    data: [{
      x: 'Temperature Distribution',
      y: [boxplotStats.min, boxplotStats.q1, boxplotStats.median, boxplotStats.q3, boxplotStats.max, ...(boxplotStats.outliers || [])] // 이상치(outliers) 포함
    }]
  }];

  return (
    <div className={styles['graphDataWrap']}>
      <div className={styles['graphDataSVG']}>
        <CustomApexChart options={chartOptions} series={chartSeries} />
      </div>
      <div className={styles['graphDataTable']}>
        <StatisticsTable stats={boxplotStats} />
      </div>
    </div>
  );
};

export default BoxGraph;
