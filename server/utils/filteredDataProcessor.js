// server/utils/filteredDataProcessor.js

const calculateMedian = require('./calculateMedian');

// 데이터 필터링 및 중앙값 계산 함수
const processFilteredData = (data, startTime, endTime) => {
    // 주어진 시간 범위에 맞는 데이터만 필터링
    const filteredData = data.filter(item => {
        const itemTime = new Date(`1970/01/01 ${item.time}`);
        const startTimeDate = new Date(`1970/01/01 ${startTime}`);
        const endTimeDate = new Date(`1970/01/01 ${endTime}`);
        return itemTime >= startTimeDate && itemTime <= endTimeDate;
    });

    // 중앙값 계산
    const temperatures = filteredData.map(item => item.temperature);
    const median = calculateMedian(temperatures);

    return { filteredData, median };
};

module.exports = processFilteredData;
