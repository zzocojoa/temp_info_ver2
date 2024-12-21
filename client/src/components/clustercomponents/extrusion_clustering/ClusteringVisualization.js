import React, { useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';

function ClusteringVisualization({ clusteringResults, title, }) {
  console.log('Rendering ClusteringVisualization with:', clusteringResults);

  const [visibleClusters, setVisibleClusters] = useState({
    0: true,
    1: true,
    2: true,
  });

  const [visibleDatasets, setVisibleDatasets] = useState({
    temperature: true,
    mainPressure: true,
    containerTempFront: true,
    containerTempBack: true,
    currentSpeed: true,
  });

  const colors = useMemo(() => ({
    temperature: { border: 'rgba(255, 99, 132, 1)', background: 'rgba(255, 99, 132, 0.2)' },
    mainPressure: { border: 'rgba(54, 162, 235, 1)', background: 'rgba(54, 162, 235, 0.2)' },
    containerTempFront: { border: 'rgba(255, 206, 86, 1)', background: 'rgba(255, 206, 86, 0.2)' },
    containerTempBack: { border: 'rgba(75, 192, 192, 1)', background: 'rgba(75, 192, 192, 0.2)' },
    currentSpeed: { border: 'rgba(153, 102, 255, 1)', background: 'rgba(153, 102, 255, 0.2)' },
  }), []);

  const toggleClusterVisibility = (clusterIndex) => {
    setVisibleClusters((prevState) => ({
      ...prevState,
      [clusterIndex]: !prevState[clusterIndex],
    }));
  };

  const toggleDatasetVisibility = (datasetKey) => {
    setVisibleDatasets((prevState) => ({
      ...prevState,
      [datasetKey]: !prevState[datasetKey],
    }));
  };

  // `parseDateCount` 캐싱
  const parseDateCountCache = useMemo(() => new Map(), []);

  const parseDateCount = (dateCount) => {
    if (parseDateCountCache.has(dateCount)) {
      return parseDateCountCache.get(dateCount);
    }
    const parts = dateCount.split('-');
    const date = parts.slice(0, 3).join('-'); // "YYYY-MM-DD"
    const count = parseInt(parts[3], 10) || 0;
    const parsed = { date: new Date(date), count };
    parseDateCountCache.set(dateCount, parsed);
    return parsed;
  };

  const datasets = useMemo(() => {
    // 데이터 정렬
    const sortedResults = clusteringResults.sort((a, b) => {
      const aParsed = parseDateCount(a.dateCount);
      const bParsed = parseDateCount(b.dateCount);
      return aParsed.date - bParsed.date || aParsed.count - bParsed.count;
    });

    // 클러스터별 데이터 초기화
    const dataByCluster = Object.keys(visibleClusters).reduce((acc, clusterIndex) => {
      acc[clusterIndex] = {};
      Object.keys(colors).forEach((metric) => {
        acc[clusterIndex][metric] = [];
      });
      return acc;
    }, {});

    // 데이터 할당
    for (const result of sortedResults) {
      for (const cluster of result.clusters) {
        const clusterIndex = cluster.cluster;
        if (visibleClusters[clusterIndex]) {
          for (const metric of Object.keys(colors)) {
            if (visibleDatasets[metric]) {
              dataByCluster[clusterIndex][metric].push({
                x: result.dateCount,
                y: cluster[metric],
              });
            }
          }
        }
      }
    }

    // `datasets` 생성
    return Object.entries(dataByCluster).flatMap(([clusterIndex, metrics]) =>
      Object.entries(metrics)
        .filter(([metric]) => visibleDatasets[metric])
        .map(([metric, data]) => ({
          label: `Cluster ${clusterIndex} - ${metric}`,
          data,
          borderColor: colors[metric].border,
          backgroundColor: colors[metric].background,
          fill: false,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          showLine: true,
        }))
    );
  }, [clusteringResults, visibleClusters, visibleDatasets, colors, parseDateCount]);

  const labels = useMemo(() => {
    const uniqueLabels = Array.from(new Set(clusteringResults.map((file) => file.dateCount)));
    return uniqueLabels.sort((a, b) => {
      const aParsed = parseDateCount(a);
      const bParsed = parseDateCount(b);
      return aParsed.date - bParsed.date || aParsed.count - bParsed.count;
    });
  }, [clusteringResults, parseDateCount]);

  const data = useMemo(() => ({
    labels,
    datasets,
  }), [labels, datasets]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: `Clustering Results for ${title}`,
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Date - Count Number',
        },
      },
      'left-y-axis': {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Temperature, Pressure, Container Temp',
        },
      },
      'right-y-axis': {
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: 'Current Speed',
        },
      },
    },
  }), [title]);

  return (
    <div>
      {/* Cluster toggle buttons */}
      <div className="cluster-buttons">
        {Object.keys(visibleClusters).map((clusterIndex) => (
          <button
            key={clusterIndex}
            className={`cluster-button ${visibleClusters[clusterIndex] ? 'active' : 'inactive'}`}
            onClick={() => toggleClusterVisibility(parseInt(clusterIndex, 10))}
          >
            {`Cluster ${clusterIndex}`}
          </button>
        ))}
      </div>

      {/* Dataset toggle buttons */}
      <div className="dataset-legend">
        <div>
          {Object.entries(colors).map(([key, color]) => (
            <div key={key} className="legend-item">
              <div
                className="color-box"
                style={{ backgroundColor: color.border }}
              ></div>
              <button
                className={`legend-button ${visibleDatasets[key] ? 'active' : 'inactive'}`}
                onClick={() => toggleDatasetVisibility(key)}
              >
                {key.replace(/([A-Z])/g, ' $1')}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 차트 */}
      <div className="chart-container">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}

export default ClusteringVisualization;
