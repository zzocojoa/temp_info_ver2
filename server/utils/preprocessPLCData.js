// server\utils\preprocessPLCData.js

function preprocessPLCData(data) {
    let dateCounts = {};
    let pressures = [];

    for (const item of data) {
        const dateTime = item['dateTime'];
        const pressure = parseFloat(item['pressure']);

        if (dateTime && !isNaN(pressure)) {
            // dateTime 형식을 분할하여 date와 time으로 분리
            const date = dateTime.substring(0, 10);
            const timePart = dateTime.substring(11);
            const hours = timePart.substring(0, 2);
            const minutes = timePart.substring(3, 5);
            const seconds = timePart.substring(6, 8);
            const millis = timePart.substring(9, 12);
            const formattedTime = `${hours}:${minutes}:${seconds}:${millis}`;

            dateCounts[date] = (dateCounts[date] || 0) + 1;
            pressures.push({ date, time: formattedTime, pressure });
        }
    }

    // console.log("Date counts:", dateCounts);
    // console.log("Processed pressures:", pressures);

    // dateCounts 객체가 비어있는 경우 처리
    const mostDataDate = Object.keys(dateCounts).length > 0
        ? Object.keys(dateCounts).reduce((a, b) => dateCounts[a] > dateCounts[b] ? a : b)
        : null;

    // console.log("Date with most data:", mostDataDate);

    if (mostDataDate) {
        pressures = pressures.filter(item => item.date === mostDataDate);
    } else {
        pressures = []; // mostDataDate가 없는 경우, pressures 배열을 비웁니다.
    }

    // console.log("Filtered pressures:", pressures);

    const pressureValues = pressures.map(item => item.pressure);

    // console.log("Pressure values:", pressureValues);

    return { pressures, pressureValues };
}

module.exports = preprocessPLCData;
