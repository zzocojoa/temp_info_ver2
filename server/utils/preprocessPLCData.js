// server/utils/preprocessPLCData.js

function preprocessPLCData(data) {
    let dateCounts = {};
    let pressures = [];

    for (const item of data) {
        const dateTime = item['날짜'];
        const pressure = parseFloat(item['메인압력']);

        if (dateTime && !isNaN(pressure)) {
            // dateTime 형식을 분할하여 date와 time으로 분리
            const date = dateTime;
            const time = item['시간'];

            dateCounts[date] = (dateCounts[date] || 0) + 1;
            pressures.push({ date, time, pressure });
        }
    }

    // console.log("Date counts:", dateCounts);
    // console.log("Processed pressures:", pressures);

    // dateCounts 객체가 비어있는 경우 처리
    if (Object.keys(dateCounts).length === 0) {
        console.log("No valid data found in the PLC file.");
        return { pressures: [], pressureValues: [] };
    }

    const mostDataDate = Object.keys(dateCounts).reduce((a, b) => dateCounts[a] > dateCounts[b] ? a : b);

    // console.log("Date with most data:", mostDataDate);

    pressures = pressures.filter(item => item.date === mostDataDate);

    // console.log("Filtered pressures:", pressures);

    const pressureValues = pressures.map(item => item.pressure);

    // console.log("Pressure values:", pressureValues);

    return { pressures, pressureValues };
}

module.exports = preprocessPLCData;