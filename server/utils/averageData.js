// server/utils/averageData.js

const moment = require('moment');

const calculateAveragedData = (filteredData) => {
    let groupedData = new Map();
    filteredData.forEach(item => {
        const roundedTime = moment(item.time, 'HH:mm:ss').startOf('minute').seconds(
            Math.floor(moment(item.time, 'HH:mm:ss').seconds() / 15) * 15
        ).format('HH:mm:ss');

        const dateTimeKey = `${item.date} ${roundedTime}`;
        if (!groupedData.has(dateTimeKey)) {
            groupedData.set(dateTimeKey, { sum: 0, count: 0, date: item.date, time: roundedTime });
        }
        let entry = groupedData.get(dateTimeKey);
        entry.sum += item.temperature;
        entry.count += 1;
    });

    return Array.from(groupedData.values()).map(entry => ({
        date: entry.date,
        time: entry.time,
        temperature: entry.sum / entry.count
    }));
};

module.exports = calculateAveragedData;
