// client\src\components\line_box\LineBarChartlogic\ClusteredTemperatureCharts.js

import React, { useState, useEffect } from 'react';
import TemperatureChart from './LineBarChartLogic';
import clusterDataByDwNumber from './utils/clusterDataByDwNumber';

const ClusteredTemperatureCharts = ({ fileMetadata }) => {
    const [clusteredData, setClusteredData] = useState([]);

    useEffect(() => {
        const clustered = clusterDataByDwNumber(fileMetadata);
        setClusteredData(clustered);
    }, [fileMetadata]);

    return (
        <div>
            {clusteredData.map((data, index) => (
                <TemperatureChart key={index} fileMetadata={data} />
            ))}
        </div>
    );
};

export default ClusteredTemperatureCharts;
