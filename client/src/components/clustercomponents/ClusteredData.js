// client/src/components/clustercomponents/ClusteredData.js

import React, { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { fetchClusteredData } from '../../api';

// 필요한 차트 구성 요소를 등록
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ClusteredDataVisualization = () => {
  const [data, setData] = useState({
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchClusteredData();
        console.log("Response from fetchClusteredData: ", response);
        let clusteredData = response.data; // 서버 응답에서 실제 데이터 접근 경로를 확인하고 수정해야 할 수 있음

        // clusteredData가 배열인지 확인하고, 배열이 아니라면 적절히 처리
        if (!Array.isArray(clusteredData)) {
          console.error("Fetched data is not an array:", clusteredData);
          clusteredData = []; // 예시 처리: 데이터를 빈 배열로 설정
        }

        // 클러스터별로 데이터 그룹화
        const clusters = {};
        clusteredData.forEach(point => {
          const { cluster, median, dieNumber } = point;
          clusters[cluster] = clusters[cluster] || [];
          clusters[cluster].push({ x: median, y: parseFloat(dieNumber) });
        });

        // 각 클러스터에 대한 데이터셋 생성
        const datasets = Object.keys(clusters).map(clusterId => ({
          label: `Cluster ${clusterId}`,
          data: clusters[clusterId],
          backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`,
        }));

        setData({ datasets });
      } catch (error) {
        console.error("Error loading data: ", error);
      }
    };

    fetchData();
  }, []);

  const options = {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: { display: true, text: 'Median' },
      },
      y: {
        type: 'linear',
        title: { display: true, text: 'Die Number' },
      },
    },
  };

  return (
    <div>
      <h2>클러스터링 결과 시각화</h2>
      <Scatter data={data} options={options} />
    </div>
  );
};

export default ClusteredDataVisualization;