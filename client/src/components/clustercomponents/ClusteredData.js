// client/src/components/clustercomponents/ClusteredData.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// 필요한 차트 구성 요소를 등록
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ClusteredDataVisualization = () => {
  const [data, setData] = useState({
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/data-list');
        const clusteredData = response.data;
        console.log("clusteredData: ", clusteredData)

        const datasets = clusteredData.map((item, index) => ({
          label: `Cluster ${index + 1}`,
          data: item.temperatureData.map(d => ({
            x: d.median,
            y: d.numbering.dieNumber,
          })),
          backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`,
        }));

        setData({ datasets });
      } catch (error) {
        console.error("데이터 로딩 실패", error);
      }
    };

    fetchData();
  }, []);

  const options = {
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Median',
        },
      },
      y: {
        type: 'linear',
        title: {
          display: true,
          text: 'Die Number',
        },
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
