import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDataList, deleteData } from '../api';
import styles from './DataListUI.module.css';

function DataListUI() {
  const [dataList, setDataList] = useState([]);
  const [filteredDataList, setFilteredDataList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [displayCount, setDisplayCount] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadDataList = async () => {
      const data = await fetchDataList();
      console.log("Initial data loaded:", data);
      setDataList(data);
      setFilteredDataList(data); // 초기에는 모든 데이터를 보여줌
    };
    loadDataList();
  }, []);

  useEffect(() => {
    // searchTerm이 변경될 때마다 실행, dataList를 기반으로 필터링
    const filtered = dataList.filter(dataItem =>
      `${dataItem.filedate}_${dataItem.numbering?.wNumber ?? ''}_${dataItem.numbering?.dwNumber ?? ''}_${dataItem.numbering?.dieNumber ?? ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    console.log("Filtered data:", filtered);
    setFilteredDataList(filtered); // 필터링된 결과를 저장
    setDisplayCount(10); // 검색 후 보여줄 아이템 수를 초기화
  }, [searchTerm]);

  const handleCheckboxChange = (itemId) => {
    setSelectedItems(prev => prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]);
  };

  const handleScrollDown = () => {
    setDisplayCount(prev => prev + 10);
  };

  const handleLoadSelectedData = () => {
    navigate('/view-data', { state: { selectedItems } });
  };

  const handleRemoveSelectedData = async () => {
    for (let itemId of selectedItems) {
      try {
        await deleteData(itemId);
      } catch (error) {
        console.error("Error removing data:", error);
      }
    }
    const updatedDataList = dataList.filter(item => !selectedItems.includes(item._id));
    setDataList(updatedDataList); // 전체 리스트 업데이트
    setFilteredDataList(updatedDataList); // 필터링된 리스트도 동일하게 업데이트
    setSelectedItems([]); // 선택된 항목 초기화
  };


  return (
    <div className={styles['DataListUIWrap']}>
      <input
        type="text"
        placeholder="데이터 검색..."
        className={styles.searchInput}
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <div className={styles['DataListContainer']} style={{ overflowY: 'auto', maxHeight: '500px' }}>
        {filteredDataList.slice(0, displayCount).map((dataItem, index) => (
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
        {displayCount < dataList.length && (
          <button onClick={handleScrollDown} className={styles.loadMoreButton}>더 보기</button>
        )}
      </div>
      {selectedItems.length > 0 && (
        <button onClick={handleRemoveSelectedData} className={styles.removeButton}>선택된 데이터 제거</button>
      )}
      <button onClick={handleLoadSelectedData} className={styles.loadDataButton}>불러오기</button>
    </div>
  );
}

export default DataListUI;
