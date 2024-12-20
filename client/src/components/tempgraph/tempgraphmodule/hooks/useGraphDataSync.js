// client\src\components\tempgraph\tempgraphmodule\hooks\useLineGraphData.js

import { useState, useEffect, useCallback } from 'react';
import { sendFilteredData, calculateMedian } from '../../../../api';
import { filterDataByTime } from '../hooks/filterDataByTime';

// setBoxplotStats 동기화 로직을 분리한 함수
const updateBoxplotStats = async (filteredData, setBoxplotStats, setMedian) => {
    try {
        const response = await sendFilteredData(filteredData);
        setBoxplotStats(response.boxplotStats);

        const medianData = filteredData.map(item => item.temperature);
        if (medianData.length > 0) {
            const medianResponse = await calculateMedian(medianData);
            setMedian(medianResponse.median);
        }
    } catch (error) {
        console.error('Error fetching filtered data or calculating median:', error);
    }
};

export const useLineGraphData = (averagedData, initialStartTime, initialEndTime, onBrushChange, setBoxplotStats) => {
    const [startTime, setStartTime] = useState(initialStartTime || '');
    const [endTime, setEndTime] = useState(initialEndTime || '');
    const [median, setMedian] = useState(null);

    useEffect(() => {
        setStartTime(initialStartTime);
        setEndTime(initialEndTime);
    }, [initialStartTime, initialEndTime]);

    const handleBrushChange = useCallback(async (e) => {
        if (!e) {
            const startIndex = 0;
            const endIndex = averagedData.length - 1;
            onBrushChange(startIndex, endIndex);
            return;
        }

        const { startIndex, endIndex } = e;
        onBrushChange(startIndex, endIndex);

        const { filteredData, newStartTime, newEndTime } = filterDataByTime(averagedData, startIndex, endIndex);
        console.log("newStartTime: ", newStartTime)
        console.log("newEndTime: ", newEndTime)
        if (newStartTime && newEndTime) {
            setStartTime(newStartTime);
            setEndTime(newEndTime);

            // const filteredData = averagedData.slice(startIndex, endIndex + 1);
            if (filteredData.length > 0) {
                await updateBoxplotStats(filteredData, setBoxplotStats, setMedian);
            }
        }
    }, [averagedData, onBrushChange, setBoxplotStats]);

    return { startTime, endTime, median, handleBrushChange };
};
