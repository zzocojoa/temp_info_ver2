// server/utils/boxplotStats.js

const quartile = require('./quartile');

const calculateBoxplotStats = (averagedData) => {
  console.log("averagedData: ", averagedData)
  const temperatureValues = averagedData.map(entry => entry.temperature).filter(t => !isNaN(t));
  if (temperatureValues.length === 0) {
    return { min: null, q1: null, median: null, q3: null, max: null, outliers: [] };
  }

  const q1 = quartile(temperatureValues, 0.25);
  const median = quartile(temperatureValues, 0.5);
  const q3 = quartile(temperatureValues, 0.75);
  const iqr = q3 - q1;
  const lowerBound = q1 - 1.5 * iqr;
  const upperBound = q3 + 1.5 * iqr;

  const min = Math.min(...temperatureValues);
  const max = Math.max(...temperatureValues);
  const outliers = temperatureValues.filter(t => t < lowerBound || t > upperBound);

  // console.log("min: ", min)

  return { min, q1, median, q3, max, outliers };
};

module.exports = calculateBoxplotStats;
