// server/utils/preprocessData.js

function preprocessData(data) {
    // data: {timestamp, mainPressure, containerTempFront, containerTempBack, currentSpeed, temperature}[]
    // 모든 필드를 숫자로 변환 가능한 경우 변환
    let temperatures = [];
    let tempValues = [];

    for (const item of data) {
        const temperature = parseFloat(item.temperature);
        const mainPressure = parseFloat(item.mainPressure);
        const containerTempFront = parseFloat(item.containerTempFront);
        const containerTempBack = parseFloat(item.containerTempBack);
        const currentSpeed = parseFloat(item.currentSpeed);

        if (!isNaN(temperature)) {
            temperatures.push({
                timestamp: item.timestamp,
                mainPressure: isNaN(mainPressure) ? null : mainPressure,
                containerTempFront: isNaN(containerTempFront) ? null : containerTempFront,
                containerTempBack: isNaN(containerTempBack) ? null : containerTempBack,
                currentSpeed: isNaN(currentSpeed) ? null : currentSpeed,
                temperature: temperature
            });
            tempValues.push(temperature);
        }
    }
    console.log("tempValues: ", tempValues)


    return { temperatures, tempValues };
}

module.exports = preprocessData;
