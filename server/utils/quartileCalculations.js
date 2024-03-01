// server/utils/quartileCalculations.js

const quartile = require('./quartile');


const calculateQuartiles = (tempValues) => {
    const q1 = quartile(tempValues, 0.25);
    const q3 = quartile(tempValues, 0.75);
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;

    return { q1, q3, iqr, lowerBound, upperBound };
};

module.exports = calculateQuartiles;
