// client/src/components/DataListUI.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDataList, deleteData } from '../api';
import styles from './DataListUI.module.css'; // CSS 모듈 임포트

function DataListUI() {
  const [dataList, setDataList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [displayCount, setDisplayCount] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDataList = async () => {
      const data = await fetchDataList();
      setDataList(data);
    };
    loadDataList();
  }, []);

  const handleCheckboxChange = (itemId) => {
    setSelectedItems(prev => prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId].slice(0, 5));
  };

  const handleScrollDown = () => {
    setDisplayCount(prev => prev + 5);
  };

  const handleLoadSelectedData = () => {
    navigate('/view-data', { state: { selectedItems } });
  };

  // 선택한 데이터 항목을 서버에서 제거하는 함수
  const handleRemoveData = async (itemId) => {
    try {
      await deleteData(itemId); // 서버에서 항목 제거
      setDataList(dataList.filter(item => item._id !== itemId)); // 클라이언트 상태 업데이트
      setSelectedItems(selectedItems.filter(id => id !== itemId)); // 선택된 항목 목록에서도 제거
    } catch (error) {
      console.error("Error removing data:", error);
    }
  };

  return (
    <div>
      {dataList.slice(0, displayCount).map((dataItem, index) => (
        <div key={index} className={styles.dataItem}>
          <label htmlFor={`checkbox-${dataItem._id}`} className={styles.dataItemLabel}>
            <input
              type="checkbox"
              id={`checkbox-${dataItem._id}`}
              checked={selectedItems.includes(dataItem._id)}
              onChange={() => handleCheckboxChange(dataItem._id)}
            />
            {`${dataItem.filedate}_${dataItem.numbering?.wNumber ?? 'N/A'}_${dataItem.numbering?.dwNumber ?? 'N/A'}_${dataItem.numbering?.dieNumber ?? 'N/A'}`}
          </label>
          {/* "제거" 버튼을 map 함수 내부에 추가 */}
          <button onClick={() => handleRemoveData(dataItem._id)} className={styles.removeButton}>제거</button>
        </div>
      ))}
      {displayCount < dataList.length && (
        <button onClick={handleScrollDown} className={styles.loadMoreButton}>더 보기</button>
      )}
      <button onClick={handleLoadSelectedData} className={styles.loadDataButton}>불러오기</button>
    </div>
  );
}

export default DataListUI;
