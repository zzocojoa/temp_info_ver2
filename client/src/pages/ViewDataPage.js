import React from 'react';
import { useLocation } from 'react-router-dom';
import LineGraph from '../components/LineGraph';
import BoxGraph from '../components/BoxGraph';

function ViewDataPage() {
  const location = useLocation();
  const { selectedData } = location.state || {}; // 이전 페이지로부터 전달된 데이터

  return (
    <div>
      <h2>View Data</h2>
      {/* 선택된 데이터를 기반으로 그래프 렌더링 */}
      <LineGraph data={selectedData?.lineGraphData} />
      <BoxGraph data={selectedData?.boxGraphData} />
    </div>
  );
}

export default ViewDataPage;
