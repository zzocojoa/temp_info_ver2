// server/utils/filteredDataProcessor.js

const calculateMedian = require('./calculateMedian');

// 데이터 필터링 및 중앙값 계산 함수
const processFilteredData = (data, newStartTime, newEndTime) => { // startTime, endTime 제거
//   console.log('Data received for filtering:', { data, newStartTime, newEndTime }); // 데이터 확인 로그 추가

  const filteredData = data.filter(item => {
    const itemTime = new Date(`1970/01/01 ${item.time}`);
    const startTimeDate = new Date(`1970/01/01 ${newStartTime}`); // newStartTime 사용
    const endTimeDate = new Date(`1970/01/01 ${newEndTime}`); // newEndTime 사용
    return itemTime >= startTimeDate && itemTime <= endTimeDate;
  });

//   console.log('Filtered data:', filteredData); // 필터링된 데이터 출력
//   console.log('Filtered data length:', filteredData.length); // 필터링된 데이터 길이 출력

  const temperatures = filteredData.map(item => item.temperature);
  const median = calculateMedian(temperatures, newStartTime, newEndTime); // newStartTime, newEndTime 전달

  return { filteredData, median };
};

module.exports = processFilteredData;
