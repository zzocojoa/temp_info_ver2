// client\src\components\line_box\LineBarChartlogic\LineBarChartLogic.js

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// 데이터 변환 로직을 별도의 함수로 분리하여 구현
const transformData = (fileMetadata) => {
  return fileMetadata.map((item, index) => {
    const { min, median, max } = item.boxplotStats;
    return {
      index: index + 1,
      min,
      median,
      max,
      min_to_median: median - min,
      median_to_max: max - median,
    };
  });
};

const TemperatureChart = ({ fileMetadata }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    try {
      const transformedData = transformData(fileMetadata);
      setChartData(transformedData);
    } catch (error) {
      console.error('Error transforming data:', error);
    }
  }, [fileMetadata]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="index" />
        {/* 기존 Y축을 온도 바 차트용으로 유지합니다. */}
        <YAxis yAxisId="left" orientation="left" domain={['auto', 'auto']} />
        {/* 추가된 Y축을 median 선 차트용으로 설정합니다. */}
        <YAxis yAxisId="right" orientation="right" domain={['auto', 'auto']} />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="min" stackId="a" fill="skyblue" name="최소 온도" />
        <Bar yAxisId="left" dataKey="median" stackId="a" fill="blue" name="중앙 온도" />
        <Bar yAxisId="left" dataKey="max" stackId="a" fill="brown" name="최대 온도" />
        {/* median 값에 대한 Line 컴포넌트를 추가하고, 'right' Y축을 사용하도록 설정합니다. */}
        <Line yAxisId="right" type="monotone" dataKey="median" stroke="darkblue" name="중앙 온도" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TemperatureChart;
