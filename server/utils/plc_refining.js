// server/utils/plc_refining.js

const moment = require('moment');
const preprocessPLCData = require('./preprocessPLCData');
const calculateQuartiles = require('./quartileCalculations');
const calculateAveragedData = require('./averageData');

function plcrefining(data) {
    // 데이터 전처리 로직 호출
    const { pressures, pressureValues } = preprocessPLCData(data);

    if (pressures.length === 0) {
        console.log("No valid PLC data to process.");
        return { averagedData: [] };
    }

    const { q1, q3, lowerBound, upperBound } = calculateQuartiles(pressureValues);

    // 필터링 및 데이터 변환 로직 호출
    let filteredData = pressures.filter(item => item.pressure >= lowerBound && item.pressure <= upperBound)
        .map(item => ({
            date: item.date,
            time: moment(item.time, 'HH:mm:ss:SSS').format('HH:mm:ss'),
            pressure: item.pressure
        }));

    // AveragedData 계산 로직 호출
    const averagedData = calculateAveragedData(filteredData);

    return { averagedData };
}

module.exports = plcrefining;