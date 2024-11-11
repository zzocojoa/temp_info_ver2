// client\src\components\tempgraph\tempgraphmodule\utils\filterDataByTime.js

export const filterDataByTime = (averagedData, startIndex, endIndex) => {
    const filteredData = averagedData.slice(startIndex, endIndex + 1);
    const newStartTime = averagedData[startIndex]?.time;
    const newEndTime = averagedData[endIndex]?.time;
    
    return { filteredData, newStartTime, newEndTime };
};
