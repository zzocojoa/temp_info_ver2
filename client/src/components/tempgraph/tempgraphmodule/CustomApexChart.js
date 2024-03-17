// client/src/components/tempgraph/tempgraphmodule/CustomApexChart.js

import React from 'react';
import ReactApexChart from 'react-apexcharts';

const CustomApexChart = ({ options, series }) => {
return <ReactApexChart options={options} series={series} type="boxPlot" width={320} height={320} />;
};

export default CustomApexChart;