// client\src\pages\ViewDataPage.js

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LineGraph from '../components/LineGraph';
import BoxGraph from '../components/BoxGraph';
import DataListUI from '../components/DataListUI';
import { fetchDataDetails, updateData } from '../api';
import TextInputBox from '../components/TextInputBox';
import styles from './GraphData.module.css'

function ViewDataPage() {
  const location = useLocation();
  const { selectedItems } = location.state || {};
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [graphData, setGraphData] = useState([]);
  const [boxPlotData, setBoxPlotData] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (selectedItems.length > 0) {
        const detail = await fetchDataDetails(selectedItems[0]); // 첫 번째 선택된 항목의 상세 정보를 불러옴
        setGraphData(detail.temperatureData || []); // 그래프 데이터 상태 업데이트
        setBoxPlotData([detail.boxplotStats].filter(data => data)); // 박스플롯 데이터 상태 업데이트
        setAdditionalInfo(detail.additionalInfo || ''); // 추가 정보 상태 업데이트
      }
    };

    fetchDetails();
  }, [selectedItems]);

  const handleAdditionalInfoChange = async (newInfo) => {
    setAdditionalInfo(newInfo); // 입력된 추가 정보로 상태 업데이트
    if (selectedItems.length > 0) {
      await updateData(selectedItems[0], { additionalInfo: newInfo }); // 수정된 추가 정보를 서버에 저장
    }
  };

  return (
    <div className={styles['graphDataWrap']}>
      <div className={styles['graphDataContainer']}>
        <div className={styles['leftPanel']}>
          <div className={styles['titleName']}>Graph Data Visualization</div>
          {graphData.length > 0 ? <LineGraph averagedData={graphData} /> : <p>Line graph 데이터를 불러오는 중...</p>}
          {boxPlotData.length > 0 ? (
            boxPlotData.map((data, index) => <BoxGraph key={index} boxplotStats={data} />)
          ) : (
            <p>Box plot graph 데이터를 불러오는 중...</p>
          )}
          <TextInputBox
            label="추가 정보: "
            value={additionalInfo}
            onTextChange={handleAdditionalInfoChange} // 사용자 입력을 처리하여 상태 업데이트 및 서버에 저장
          />
        </div>
        <div className={styles['rightPanel']}>
          <DataListUI />
        </div>
      </div>
    </div>
  );
}

export default ViewDataPage;
