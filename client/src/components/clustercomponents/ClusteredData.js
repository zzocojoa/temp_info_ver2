// client\src\components\clustercomponents\ClusteredData.js

import React, { useState, useEffect } from 'react';
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
import { fetchClusteredData, searchDwNumber } from '../../api';
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

const getChartOptions = () => ({
  responsive: true,
  scales: {
    x: {
      type: 'linear',
      title: {
        display: true,
        text: 'Median Temperature(℃)',
        font: { size: 18 },
      },
      ticks: { font: { size: 14 } },
    },
    y: {
      type: 'linear',
      title: {
        display: true,
        text: 'Die Number',
        font: { size: 18 },
      },
      ticks: { font: { size: 14 } },
    },
  },
  plugins: {
    legend: {
      position: 'top',
      labels: { font: { size: 14 } },
    },
    title: {
      display: true,
      text: 'Clustering Visualization',
      font: { size: 22 },
    },
  },
});

const ClusteredDataVisualization = () => {
  const [dwNumber, setDwNumber] = useState('');
  const [k, setK] = useState(3);
  const [chartData, setChartData] = useState({ datasets: [] });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  

  useEffect(() => {
    const loadSuggestions = async () => {
      // 입력 값에 관계없이 searchDwNumber 함수를 호출합니다.
      const dwNumbers = await searchDwNumber(dwNumber);
      // 중복 제거 로직은 유지합니다.
      const uniqueDwNumbers = [...new Set(dwNumbers.map(item => item))];
      setSuggestions(uniqueDwNumbers);
      setShowSuggestions(true); // 항상 드롭다운을 보여줍니다.
    };
    loadSuggestions();
  }, [dwNumber]);

  const validateInputs = () => {
    if (!dwNumber.trim() || k <= 0 || isNaN(k)) {
      alert('정확한 DW 번호와 k 값을 입력해주세요. k는 양의 정수여야 합니다.');
      return false;
    }
    return true;
  };

  const fetchData = async () => {
    if (!validateInputs()) return;
  
    try {
      // 서버로부터 클러스터링 데이터 및 centroids 가져오기
      const { data: clusteredData, centroids, message } = await fetchClusteredData(dwNumber, k);
      
      // 클러스터링 데이터나 중심점 데이터가 없을 경우 서버에서 전달한 메시지를 사용하여 사용자에게 알립니다.
      if (!clusteredData || !centroids) {
        alert(`데이터를 불러오는 데 실패했습니다: ${message}`);
        return;
      }
  
      // 클러스터링 데이터를 기반으로 차트 데이터셋을 구성합니다.
      const clusterGroups = clusteredData.reduce((groups, dataPoint) => {
        const cluster = dataPoint.cluster;
        if (!groups[cluster]) groups[cluster] = [];
        groups[cluster].push({
          x: dataPoint.median,
          y: parseFloat(dataPoint.dieNumber),
        });
        return groups;
      }, {});
  
      // 차트에 표시할 데이터셋 배열을 구성합니다.
      const datasets = Object.entries(clusterGroups).map(([cluster, dataPoints]) => ({
        label: `Cluster ${cluster}`,
        data: dataPoints,
        backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`,
        radius: 4,
      }));
  
      // 중심점 데이터가 있을 경우, 해당 데이터를 차트 데이터셋에 추가합니다.
      if (centroids.length) {
        datasets.push({
          label: 'Centroids',
          data: centroids.map(({ x, y }) => ({ x, y })),
          backgroundColor: 'red',
          pointStyle: 'rectRot',
          radius: 10,
        });
      }
  
      // 구성된 데이터셋을 차트 데이터로 설정합니다.
      setChartData({ datasets });
    } catch (error) {
      // 오류 발생 시, 서버로부터 받은 오류 메시지 또는 기본 오류 메시지를 사용하여 알립니다.
      const errorMessage = error.response?.data?.message || '알 수 없는 오류가 발생했습니다.';
      alert(errorMessage);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setDwNumber(suggestion); // 사용자가 선택한 값으로 dwNumber 상태 업데이트
    setTimeout(() => setShowSuggestions(false), 100); // 드롭다운 리스트를 숨김
  };

  // 입력 필드의 onBlur 이벤트 핸들러
  const handleBlur = () => {
    // onBlur 이벤트가 너무 빠르게 발생하여 onClick 이벤트를 방해하지 않도록 setTimeout 사용
    setTimeout(() => setShowSuggestions(false), 100);
  };

  return (
    <div className={styles['clusterWrap']}>
      <div className={styles['clusterContainer']}>
        <div className={styles['clusterTextWrap']}>
          <div className={styles['clusterTextContainer']}>
            <div className={styles['clusterTextBox']}>
              <input
                id="dwNumberInput"
                className={styles['clusterText']}
                type="text"
                pattern='\d+'
                placeholder="DW Number..."
                value={dwNumber}
                onChange={(e) => setDwNumber(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={handleBlur}
              />
              <label htmlFor="dwNumberInput" className={styles['clusterTextLabel']}>DW Number</label>
              {showSuggestions && suggestions.length > 0 && (
                <ul className={`${styles['suggestions']} ${styles['scroll']} ${styles['scroll-css']}`}>
                  {suggestions.map((suggestion, index) => (
                    <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className={styles['clusterKBox']}>
              <input
                id="kInput"
                className={styles['clusterCount']}
                type="text"
                pattern='\d+'
                placeholder="Enter Number of Clusters (k)"
                value={k}
                onChange={(e) => setK(Number(e.target.value))}
              />
              <label htmlFor="kInput" className={styles['clusterKLabel']}>K-Number</label>
            </div>
            <button className={styles['clusterLoadData']} onClick={fetchData}>생성</button>
          </div>
        </div>
        <div className={styles['clusterBox']}>
          <Scatter data={chartData} options={getChartOptions()} />
        </div>
      </div>
    </div>
  );
};

export default ClusteredDataVisualization;
