// server/utils/averageData.js

const moment = require('moment');

const calculateAveragedData = (filteredData) => {
    let groupedData = new Map();
    filteredData.forEach(item => {
        const roundedTime = moment(item.time, 'HH:mm:ss').startOf('minute').seconds(
            moment(item.time, 'HH:mm:ss').seconds()
        ).format('HH:mm:ss');

        const dateTimeKey = `${item.date} ${roundedTime}`;
        if (!groupedData.has(dateTimeKey)) {
            groupedData.set(dateTimeKey, { sumTemperature: 0, countTemperature: 0, sumPressure: 0, countPressure: 0, date: item.date, time: roundedTime });
        }
        let entry = groupedData.get(dateTimeKey);
        if (item.temperature !== null && item.temperature !== undefined) {
            entry.sumTemperature += item.temperature;
            entry.countTemperature += 1;
        }
        if (item.pressure !== null && item.pressure !== undefined) {
            entry.sumPressure += item.pressure;
            entry.countPressure += 1;
        }
    });

    return Array.from(groupedData.values()).map(entry => {
        const result = {
            date: entry.date,
            time: entry.time,
        };
        if (entry.countTemperature > 0) {
            result.temperature = entry.sumTemperature / entry.countTemperature;
        }
        if (entry.countPressure > 0) {
            result.pressure = entry.sumPressure / entry.countPressure;
        }
        return result;
    }).filter(entry => entry.temperature !== undefined || entry.pressure !== undefined); // temperature와 pressure가 모두 undefined가 아닌 항목만 필터링
};

module.exports = calculateAveragedData;
