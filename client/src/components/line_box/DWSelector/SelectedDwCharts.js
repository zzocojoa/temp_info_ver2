// client\src\components\line_box\DWSelector\SelectedDwCharts.js

import React from 'react';
import TemperatureChart from '../LineBarChartlogic/LineBarChartLogic';
import clusterDataByDwNumber from '../LineBarChartlogic/utils/clusterDataByDwNumber';
import styles from './SelectedDwCharts.module.css'

const SelectedDwCharts = ({ fileMetadata, selectedDwNumbers }) => {
    // 모든 데이터를 DW 번호에 따라 클러스터링
    const clusteredData = clusterDataByDwNumber(fileMetadata);
    // 선택된 DW 번호들에 해당하는 클러스터만 필터링
    const filteredData = clusteredData.filter(cluster =>
        selectedDwNumbers.includes(cluster[0]?.numbering?.dwNumber));

    return (
        <>
            <div className={styles['SelectedDwChartsWrap']}>
                <div className={styles['SelectedDwChartsContainer']}>
                    <div className={styles['filteredData']}>
                        {filteredData.length > 0 ? filteredData.map((data, index) => (
                            <TemperatureChart key={index} fileMetadata={data} />
                        )) : <p>제품 번호를 선택하세요.</p>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SelectedDwCharts;
