// server/utils/averageData.js

const moment = require('moment');

/**
 * 데이터를 시간 단위로 그룹화하고, 각 시간에 대해 평균 온도 및 평균 압력을 계산하는 함수
 * @param {Array} filteredData - 처리할 원본 데이터 배열
 * @returns {Array} 평균 온도 및 압력이 포함된 데이터 배열
 */
const calculateAveragedData = (filteredData) => {
    let groupedData = new Map();

    // 데이터를 시간 단위로 그룹화하여 처리
    filteredData.forEach(item => {
        const roundedTime = moment(item.time, 'HH:mm:ss').startOf('minute').seconds(
            moment(item.time, 'HH:mm:ss').seconds()
        ).format('HH:mm:ss');

        const dateTimeKey = `${item.date} ${roundedTime}`;
        
        // 해당 시간대의 데이터를 그룹화하여 저장
        if (!groupedData.has(dateTimeKey)) {
            groupedData.set(dateTimeKey, { 
                sumTemperature: 0, 
                countTemperature: 0, 
                sumPressure: 0, 
                countPressure: 0, 
                date: item.date, 
                time: roundedTime 
            });
        }
        let entry = groupedData.get(dateTimeKey);
        
        // 온도 값이 존재하는 경우 평균을 계산하기 위해 합산
        if (item.temperature !== null && item.temperature !== undefined) {
            entry.sumTemperature += item.temperature;
            entry.countTemperature += 1;
        }
        
        // 압력 값이 존재하는 경우 평균을 계산하기 위해 합산
        if (item.pressure !== null && item.pressure !== undefined) {
            entry.sumPressure += item.pressure;
            entry.countPressure += 1;
        }
    });

    // 계산된 평균 데이터를 배열로 변환
    return Array.from(groupedData.values()).map(entry => {
        const result = {
            date: entry.date,
            time: entry.time,
        };

        // 평균 온도 계산
        if (entry.countTemperature > 0) {
            result.temperature = entry.sumTemperature / entry.countTemperature;
        }

        // 평균 압력 계산
        if (entry.countPressure > 0) {
            result.pressure = entry.sumPressure / entry.countPressure;
        }

        return result;
    }).filter(entry => entry.temperature !== undefined || entry.pressure !== undefined); // 유효한 데이터만 필터링
};

module.exports = calculateAveragedData;
