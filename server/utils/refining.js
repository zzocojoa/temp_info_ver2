// server\utils\refining.js

const moment = require('moment');
const quartile = require('./quartile');

function processData(data) {
    let dateCounts = {};
    let temperatures = [];

    for (const item of data) {
        const date = item['date'];
        const time = item['time'];
        const temperature = parseFloat(item['temperature']);

        if (!isNaN(temperature)) {
            dateCounts[date] = (dateCounts[date] || 0) + 1;
            temperatures.push({ date, time, temperature });
        }
    }

    const mostDataDate = Object.keys(dateCounts).reduce((a, b) => dateCounts[a] > dateCounts[b] ? a : b);

    temperatures = temperatures.filter(item => item.date === mostDataDate);
    const tempValues = temperatures.map(item => item.temperature);

    const q1 = quartile(tempValues, 0.25);
    const q3 = quartile(tempValues, 0.75);
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;

    let filteredData = temperatures.filter(item => item.temperature >= lowerBound && item.temperature <= upperBound)
        .map(item => ({
            Date: item.date,
            Time: moment(item.time, 'HH:mm:ss:SSS').format('HH:mm:ss'),
            Temperature: item.temperature
        }));
    
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

    // 여기부터 수정된 부분
    const temperatureValues = Array.from(groupedData.values()).map(entry => entry.sum / entry.count);

    const min = Math.min(...temperatureValues);
    const max = Math.max(...temperatureValues);
    const median = quartile(temperatureValues, 0.5);

    const outliers = temperatureValues.filter(t => t < lowerBound || t > upperBound);

    const boxplotStats = {
        min,
        q1,
        median,
        q3,
        max,
        outliers
    };

    // console.log("averagedData: ", averagedData, "boxplotStats:", boxplotStats);

    return { averagedData, boxplotStats };
}

module.exports = processData;