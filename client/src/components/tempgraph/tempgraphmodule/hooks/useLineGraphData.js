// src/hooks/useLineGraphData.js
import { useState, useEffect, useCallback } from 'react';
import { sendFilteredData, calculateMedian } from '../../../../api';

export const useLineGraphData = (averagedData, initialStartTime, initialEndTime, onBrushChange, setBoxplotStats) => {
    const [startTime, setStartTime] = useState(initialStartTime || '');
    const [endTime, setEndTime] = useState(initialEndTime || '');
    const [median, setMedian] = useState(null);

    useEffect(() => {
        setStartTime(initialStartTime);
        setEndTime(initialEndTime);
    }, [initialStartTime, initialEndTime]);

    // useCallback을 사용하여 함수 메모이제이션 적용
    const handleBrushChange = useCallback(async (e) => {
        if (!e) {
            const startIndex = 0;
            const endIndex = averagedData.length - 1;
            onBrushChange(startIndex, endIndex);
            return;
        }

        const { startIndex, endIndex } = e;
        onBrushChange(startIndex, endIndex);

        const newStartTime = averagedData[startIndex]?.time;
        const newEndTime = averagedData[endIndex]?.time;
        if (newStartTime && newEndTime) {
            setStartTime(newStartTime);
            setEndTime(newEndTime);

            const filteredData = averagedData.slice(startIndex, endIndex + 1);
            if (filteredData.length > 0) { // 조건부 실행으로 불필요한 API 호출 방지
                try {
                    const response = await sendFilteredData(filteredData);
                    setBoxplotStats(response.boxplotStats); // 상태 업데이트는 최상위 컴포넌트에서 수행

                    // 데이터의 중앙값 계산을 위한 호출
                    const medianData = filteredData.map(item => item.temperature); // 온도 데이터만 추출
                    if (medianData.length > 0) {
                        const medianResponse = await calculateMedian(medianData);
                        setMedian(medianResponse.median); // 중앙값 상태 업데이트
                    }
                } catch (error) {
                    console.error('Error fetching filtered data or calculating median:', error);
                }
            }
        }
    }, [averagedData, onBrushChange, setBoxplotStats]); // 의존성 배열에 필요한 값들을 추가

    return { startTime, endTime, median, handleBrushChange };
};