// server/utils/refining.js

const moment = require('moment');
const calculateQuartiles = require('./quartileCalculations');
const calculateAveragedData = require('./averageData');
const calculateBoxplotStats = require('./boxplotStats');
const preprocessData = require('./preprocessData');

function processData(data) {
    // 데이터 전처리 로직 호출
    const { temperatures, tempValues } = preprocessData(data);

    // Quartile 관련 계산 로직 호출
    const { q1, q3, lowerBound, upperBound } = calculateQuartiles(tempValues);

    // 필터링 및 데이터 변환 로직 호출
    let filteredData = temperatures.filter(item => item.temperature >= lowerBound && item.temperature <= upperBound)
        .map(item => ({
            date: item.date,
            time: moment(item.time, 'HH:mm:ss:SSS').format('HH:mm:ss'),
            temperature: item.temperature
        }));

    // AveragedData 계산 로직 호출
    const averagedData = calculateAveragedData(filteredData);

    // BoxplotStats 계산 로직 호출
    const boxplotStats = calculateBoxplotStats(averagedData, q1, q3, lowerBound, upperBound);

    console.log("averagedData: ", averagedData);
    return { averagedData, boxplotStats };
}

module.exports = processData;
