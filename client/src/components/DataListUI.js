// src/components/DataListUI.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDataList } from '../api'; // API 호출 함수 임포트

function DataListUI() {
  const [dataList, setDataList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDataList = async () => {
      const data = await fetchDataList();
      setDataList(data);
    };
    loadDataList();
  }, []);

  const handleSelectData = (dataItem) => {
    navigate('/view-data', { state: { selectedData: dataItem } });
  };

  return (
    <div>
      {dataList.map((dataItem, index) => (
        <div key={index}>
          {/* numbering과 filedate를 조합하여 표시 */}
          {/* <span>{`${dataItem.filedate}_${dataItem.numbering.wNumber}_${dataItem.numbering.dwNumber}_${dataItem.numbering.dieNumber}`}</span> */}
          <button onClick={() => handleSelectData(dataItem)}>불러오기</button>
        </div>
      ))}
    </div>
  );
}

export default DataListUI;

