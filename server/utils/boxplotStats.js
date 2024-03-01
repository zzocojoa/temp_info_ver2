// server/utils/boxplotStats.js

const quartile = require('./quartile');

const calculateBoxplotStats = (averagedData, lowerBound, upperBound) => {
    const temperatureValues = averagedData.map(entry => entry.Temperature);
    const min = Math.min(...temperatureValues);
    const max = Math.max(...temperatureValues);
    const median = quartile(temperatureValues, 0.5);
    const outliers = temperatureValues.filter(t => t < lowerBound || t > upperBound);

    return { min, median, q1: lowerBound, q3: upperBound, max, outliers };
};

module.exports = calculateBoxplotStats;
