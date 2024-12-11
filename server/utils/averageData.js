// server/utils/averageData.js

const moment = require('moment');

const calculateAveragedData = (filteredData) => {
    // filteredData: [{ date, time, temperature, mainPressure, containerTempFront, containerTempBack, currentSpeed }]

    let groupedData = new Map();

    filteredData.forEach(item => {
        const parsedTime = moment(item.time, 'HH:mm:ss');
        const seconds = parsedTime.seconds();
        const roundedSeconds = Math.floor(seconds / 10) * 10;
        const roundedTime = moment(item.time, 'HH:mm:ss')
            .startOf('minute')
            .seconds(roundedSeconds)
            .format('HH:mm:ss');

        const dateTimeKey = `${item.date} ${roundedTime}`;
        if (!groupedData.has(dateTimeKey)) {
            groupedData.set(dateTimeKey, {
                sumTemp: 0, sumMP: 0, sumCTF: 0, sumCTB: 0, sumCS: 0,
                count: 0,
                date: item.date,
                time: roundedTime
            });
        }
        let entry = groupedData.get(dateTimeKey);

        entry.sumTemp += item.temperature;
        if (typeof item.mainPressure === 'number') entry.sumMP += item.mainPressure;
        if (typeof item.containerTempFront === 'number') entry.sumCTF += item.containerTempFront;
        if (typeof item.containerTempBack === 'number') entry.sumCTB += item.containerTempBack;
        if (typeof item.currentSpeed === 'number') entry.sumCS += item.currentSpeed;
        entry.count += 1;
    });

    const averagedData = Array.from(groupedData.values()).map(entry => {
        return {
            date: entry.date,
            time: entry.time,
            temperature: entry.sumTemp / entry.count,
            mainPressure: entry.sumMP / entry.count,
            containerTempFront: entry.sumCTF / entry.count,
            containerTempBack: entry.sumCTB / entry.count,
            currentSpeed: entry.sumCS / entry.count
        };
    });

    return averagedData;
};

module.exports = calculateAveragedData;
