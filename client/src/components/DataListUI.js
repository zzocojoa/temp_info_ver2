// src/components/DataListUI.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDataList } from '../api';

function DataListUI() {
  const [dataList, setDataList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]); // 선택된 항목을 관리하는 상태
  const navigate = useNavigate();

  useEffect(() => {
    const loadDataList = async () => {
      const data = await fetchDataList();
      setDataList(data);
    };
    loadDataList();
  }, []);

  // 데이터 항목 클릭 이벤트 핸들러
  const handleItemClick = (itemId) => {
    setSelectedItems(prev => {
      // 이미 선택된 항목이면 제거, 아니면 추가
      return prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId];
    });
  };

  // 선택된 데이터 불러오기
  const handleLoadSelectedData = () => {
    // 여기에서 선택된 항목을 사용하여 불러오기 로직 구현
    navigate('/view-data', { state: { selectedItems } });
    console.log('Selected Items:', selectedItems);
  };

  return (
    <div>
      {dataList.map((dataItem, index) => (
        <div key={index} onClick={() => handleItemClick(dataItem._id)} style={{cursor: 'pointer'}}>
          <span>
            {`${dataItem.filedate}_${dataItem.numbering?.wNumber ?? 'N/A'}_${dataItem.numbering?.dwNumber ?? 'N/A'}_${dataItem.numbering?.dieNumber ?? 'N/A'}`}
          </span>
          {/* 선택 상태 표시 (옵션) */}
          {selectedItems.includes(dataItem._id) ? <span> (선택됨)</span> : null}
        </div>
      ))}
      <button onClick={handleLoadSelectedData}>불러오기</button>
    </div>
  );
}

export default DataListUI;
