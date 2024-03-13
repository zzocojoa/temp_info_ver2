// server/utils/performClustering.js
const { kmeans } = require('ml-kmeans');

/**
 * 데이터를 클러스터링하는 함수.
 * @param {Array} data - 클러스터링할 데이터 배열. 각 요소는 {median, dieNumber} 형태의 객체.
 * @param {number} k - 클러스터의 수.
 */

const performClustering = (data, k) => {
  const points = data.map(item => [item.median, parseFloat(item.dieNumber)]);
  const result = kmeans(points, k);

  // centroids 배열의 구조를 확인하여 올바르게 접근
  const centroids = result.centroids.map(centroid => ({
    x: centroid[0], // 각 중심점의 첫 번째 요소를 x 좌표로 사용
    y: centroid[1], // 각 중심점의 두 번째 요소를 y 좌표로 사용
  }));

  return {
    clusters: result.clusters,
    centroids: centroids,
  };
};

module.exports = performClustering;