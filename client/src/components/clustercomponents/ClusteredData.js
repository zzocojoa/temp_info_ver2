import React, { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { fetchClusteredData } from '../../api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ClusteredDataVisualization = () => {
  const [chartData, setChartData] = useState({
    datasets: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: clusteredData, centroids } = await fetchClusteredData();
        console.log("centroids: ", centroids)

        // 데이터셋을 클러스터 번호로 그룹화
        const clusterGroups = clusteredData.reduce((groups, dataPoint) => {
          groups[dataPoint.cluster] = groups[dataPoint.cluster] || [];
          groups[dataPoint.cluster].push({
            x: dataPoint.median,
            y: parseFloat(dataPoint.dieNumber),
          });
          return groups;
        }, {});

        // 클러스터 데이터셋 생성
        const datasets = Object.keys(clusterGroups).map(cluster => {
          return {
            label: `클러스터 ${cluster}`,
            data: clusterGroups[cluster],
            backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`,
          };
        });

        // 중심점 데이터셋 생성
        if (centroids) {
          datasets.push({
            label: '중심점',
            data: centroids.map(centroid => ({
              x: centroid[0],
              y: centroid[1],
            })),
            backgroundColor: 'red', // 중심점을 빨간색으로 표시
            pointStyle: 'rectRot', // 중심점을 X 모양으로 표시
            radius: 10, // 중심점의 크기 설정
          });
        }

        setChartData({ datasets });
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'linear',
        title: {
          display: true,
          text: 'Median Temperature',
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
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div>
      <h2>클러스터링 결과 시각화</h2>
      <Scatter data={chartData} options={options} />
    </div>
  );
};

export default ClusteredDataVisualization;
