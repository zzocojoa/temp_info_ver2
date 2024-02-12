import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LineGraph from '../components/LineGraph';
import BoxGraph from '../components/BoxGraph'; // BoxPlotGraph로 가정
import { fetchDataDetails } from '../api';

function ViewDataPage() {
  const location = useLocation();
  const { selectedItems } = location.state || {};
  const [graphData, setGraphData] = useState([]);
  const [boxPlotData, setBoxPlotData] = useState([]);

  useEffect(() => {
    const fetchDetails = async () => {
      const detailsPromises = selectedItems.map(id => fetchDataDetails(id));
      const results = await Promise.all(detailsPromises);
      console.log("API response for details:", results); // API 응답 확인
      
      // 각 항목의 graphData와 boxPlotData를 추출합니다.
      const allGraphData = results.flatMap(detail => detail.graphData || []);
      const allBoxPlotData = results.map(detail => detail.boxPlotData).filter(data => data); // null 또는 undefined가 아닌 boxPlotData만 필터링
      
      setGraphData(allGraphData);
      setBoxPlotData(allBoxPlotData);
      
      console.log("Loaded graph data:", allGraphData); // 로드된 graphData 확인
      console.log("Loaded box plot data:", allBoxPlotData); // 로드된 boxPlotData 확인
    };

    if (selectedItems && selectedItems.length > 0) {
      fetchDetails();
    }
  }, [selectedItems]);

  // graphData와 boxPlotData 상태가 업데이트될 때마다 콘솔에 출력합니다.
  useEffect(() => {
    console.log("Current graph data state:", graphData);
    console.log("Current box plot data state:", boxPlotData);
  }, [graphData, boxPlotData]);

  return (
    <div>
      <h2>Graph Data Visualization</h2>
      {graphData.length > 0 ? (
        <LineGraph data={graphData} />
      ) : (
        <p>Line graph 데이터를 불러오는 중...</p>
      )}
      {boxPlotData.length > 0 ? (
        <BoxGraph data={boxPlotData} />
      ) : (
        <p>Box plot graph 데이터를 불러오는 중...</p>
      )}
    </div>
  );
}

export default ViewDataPage;
