// DataListUI.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDataList } from '../api';
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

  return (
    <div>
      {dataList.slice(0, displayCount).map((dataItem, index) => (
        <div key={index} className={styles.dataItem}>
          {/* 체크박스와 레이블을 <label>로 감싸고 htmlFor과 id를 사용하여 연결 */}
          <label htmlFor={`checkbox-${dataItem._id}`} className={styles.dataItemLabel}>
            <input
              type="checkbox"
              id={`checkbox-${dataItem._id}`}
              checked={selectedItems.includes(dataItem._id)}
              onChange={() => handleCheckboxChange(dataItem._id)}
            />
            {`${dataItem.filedate}_${dataItem.numbering?.wNumber ?? 'N/A'}_${dataItem.numbering?.dwNumber ?? 'N/A'}_${dataItem.numbering?.dieNumber ?? 'N/A'}`}
          </label>
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
