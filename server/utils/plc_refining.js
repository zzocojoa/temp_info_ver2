// server/utils/plc_refining.js

const moment = require('moment'); // moment.js 사용
const preprocessPLCData = require('./preprocessPLCData');

function plcrefining(data) {
    // 데이터 전처리 로직 호출
    const { pressures } = preprocessPLCData(data);

    // 데이터가 없을 경우 처리
    if (!pressures || pressures.length === 0) {
        console.warn("No valid PLC data to process. Ensure the data contains valid '날짜', '시간', '메인압력', '콘테이너온도 앞쪽', '콘테이너온도 뒷쪽', '현재속도' fields.");
        return { processedData: [] };
    }

    // 유효한 데이터를 포맷팅하여 반환
    let processedData = pressures.map(item => ({
        date: item.date,
        time: moment(item.time, 'HH:mm:ss:SSS').format('HH:mm:ss'),  // time 필드 포맷팅
        pressure: item.pressure,
        ctf: item.ctf,
        ctb: item.ctb,
        speed: item.speed
    }));
    
    // console.log("processedData: ", processedData);

    return { processedData }; // 필터링 없이 변환된 데이터를 그대로 반환
}

module.exports = plcrefining;
