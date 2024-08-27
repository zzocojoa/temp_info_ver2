// server\utils\plc_refining.js

const moment = require('moment');
const preprocessPLCData = require('./preprocessPLCData');
const calculateQuartiles = require('./quartileCalculations');
const calculateAveragedData = require('./averageData');

function plcrefining(data) {
    // 데이터 전처리 로직 호출
    const { pressures, pressureValues } = preprocessPLCData(data);
    // console.log("pressures: ", pressures);

    const { q1, q3, lowerBound, upperBound } = calculateQuartiles(pressureValues);

    // 필터링 및 데이터 변환 로직 호출
    let filteredData = pressures.filter(item => item.pressure >= lowerBound && item.pressure <= upperBound)
        .map(item => ({
            date: item.date,
            time: moment(item.time, 'HH:mm:ss:SSS').format('HH:mm:ss'),
            pressure: item.pressure
        }));
    // console.log("filteredData: ", filteredData);

    // AveragedData 계산 로직 호출
    const averagedData = calculateAveragedData(filteredData);

    // console.log("averagedData: ", averagedData);
    return { averagedData };
    // return { averagedData, boxplotStats };
}

module.exports = plcrefining;
