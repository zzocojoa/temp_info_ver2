// src/hooks/useLineGraphData.js

import { useState, useEffect, useCallback } from 'react';
import { sendFilteredData } from '../../../../api';

export const useLineGraphData = (averagedData, initialStartTime, initialEndTime, onBrushChange, setBoxplotStats) => {
    const [startTime, setStartTime] = useState(initialStartTime || '');
    const [endTime, setEndTime] = useState(initialEndTime || '');

    useEffect(() => {
        setStartTime(initialStartTime);
        setEndTime(initialEndTime);
    }, [initialStartTime, initialEndTime]);

    const handleBrushChange = useCallback(async (e) => {
        if (!e) {
            // 데이터 전체 범위 사용 시, 초기 지정된 시간 범위를 유지
            setStartTime(initialStartTime);
            setEndTime(initialEndTime);
            onBrushChange(0, averagedData.length - 1);
            return;
        }

        const { startIndex, endIndex } = e;
        onBrushChange(startIndex, endIndex);

        const newStartTime = averagedData[startIndex]?.time;
        const newEndTime = averagedData[endIndex]?.time;
        if (newStartTime && newEndTime) {
            // 사용자가 선택한 시간 범위를 상태에 저장
            setStartTime(newStartTime);
            setEndTime(newEndTime);

            const filteredData = averagedData.slice(startIndex, endIndex + 1);
            if (filteredData.length > 0) {
                try {
                    const response = await sendFilteredData(filteredData);
                    setBoxplotStats(response.boxplotStats); // 백엔드로부터 받은 데이터 상태 업데이트
                } catch (error) {
                    console.error('Error fetching filtered data:', error);
                }
            }
        }
    }, [averagedData, onBrushChange, setBoxplotStats, initialStartTime, initialEndTime]);

    return { startTime, endTime, handleBrushChange };
};