// server\utils\refining.js

const moment = require('moment');
const quartile = require('./quartile');

function processData(data) {
    let dateCounts = {};
    let temperatures = [];

    for (const item of data) {
        const date = item['date']; // 필드 이름 수정
        const time = item['time']; // 필드 이름 수정
        const temperature = parseFloat(item['temperature']);

        if (!isNaN(temperature)) {
            dateCounts[date] = (dateCounts[date] || 0) + 1;
            temperatures.push({ date, time, temperature });
        }
    }

    // 배열이 비어 있을 경우를 대비하여 초기값 설정
    const mostDataDate = Object.keys(dateCounts).reduce((a, b) => dateCounts[a] > dateCounts[b] ? a : b, null);

    if (mostDataDate === null) {
        // 처리할 데이터가 없으면 빈 결과 반환
        return { averagedData: [], boxplotStats: {} };
    }

    temperatures = temperatures.filter(item => item.date === mostDataDate);
    const tempValues = temperatures.map(item => item.temperature);

    // tempValues가 비어 있지 않을 때만 quartile과 reduce 함수 사용
    if (tempValues.length === 0) {
        return { averagedData: [], boxplotStats: {} };
    }

    const q1 = quartile(tempValues, 0.25);
    const q3 = quartile(tempValues, 0.75);
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;

    let filteredData = temperatures.filter(item => item.temperature >= lowerBound && item.temperature <= upperBound)
        .map(item => ({
            Date: item.date,
            Time: moment(item.time, 'HH:mm:ss').format('HH:mm:ss'),
            Temperature: item.temperature
        }));

    let groupedData = new Map();
    filteredData.forEach(item => {
        const roundedTime = moment(item.Time, 'HH:mm:ss').startOf('minute').format('HH:mm:ss');

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
        min: tempValues.reduce((min, val) => Math.min(min, val), tempValues[0]),
        q1,
        median: quartile(tempValues, 0.5),
        q3,
        max: tempValues.reduce((max, val) => Math.max(max, val), tempValues[0]),
        outliers: tempValues.filter(t => t < lowerBound || t > upperBound)
    };
    console.log("Refined Data:", averagedData);

    return { averagedData, boxplotStats };
}


module.exports = processData;
