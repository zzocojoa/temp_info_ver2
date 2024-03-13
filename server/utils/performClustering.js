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
    
    return result;
  };
  
  module.exports = performClustering;
