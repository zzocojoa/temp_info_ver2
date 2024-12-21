const fs = require('fs');
const csv = require('csv-parser');
const KMeans = require('ml-kmeans').default;
const Plotly = require('plotly')('username', 'apiKey'); // Plotly API 설정 필요

// 데이터 파일 불러오기
function loadData(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        results.push({
          temperature: parseFloat(data.temperature),
          mainPressure: parseFloat(data.mainPressure),
          currentSpeed: parseFloat(data.currentSpeed),
          containerTempFront: parseFloat(data.containerTempFront),
          containerTempBack: parseFloat(data.containerTempBack),
        });
      })
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}

// 데이터 표준화
function standardizeData(data) {
  const keys = Object.keys(data[0]);
  const means = {};
  const stdDevs = {};

  keys.forEach((key) => {
    const values = data.map((d) => d[key]);
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(values.map((v) => (v - mean) ** 2).reduce((a, b) => a + b, 0) / values.length);

    means[key] = mean;
    stdDevs[key] = stdDev;
  });

  const scaledData = data.map((d) =>
    keys.map((key) => (d[key] - means[key]) / stdDevs[key])
  );

  return { scaledData, means, stdDevs };
}

// 최적 클러스터 수 찾기 (Elbow Method)
function findOptimalClusters(data) {
  const inertias = [];
  for (let k = 1; k <= 10; k++) {
    const kmeans = KMeans(data, k);
    inertias.push(kmeans.inertia);
  }

  const trace = {
    x: [...Array(10).keys()].map((x) => x + 1),
    y: inertias,
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Inertia',
  };

  const layout = {
    title: 'Elbow Method for Optimal Number of Clusters',
    xaxis: { title: 'Number of Clusters' },
    yaxis: { title: 'Inertia' },
  };

  Plotly.newPlot('elbowMethod', [trace], layout);
}

// 클러스터링 수행
function performClustering(scaledData, nClusters) {
  const kmeans = KMeans(scaledData, nClusters);
  return kmeans;
}

// 클러스터링 시각화
function visualizeClusters(data, labels) {
  const trace = {
    x: data.map((d) => d[2]), // currentSpeed
    y: data.map((d) => d[0]), // temperature
    mode: 'markers',
    marker: { color: labels, colorscale: 'Viridis', size: 10 },
    type: 'scatter',
  };

  const layout = {
    title: 'Clusters of Temperature vs Current Speed',
    xaxis: { title: 'Current Speed (mm/s)' },
    yaxis: { title: 'Temperature (°C)' },
  };

  Plotly.newPlot('clusterPlot', [trace], layout);
}

// 메인 함수
(async function main() {
  const filePath = '2024-11-11-2_A5810_60272_22.csv'; // 실제 파일 경로로 변경
  const nClusters = 3; // 클러스터 수 설정

  try {
    const data = await loadData(filePath);
    const { scaledData } = standardizeData(data);

    // 최적 클러스터 수 찾기
    findOptimalClusters(scaledData);

    // 클러스터링 수행
    const kmeans = performClustering(scaledData, nClusters);
    console.log('Cluster Centers:', kmeans.centroids);

    // 클러스터링 시각화
    visualizeClusters(scaledData, kmeans.labels);
  } catch (error) {
    console.error('Error:', error);
  }
})();
