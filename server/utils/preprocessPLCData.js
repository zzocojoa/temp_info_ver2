// server\utils\preprocessPLCData.js

function preprocessPLCData(data) {
    const dateCounts = {};
    const pressures = [];

    // 데이터 검증 및 수집
    for (const item of data) {
        const dateTime = item['날짜'];
        const pressure = parseFloat(item['메인압력']);
        const time = item['시간'];

        // 날짜, 시간, 압력 값이 유효한지 확인
        if (!dateTime || isNaN(pressure) || !time) {
            continue;  // 유효하지 않은 데이터는 건너뜀
        }

        // 날짜별 카운트를 기록하고 pressures에 수집
        dateCounts[dateTime] = (dateCounts[dateTime] || 0) + 1;
        pressures.push({ date: dateTime, time, pressure });
    }

    // 유효한 데이터가 없을 경우 처리
    if (pressures.length === 0) {
        console.log("No valid data found in the PLC file.");
        return { pressures: [], pressureValues: [] };
    }

    // 가장 데이터가 많은 날짜 찾기
    const mostDataDate = Object.keys(dateCounts).reduce((a, b) => 
        dateCounts[a] > dateCounts[b] ? a : b
    );

    // 가장 많은 데이터를 가진 날짜로 필터링
    const filteredPressures = pressures.filter(item => item.date === mostDataDate);

    // 필터링된 데이터에서 압력 값만 추출
    const pressureValues = filteredPressures.map(item => item.pressure);

    return { pressures: filteredPressures, pressureValues };
}

module.exports = preprocessPLCData;
