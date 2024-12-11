// server/utils/calculateMedian.js

const calculateMedian = (data) => {
  if (!Array.isArray(data) || data.length === 0) return 0;

  const sortedData = data.filter(item => typeof item === 'number').sort((a, b) => a - b);
  if (sortedData.length === 0) return 0;

  const midIndex = Math.floor(sortedData.length / 2);

  return sortedData.length % 2 === 0
    ? (sortedData[midIndex - 1] + sortedData[midIndex]) / 2
    : sortedData[midIndex];
};

module.exports = calculateMedian;