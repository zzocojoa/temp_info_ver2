// client\src\components\tempgraph\tempgraphmodule\hooks\useBoxplotStats.js

import { useState, useCallback, useEffect } from 'react';
import { sendFilteredData, calculateMedian } from '../../../../api';

export const useBoxplotStats = () => {
    const [boxplotStats, setBoxplotStats] = useState(null);
    const [median, setMedian] = useState(null);

    const updateBoxplotStats = useCallback(async (filteredData) => {
        if (!filteredData.length) return; // filteredData가 비어 있으면 반환
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
    }, []);

    useEffect(() => {
        // boxplotStats 변경 시 확인용 로그 추가
        if (boxplotStats) {
            console.log('Updated boxplotStats:', boxplotStats);
        }
    }, [boxplotStats]); // boxplotStats가 업데이트될 때마다 반영

    return { boxplotStats, median, updateBoxplotStats };
};
