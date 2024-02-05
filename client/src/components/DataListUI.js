// src\components\DataListUI.js

import React, { useEffect, useState } from 'react';

function DataListUI({ onSelectData, onDeleteData }) {
  const [dataList, setDataList] = useState([]);

  const handleSelectData = (dataItem) => {
    onDataSelect(dataItem); // 선택된 데이터 처리
    navigate('/view-data', { state: { selectedData: dataItem } }); // /view-data 페이지로 이동
  };

  useEffect(() => {
    const fetchDataList = async () => {
      // 서버로부터 데이터 리스트를 불러옴
      try {
        const response = await fetch('YOUR_API_ENDPOINT/data-list');
        if (response.ok) {
          const data = await response.json();
          setDataList(data);
        } else {
          alert('Failed to fetch data list.');
        }
      } catch (error) {
        console.error('Error fetching data list:', error);
        alert('Error fetching data list.');
      }
    };

    fetchDataList();
  }, []);

  return (
    <div>
      {dataList.map((dataItem, index) => (
        <div key={index}>
          <span>{dataItem.name}</span>
          <button onClick={() => handleSelectData(dataItem)}>Load</button>
          <button onClick={() => onSelectData(dataItem)}>Load</button>
          <button onClick={() => onDeleteData(dataItem)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default DataListUI;
