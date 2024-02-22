// client\src\pages\ViewDataPage.js

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LineGraph from '../components/LineGraph';
import BoxGraph from '../components/BoxGraph';
import DataListUI from '../components/DataListUI';
import TextInputBox from '../components/TextInputBox';
import { fetchDataDetails } from '../api';
import styles from './GraphData.module.css'

function ViewDataPage() {
  const location = useLocation();
  const { selectedItems } = location.state || {};
  const [graphData, setGraphData] = useState([]);
  const [boxPlotData, setBoxPlotData] = useState([]);
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      const detailsPromises = selectedItems.map(id => fetchDataDetails(id));
      const results = await Promise.all(detailsPromises);
      // console.log("API response for details:", results);

      // MongoDB 스키마에 따라 수정된 데이터 접근 로직
      const allGraphData = results.flatMap(detail => detail.temperatureData || []);
      // 박스플롯 데이터는 각 문서마다 하나씩 존재한다고 가정
      const allBoxPlotData = results.map(detail => detail.boxplotStats).filter(data => data); // 모든 non-null 데이터 사용

      setGraphData(allGraphData);
      setBoxPlotData(allBoxPlotData);

      // console.log("Loaded graph data:", allGraphData);
      // console.log("Loaded box plot data:", allBoxPlotData);
    };

    if (selectedItems && selectedItems.length > 0) {
      fetchDetails();
    }
  }, [selectedItems]);

  return (
    <div className={styles.graphDataWrap}>
      <div className={styles.graphDataContainer}>
        <div className={styles.leftPanel}>
          <h2 className={styles.headerTitle}>Graph Data Visualization</h2>
          {graphData.length > 0 ? <LineGraph averagedData={graphData} /> : <p>Line graph 데이터를 불러오는 중...</p>}
          {boxPlotData.length > 0 ? (
            boxPlotData.map((data, index) => <BoxGraph key={index} boxplotStats={data} />)
          ) : (
            <p>Box plot graph 데이터를 불러오는 중...</p>
          )}
          <TextInputBox label="추가 정보:" value={userInput} onTextChange={setUserInput} />
        </div>
        <div className={styles.rightPanel}>
          <DataListUI />
        </div>

      </div>
    </div>
  );
}

export default ViewDataPage;