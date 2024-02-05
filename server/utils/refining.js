// server\utils\refining.js

const moment = require('moment');
const quartile = require('./quartile');

function processData(data) {
    let dateCounts = {};
    let temperatures = [];

    // 데이터 전처리 최적화: forEach 대신 for-loop 사용
    for (const item of data) {
        const date = item['date'];
        const time = item['time'];
        const temperature = parseFloat(item['temperature']);

        if (!isNaN(temperature)) {
            dateCounts[date] = (dateCounts[date] || 0) + 1;
            temperatures.push({ date, time, temperature });
        } else {
            // console.log(`유효하지 않은 온도 값: ${rawTemperature}, 해당 행은 무시.`);
        }
    }

    const mostDataDate = Object.keys(dateCounts).reduce((a, b) => dateCounts[a] > dateCounts[b] ? a : b);

    // 해당 날짜의 데이터만 필터링
    temperatures = temperatures.filter(item => item.date === mostDataDate);
    const tempValues = temperatures.map(item => item.temperature);

    const q1 = quartile(tempValues, 0.25);
    const q3 = quartile(tempValues, 0.75);
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;

    // 필터링 및 데이터 변환
    let filteredData = temperatures.filter(item => item.temperature >= lowerBound && item.temperature <= upperBound)
        .map(item => ({
            Date: item.date,
            Time: moment(item.time, 'HH:mm:ss:SSS').format('HH:mm:ss'),
            Temperature: item.temperature
        }));
    
    // 데이터 그룹화 및 평균 계산 최적화: 객체 대신 Map 사용
    let groupedData = new Map();
    filteredData.forEach(item => {
        const roundedTime = moment(item.Time, 'HH:mm:ss').startOf('minute').seconds(
            Math.floor(moment(item.Time, 'HH:mm:ss').seconds() / 15) * 15
        ).format('HH:mm:ss');

        const dateTimeKey = `${item.Date} ${roundedTime}`;
        if (!groupedData.has(dateTimeKey)) {
            groupedData.set(dateTimeKey, { sum: 0, count: 0, date: item.Date, time: roundedTime });
        }
        let entry = groupedData.get(dateTimeKey);
        entry.sum += item.Temperature;
        entry.count += 1;
    });

    const averagedData = Array.from(groupedData.values()).map(entry => ({
        Date: entry.date,
        Time: entry.time,
        Temperature: entry.sum / entry.count
    }));

    const boxplotStats = {
        min: tempValues.reduce((min, val) => (val < min ? val : min), tempValues[0]),
        q1,
        median: quartile(tempValues, 0.5),
        q3,
        max: tempValues.reduce((max, val) => (val > max ? val : max), tempValues[0]),
        outliers: tempValues.filter(t => t < lowerBound || t > upperBound)
    };

    console.log("Refined Data:", boxplotStats);

    return { averagedData, boxplotStats };
}

module.exports = processData;