// client\src\components\clustercomponents\extrusion_clustering\ElbowChart.js

import React from 'react';
import { Line } from 'react-chartjs-2';

const ElbowChart = ({ inertias }) => {
  if (!inertias || inertias.length === 0) {
    return <p>No Elbow Method data available.</p>;
  }

  const data = {
    labels: Array.from({ length: inertias.length }, (_, i) => i + 1),
    datasets: [
      {
        label: 'Elbow Method (Inertia)',
        data: inertias,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return <Line data={data} />;
};


export default ElbowChart;
