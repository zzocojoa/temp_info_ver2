// server/utils/averageData.js

const moment = require('moment');

const calculateAveragedData = (filteredData) => {
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

    return Array.from(groupedData.values()).map(entry => ({
        Date: entry.date,
        Time: entry.time,
        Temperature: entry.sum / entry.count
    }));
};

module.exports = calculateAveragedData;
