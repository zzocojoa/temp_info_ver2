// client/src/components/tempgraph/tempgraphmodule/BoxGraph.js

import React, { useEffect } from 'react';
import CustomApexChart from './CustomApexChart'; // 차트 컴포넌트
import StatisticsTable from './StatisticsTable'; // 통계 테이블 컴포넌트
import styles from './BoxGraph.module.css';

const BoxGraph = ({ boxplotStats, initialStartTime, initialEndTime }) => {

  useEffect(() => {
    console.log('BoxGraph component mounted');
    console.log('boxplotStats:', boxplotStats);

    // 초기 데이터 확인 로그 추가
    console.log('BoxGraph initialStartTime:', initialStartTime);
    console.log('BoxGraph initialEndTime:', initialEndTime);
  }, [boxplotStats, initialStartTime, initialEndTime]);

  // boxplotStats 데이터 유효성 검사
  if (!boxplotStats || typeof boxplotStats.min === 'undefined' || typeof boxplotStats.q1 === 'undefined' || typeof boxplotStats.median === 'undefined' || typeof boxplotStats.q3 === 'undefined' || typeof boxplotStats.max === 'undefined') {
    console.warn('Invalid or missing boxplotStats data:', boxplotStats);
    return <div>No data available</div>;
  }

  console.log('BoxPlot stats are valid');

  const chartOptions = {
    chart: { type: 'boxPlot', height: 350 },
    title: { text: 'Temperature Box Plot', align: 'left' },
    xaxis: { categories: ['Temperature'] },
    yaxis: { labels: { formatter: (val) => val.toFixed(0) }, title: { text: 'Temperature (°C)' } },
    plotOptions: { boxPlot: { colors: { upper: '#5C4742', lower: '#A5978B' } } }
  };

  const chartSeries = [{
    name: 'Temperature',
    data: [{
      x: 'Temperature Distribution',
      y: [boxplotStats.min, boxplotStats.q1, boxplotStats.median, boxplotStats.q3, boxplotStats.max, ...(boxplotStats.outliers || [])]
    }]
  }];

  console.log('chartOptions:', chartOptions);
  console.log('chartSeries:', chartSeries);

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
