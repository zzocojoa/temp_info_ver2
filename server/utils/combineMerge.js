// server\utils\combineMerge.js

function mergeData(processedData, averagedData) {
    // console.log("processedData: ", processedData)

    const mergedData = [];

    // 각 데이터를 시간별로 맵으로 구성하여 검색 속도를 높임
    const processedDataMap = processedData.reduce((map, item) => {
        const key = `${item.date} ${item.time}`;
        map[key] = item;
        return map;
    }, {});

    const averagedDataMap = averagedData.reduce((map, item) => {
        const key = `${item.date} ${item.time}`;
        map[key] = item;
        return map;
    }, {});

    // 두 맵을 순회하면서 동일한 date, time을 기준으로 병합
    Object.keys(averagedDataMap).forEach(key => {
        if (processedDataMap[key]) {
            mergedData.push({
                date: averagedDataMap[key].date,
                time: averagedDataMap[key].time,
                temperature: averagedDataMap[key].temperature,
                pressure: processedDataMap[key].pressure,
                ctf: processedDataMap[key].ctf,
                ctb: processedDataMap[key].ctb,
                speed: processedDataMap[key].speed,
            });
        }
    });

    return mergedData;
}

module.exports = { mergeData };