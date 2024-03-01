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

    const mostDataDate = Object.keys(dateCounts).reduce((a, b) => dateCounts[a] > dateCounts[b] ? a : b);
    temperatures = temperatures.filter(item => item.date === mostDataDate);
    const tempValues = temperatures.map(item => item.temperature);

    return { temperatures, tempValues };
}

module.exports = preprocessData;
