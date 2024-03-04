// server/utils/preprocessData.js

function preprocessData(data) {
    let dateCounts = {};
    let temperatures = [];

    // 데이터 전처리
    for (const item of data) {
        const date = item['date'];
        const time = item['time'];
        const temperature = parseFloat(item['temperature']);

        if (!isNaN(temperature)) {
            dateCounts[date] = (dateCounts[date] || 0) + 1;
            temperatures.push({ date, time, temperature });
        }
    }
    // console.log("temperatures: ", temperatures);

    // dateCounts 객체가 비어있는 경우 처리
    const mostDataDate = Object.keys(dateCounts).length > 0
        ? Object.keys(dateCounts).reduce((a, b) => dateCounts[a] > dateCounts[b] ? a : b)
        : null;

    if (mostDataDate) {
        temperatures = temperatures.filter(item => item.date === mostDataDate);
    } else {
        temperatures = []; // mostDataDate가 없는 경우, temperatures 배열을 비웁니다.
    }

    const tempValues = temperatures.map(item => item.temperature);

    return { temperatures, tempValues };
}

module.exports = preprocessData;
