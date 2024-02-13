import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDataList, deleteData } from '../api';
import styles from './DataListUI.module.css';

function DataListUI() {
  const [dataList, setDataList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [displayCount, setDisplayCount] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDataList = async () => {
      const data = await fetchDataList();
      setDataList(data);
    };
    loadDataList();
  }, []);

  const handleCheckboxChange = (itemId) => {
    setSelectedItems(prev => prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]);
  };

  const handleScrollDown = () => {
    setDisplayCount(prev => prev + 5);
  };

  const handleLoadSelectedData = () => {
    navigate('/view-data', { state: { selectedItems } });
  };

  // 여러 데이터 항목을 서버에서 제거하는 함수
  const handleRemoveSelectedData = async () => {
    for (let itemId of selectedItems) {
      console.log("itemId :", itemId)

      try {
        await deleteData(itemId);
      } catch (error) {
        console.error("Error removing data:", error);
      }
    }
    setDataList(dataList.filter(item => !selectedItems.includes(item._id)));
    setSelectedItems([]);
  };

  return (
    <div className={styles['DataListUIWrap']}>
      <div className={`${styles['DataListContainer']} ${styles['scroll']} ${styles['scroll-css']}`}
        style={{ overflowY: 'auto', maxHeight: '500px' }}>
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
          </div>
        ))}
      </div>
      <div className={styles['buttonWrap']}>
        <div className={styles['buttonContainer']}>
          {displayCount < dataList.length && (
            <button onClick={handleScrollDown} className={styles.loadMoreButton}>더 보기</button>
          )}
          {selectedItems.length > 0 && (
            <button onClick={handleRemoveSelectedData} className={styles.removeButton}>제거</button>
          )}
        </div>
        <div>
          <button onClick={handleLoadSelectedData} className={styles.loadDataButton}>불러오기</button>
        </div>
      </div>
    </div>

  );
}

export default DataListUI;
