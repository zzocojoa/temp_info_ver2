// clustering.mjs

import fs from 'fs';
import csv from 'csv-parser';
import pkg from 'ml-kmeans';
const { kmeans: kmeansAlgorithm } = pkg;

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

// 데이터 검증
function validateData(data) {
  const requiredFields = ['temperature', 'mainPressure', 'currentSpeed', 'containerTempFront', 'containerTempBack'];

  const isValid = data.every((row) =>
    requiredFields.every((field) => typeof row[field] === 'number' && !isNaN(row[field]))
  );

  if (!isValid) {
    throw new Error('Data validation failed: Missing or invalid fields in the dataset.');
  }
}

// 데이터 전처리 및 표준화
function preprocessData(data) {
  const features = ['temperature', 'mainPressure', 'currentSpeed', 'containerTempFront', 'containerTempBack'];
  const processedData = data.map(item => features.map(feature => item[feature]));

  // 표준화
  const means = features.map((_, i) =>
    processedData.reduce((sum, row) => sum + row[i], 0) / processedData.length
  );

  const stds = features.map((_, i) => {
    const mean = means[i];
    const squaredDiffs = processedData.map(row => Math.pow(row[i] - mean, 2));
    return Math.sqrt(squaredDiffs.reduce((a, b) => a + b) / processedData.length);
  });

  const scaledData = processedData.map(row =>
    row.map((val, i) => (val - means[i]) / stds[i])
  );

  return { scaledData, means, stds };
}

// Elbow Method 구현
function findOptimalClusters(data, maxClusters = 10) {
  const inertias = [];
  for (let k = 1; k <= maxClusters; k++) {
    const result = kmeansAlgorithm(data, k, {
      initialization: 'kmeans++',
      maxIterations: 100
    });
    inertias.push(result.error); // error 속성 사용
  }
  return inertias;
}

function denormalizeCentroids(centroids, means, stds) {
  if (!centroids || !means || !stds) {
    throw new Error('Invalid centroids, means, or stds provided for denormalization.');
  }

  return centroids.map(centroid =>
    centroid.map((val, i) => val * stds[i] + means[i])
  );
}

// Total Distance 계산
function calculateTotalDistance(data, centroids, labels) {
  return data.reduce((sum, point, index) => {
    const centroid = centroids[labels[index]];
    const distance = point.reduce((dist, val, i) => dist + Math.pow(val - centroid[i], 2), 0);
    return sum + Math.sqrt(distance);
  }, 0);
}

// 클러스터링 수행 및 결과 반환
function performClustering(data, k, means, stds) {
  const result = kmeansAlgorithm(data, k, {
    initialization: 'kmeans++',
    maxIterations: 100,
    tolerance: 1e-6,
  });

  // 중심값 복원
  const restoredCentroids = denormalizeCentroids(result.centroids, means, stds);

  console.log('\nCluster Centers (Temperature, Main Pressure, Current Speed, Container Temp Front, Container Temp Back):');
  restoredCentroids.forEach((centroid, index) => {
    console.log(`Cluster ${index}:`, centroid);
  });

  // Total Distance 계산
  const totalDistance = calculateTotalDistance(data, result.centroids, result.clusters);
  console.log('\nTotal Distance:', totalDistance);

  // 포맷팅된 결과 반환
  const formattedResults = formatResults(data, result.clusters, restoredCentroids);

  return {
    ...formattedResults,
    distance: totalDistance,
  };
}

// 클러스터링 결과를 시각화 가능한 형태로 변환
function formatResults(data, labels, centroids) {
  // 클러스터별 데이터 포인트 그룹화
  const clusters = data.map((point, index) => ({
    x: point[0], // temperature
    y: point[2], // currentSpeed
    cluster: labels[index]
  }));

  // 중심점 데이터 포맷팅
  const centroidPoints = centroids.map((centroid, index) => ({
    x: centroid[0],
    y: centroid[2],
    isCentroid: true,
    cluster: index
  }));

  return {
    points: clusters,
    centroids: centroidPoints
  };
}

// Elbow Method 결과 시각화 데이터 준비
function prepareElbowChartData(inertias) {
  return {
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
}

// 클러스터링 결과 시각화 데이터 준비
function prepareClusterChartData(results) {
  const datasets = [];

  // 클러스터별 데이터 추가
  const clusters = results.points.reduce((acc, point) => {
    acc[point.cluster] = acc[point.cluster] || [];
    acc[point.cluster].push({ x: point.x, y: point.y });
    return acc;
  }, {});

  Object.keys(clusters).forEach((cluster) => {
    datasets.push({
      label: `Cluster ${cluster}`,
      data: clusters[cluster],
      backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.6)`,
      borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
      borderWidth: 1,
    });
  });

  // 클러스터 중심점 추가
  datasets.push({
    label: 'Centroids',
    data: results.centroids.map((centroid) => ({
      x: centroid.x,
      y: centroid.y,
    })),
    backgroundColor: 'black',
    borderColor: 'yellow',
    pointStyle: 'triangle',
    pointRadius: 8,
  });

  return {
    datasets,
  };
}

// 결과 저장
function saveResults(results, outputPath) {
  fs.writeFileSync(
    outputPath,
    JSON.stringify(results, null, 2)
  );

  console.log(`Results saved to ${outputPath}`);

  // 클러스터별 통계 출력
  const clusterStats = results.points.reduce((stats, point) => {
    stats[point.cluster] = (stats[point.cluster] || 0) + 1;
    return stats;
  }, {});

  console.log('\nCluster Statistics:');
  Object.entries(clusterStats).forEach(([cluster, count]) => {
    console.log(`Cluster ${cluster}: ${count} points`);
  });
}

// 메인 실행 함수
async function main() {
  try {
    const filePath = '2024-11-11-2_A5810_60272_22.csv';
    const rawData = await loadData(filePath);

    validateData(rawData);
    const { scaledData, means, stds } = preprocessData(rawData);

    // Elbow Method 결과
    const inertias = findOptimalClusters(scaledData);
    const elbowChartData = prepareElbowChartData(inertias);

    // K-means 클러스터링
    const k = 3;
    const results = performClustering(scaledData, k, means, stds);
    const clusterChartData = prepareClusterChartData(results);

    console.log('Clustering completed');
    console.log('Total distance:', results.distance);

    // 결과 저장
    const outputPath = 'clustering_results.json';
    saveResults(results, outputPath);

    // React에서 사용 가능하도록 데이터 반환
    return {
      elbowChartData,
      clusterChartData,
    };
  } catch (error) {
    console.error('Error during clustering:', error);
  }
}

main();
