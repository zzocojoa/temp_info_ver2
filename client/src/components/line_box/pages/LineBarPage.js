// client\src\components\line_box\pages\LineBarChart.js

import React, { useState, useEffect } from 'react';
import TemperatureChart from '../LineBarChartlogic/LineBarChartLogic';
import { fetchDataList } from '../../../api'; // 예시로 추가한 API 호출 함수
// 필요한 스타일 파일이 있다면 아래와 같이 import 합니다.
// import styles from './GraphDataPage.module.css';

const LineBarPage = React.memo(() => {
  const [fileMetadata, setFileMetadata] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchDataList(); // 서버로부터 데이터를 가져오는 API 호출
        setFileMetadata(data);
      } catch (error) {
        console.error('Error fetching file metadata:', error);
        // 에러 처리 로직 (예: 사용자에게 피드백 제공)
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <TemperatureChart fileMetadata={fileMetadata} />
    </div>
  );
});

export default LineBarPage;
