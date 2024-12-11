// server/utils/refining.js

const moment = require('moment');
const calculateQuartiles = require('./quartileCalculations');
const calculateAveragedData = require('./averageData');
const calculateBoxplotStats = require('./boxplotStats');
const preprocessData = require('./preprocessData');

function processData(data) {
    if (!data || data.length === 0) {
        return {
            averagedData: [],
            boxplotStats: { min: null, q1: null, median: null, q3: null, max: null, outliers: [] }
        };
    }

    const isRawFormat = (data[0].timestamp !== undefined && data[0].date === undefined && data[0].time === undefined);
    const isAveragedFormat = (data[0].date !== undefined && data[0].time !== undefined && data[0].temperature !== undefined);

    if (isRawFormat) {
        // Raw data 처리
        const { temperatures, tempValues } = preprocessData(data);
        const { q1, q3, lowerBound, upperBound } = calculateQuartiles(tempValues);

        let filteredData = temperatures.filter(item => (item.temperature >= lowerBound && item.temperature <= upperBound))
            .map(item => {
                const timestampStr = item.timestamp.trim();
                const parsed = moment(timestampStr, "YYYY-MM-DD HH:mm:ss.SSS", true);
                if (!parsed.isValid()) {
                    console.error(`Invalid timestamp format: ${item.timestamp}`);
                    return null;
                }

                const dateStr = parsed.format("YYYY-MM-DD");
                const timeStr = parsed.format("HH:mm:ss");
                if (timeStr === "Invalid date") {
                    console.error(`Moment could not parse time: ${item.timestamp}`);
                    return null;
                }

                return {
                    date: dateStr,
                    time: timeStr,
                    temperature: item.temperature,
                    mainPressure: item.mainPressure,
                    containerTempFront: item.containerTempFront,
                    containerTempBack: item.containerTempBack,
                    currentSpeed: item.currentSpeed
                };
            }).filter(item => item !== null);
        const averagedData = calculateAveragedData(filteredData);
        const boxplotStats = calculateBoxplotStats(averagedData);

        return { averagedData, boxplotStats };

    } else if (isAveragedFormat) {
        const tempValues = data.map(d => d.temperature);
        const { q1, q3, lowerBound, upperBound } = calculateQuartiles(tempValues);

        const filteredData = data.filter(item => (item.temperature >= lowerBound && item.temperature <= upperBound))
            .map(item => ({
                date: item.date,
                time: item.time,
                temperature: item.temperature,
                mainPressure: item.mainPressure !== undefined ? item.mainPressure : null,
                containerTempFront: item.containerTempFront !== undefined ? item.containerTempFront : null,
                containerTempBack: item.containerTempBack !== undefined ? item.containerTempBack : null,
                currentSpeed: item.currentSpeed !== undefined ? item.currentSpeed : null
            }));

        const averagedData = calculateAveragedData(filteredData);
        const boxplotStats = calculateBoxplotStats(averagedData);
        return { averagedData, boxplotStats };

    } else {
        // 알 수 없는 형식
        console.error('Unknown data format in processData');
        return {
            averagedData: [],
            boxplotStats: { min: null, q1: null, median: null, q3: null, max: null, outliers: [] }
        };
    }
}

module.exports = processData;
