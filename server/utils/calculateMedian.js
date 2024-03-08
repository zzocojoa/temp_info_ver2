// server/utils/calculateMedian.js

const calculateMedian = (data) => {
    if (!data || data.length === 0) return 0;
  
    const sortedData = data.slice().sort((a, b) => a - b);
    const midIndex = Math.floor(sortedData.length / 2);
  
    if (sortedData.length % 2 === 0) {
      return (sortedData[midIndex - 1] + sortedData[midIndex]) / 2;
    } else {
      return sortedData[midIndex];
    }
  };
  
  module.exports = calculateMedian;