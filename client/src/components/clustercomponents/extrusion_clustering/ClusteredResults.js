// client\src\components\clustercomponents\extrusion_clustering\ClusteredResults.js

import React from 'react';
import { Scatter } from 'react-chartjs-2';

const ClusteredResults = ({ clusters, centroids }) => {
  console.log('Rendering ClusteredResults with:', { clusters, centroids });

  if (!clusters || Object.keys(clusters).length === 0) {
    return <p>No clustering data available.</p>;
  }

  const colorPalette = ['#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#9B59B6'];

  const datasets = Object.entries(clusters).map(([clusterKey, clusterInfo], index) => {
    const sample = clusterInfo.sample || []; // 기본값 처리
    if (sample.length === 0) {
      console.warn(`Cluster ${clusterKey} has no sample data.`);
    }

    return {
      label: `Cluster ${clusterKey}`,
      data: sample.map(point => ({
        x: point.temperature || 0,
        y: point.currentSpeed || 0,
      })),
      backgroundColor: colorPalette[index % colorPalette.length],
    };
  });

  centroids.forEach((centroid, index) => {
    datasets.push({
      label: `Centroid ${index}`,
      data: [{ x: centroid[0], y: centroid[2] }],
      backgroundColor: 'black',
      pointStyle: 'rect',
      radius: 8,
    });
  });

  if (datasets.length === 0) {
    return <p>No valid clustering data to display.</p>;
  }

  return <Scatter data={{ datasets }} />;
};

export default ClusteredResults;
