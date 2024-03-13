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
import styles from './ClusteredData.module.css';

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
            label: `Cluster ${cluster}`,
            data: clusterGroups[cluster],
            backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 2)`,
            radius: 4, // 크기를 조정
          };
        });

        // 중심점 데이터셋 생성
        if (centroids) {
          datasets.push({
            label: '중심점',
            data: centroids.map(centroid => ({
              x: centroid.x,
              y: centroid.y,
            })),
            backgroundColor: 'gray', // 중심점을 빨간색으로 표시
            pointStyle: 'rectRot', // X 모양으로 표시, 'rectRot' 대신 'cross'를 사용해도 됨
            radius: 15, // 크기를 조정
          });
        }

        setChartData({ datasets });
        console.log("datasets: ", datasets)
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
          text: 'Median Temperature(℃)',
          font: {
            size: 18 // x축 제목 폰트 크기 설정
          }
        },
        ticks: {
          font: {
            size: 14 // x축 눈금 폰트 크기 설정
          }
        }
      },
      y: {
        type: 'linear',
        title: {
          display: true,
          text: 'Die Number(no.)',
          font: {
            size: 18 // y축 제목 폰트 크기 설정
          }
        },
        ticks: {
          font: {
            size: 14 // y축 눈금 폰트 크기 설정
          }
        }
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14 // 범례 폰트 크기 설정
          }
        }
      },
      title: {
        display: true,
        text: 'Clustering Visualization',
        font: {
          size: 22 // 차트 제목 폰트 크기 설정
        }
      }
    },
  };

  return (
    <div className={styles['clusterWrap']}>
      <div className={styles['clusterContainer']}>
        <div className={styles['clusterBox']}>
          {/* <h2>Clustering Visualization</h2> */}
          <Scatter data={chartData} options={options} />
        </div>
      </div>
    </div>

  );
};

export default ClusteredDataVisualization;
