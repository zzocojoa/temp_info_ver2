// server/utils/processFilteredData.js

/**
 * 주어진 데이터에서 특정 시간 범위에 해당하는 데이터를 필터링합니다.
 * @param {Array} data - 원본 데이터 배열
 * @param {String} startTime - 필터링 시작 시간 (ISO 문자열)
 * @param {String} endTime - 필터링 종료 시간 (ISO 문자열)
 * @returns {Array} 필터링된 데이터 배열
 */
function filterDataByTimeRange(data, startTime, endTime) {
    const startTimestamp = new Date(startTime).getTime();
    const endTimestamp = new Date(endTime).getTime();

    return data.filter(item => {
        const itemTimestamp = new Date(`${item.date}T${item.time}`).getTime();
        return itemTimestamp >= startTimestamp && itemTimestamp <= endTimestamp;
    });
}

module.exports = { filterDataByTimeRange };