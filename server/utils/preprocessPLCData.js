// server\utils\preprocessPLCData.js

function preprocessPLCData(data) {
    // 유효한 데이터만 필터링하고 필드 매핑
    const processedData = data
        .map(item => ({
            date: item['날짜'],
            time: item['시간'],
            pressure: parseFloat(item['메인압력']),
            ctf: parseFloat(item['콘테이너온도 앞쪽']),
            ctb: parseFloat(item['콘테이너온도 뒷쪽']),
            speed: parseFloat(item['현재속도'])
        }))
        .filter(item => item.date && !isNaN(item.pressure) && !isNaN(item.ctf) && !isNaN(item.ctb) && !isNaN(item.speed) && item.time);

    // 유효한 데이터가 없을 경우 처리
    if (processedData.length === 0) {
        console.log("No valid data found in the PLC file.");
        return { pressures: [], pressureValues: [], ctfValues: [], ctbValues: [], speedValues: [] };
    }

    // 가장 데이터가 많은 날짜 찾기
    const mostDataDate = processedData
        .reduce((acc, item) => {
            acc[item.date] = (acc[item.date] || 0) + 1;
            return acc;
        }, {});

    const targetDate = Object.keys(mostDataDate).reduce((a, b) => mostDataDate[a] > mostDataDate[b] ? a : b);

    // 대상 날짜 데이터 필터링 및 각 필드 값 배열 추출
    const filteredData = processedData.filter(item => item.date === targetDate);
    
    return {
        pressures: filteredData,
        pressureValues: filteredData.map(item => item.pressure),
        ctfValues: filteredData.map(item => item.ctf),
        ctbValues: filteredData.map(item => item.ctb),
        speedValues: filteredData.map(item => item.speed)
    };
}

module.exports = preprocessPLCData;
