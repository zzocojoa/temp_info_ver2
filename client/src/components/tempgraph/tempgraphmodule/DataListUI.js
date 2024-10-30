// client\src\components\tempgraph\tempgraphmodule\DataListUI.js

import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';
import { fetchDataList, deleteData, fetchDataDetails } from '../../../api';
import DataUploadComponent from './DataUploadComponent';
import styles from './DataListUI.module.css';

function DataListUI() {
  const [dataList, setDataList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isHandleSaveCsvChecked, setIsHandleSaveCsvChecked] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const hasFetchedData = useRef(false); // 중복 호출 방지 플래그

  // 검색 필터링 최적화
  const filteredDataList = useMemo(() => {
    if (!searchTerm) return dataList;
    return dataList.filter(dataItem =>
      `${dataItem.filedate}-${dataItem.numbering.countNumber}_${dataItem.numbering.wNumber}_${dataItem.numbering.dwNumber}_${dataItem.numbering.dieNumber}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, dataList]);

  // CSV 모드 텍스트
  const csvSaveModeText = useMemo(() => (isHandleSaveCsvChecked ? "개별" : "복수"), [isHandleSaveCsvChecked]);

  // 데이터 로드 함수
  const loadDataList = useCallback(async () => {
    if (isLoading || hasFetchedData.current) return; // 중복 요청 방지
    try {
      setIsLoading(true);
      const response = await fetchDataList();
      setDataList(response || []);
      hasFetchedData.current = true;
    } catch (error) {
      console.error("데이터 로딩 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    loadDataList();
  }, [loadDataList]);

  // 아이템 선택 처리
  const handleCheckboxChange = useCallback((itemId) => {
    setSelectedItems(prev => prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]);
  }, []);

  const handleLoadSelectedData = useCallback(() => {
    navigate('/view-data', { state: { selectedItems } });
    setSelectedItems([]);
  }, [navigate, selectedItems]);

  const handleRemoveSelectedData = async () => {
    try {
      await Promise.all(selectedItems.map(itemId => deleteData(itemId)));
      setDataList(prev => prev.filter(item => !selectedItems.includes(item._id)));
      setSelectedItems([]);
    } catch (error) {
      console.error("데이터 삭제 중 오류 발생:", error);
      alert('데이터 삭제에 실패했습니다.');
    }
  };

  const handleSelectAllChange = useCallback((e) => {
    setSelectedItems(e.target.checked ? filteredDataList.map(item => item._id) : []);
  }, [filteredDataList]);

  // CSV 저장 핸들러 최적화
  const handleSaveCsv = useCallback(async () => {
    const selectedDataDetails = await Promise.all(selectedItems.map(id => fetchDataDetails(id)));
    if (isHandleSaveCsvChecked) {
      selectedDataDetails.forEach((item) => {
        const csvHeader = 'date,time,temperature\n';
        const csvRows = item.temperatureData.map(tempData => `"${tempData.date}","${tempData.time}","${tempData.temperature}"`).join("\n");
        const csvFileName = `${item.filedate}-${item.numbering.countNumber}_${item.numbering.wNumber}_${item.numbering.dwNumber}_${item.numbering.dieNumber}`.replace(/\/|:|\s/g, '_');
        downloadCsv(`${csvHeader}${csvRows}`, `${csvFileName}.csv`);
      });
    } else {
      const csvHeader = 'filedate,countNumber,wNumber,dwNumber,dieNumber,min,median,max,startTime,endTime\n';
      const csvRows = selectedDataDetails.map(item =>
        `"${item.filedate}","${item.numbering.countNumber}","${item.numbering.wNumber}","${item.numbering.dwNumber}","${item.numbering.dieNumber}","${item.boxplotStats.min}","${item.boxplotStats.median}","${item.boxplotStats.max}","${item.startTime}","${item.endTime}"`
      ).join("\n");
      downloadCsv(`${csvHeader}${csvRows}`, 'selected_data.csv');
    }
  }, [isHandleSaveCsvChecked, selectedItems]);

  // CSV 데이터 저장 로직을 분리하여 재사용 가능하게 만듦
  const downloadCsv = (csvContent, fileName) => {
    const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csvContent}`);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Row 컴포넌트를 외부로 분리하여 최적화
  const Row = useCallback(({ index, style }) => {
    const { _id, filedate, numbering } = filteredDataList[index];
    return (
      <div style={style} key={_id} className={styles['dataItem']}>
        <label htmlFor={`checkbox-${_id}`} className={styles['dataItemLabel']}>
          <input
            type="checkbox"
            id={`checkbox-${_id}`}
            checked={selectedItems.includes(_id)}
            onChange={() => handleCheckboxChange(_id)}
          />
          {`${filedate}-${numbering.countNumber ?? 'N/A'}_${numbering.wNumber ?? 'N/A'}_${numbering.dwNumber ?? 'N/A'}_${numbering.dieNumber ?? 'N/A'}`}
        </label>
      </div>
    );
  }, [filteredDataList, selectedItems, handleCheckboxChange]);

  const displayCounts = (
    <div className={styles['dataCountsWrap']}>
      <div className={styles['dataCountsContainer']}>
        <div className={styles['dataCounts']}>
          <span>총: {filteredDataList.length}</span>
        </div>
        <div className={styles['dataSelectCount']}>
          <span>선택: {selectedItems.length}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles['DataListUIWrap']}>
      <div className={styles['searchWrap']}>
        <span className={styles['searchText']}>Search</span>
        <input
          type="text"
          placeholder="데이터 검색..."
          className={styles['searchContainer']}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <DataUploadComponent />
      {displayCounts}
      <div className={styles['selectAllCheckbox']}>
        <label className={styles['checkboxLabel']}>
          <input
            type="checkbox"
            checked={selectedItems.length === filteredDataList.length && filteredDataList.length > 0}
            onChange={handleSelectAllChange}
          /> 전체 선택
        </label>
        <label className={styles['checkboxLabel']}>
          <input
            type="checkbox"
            checked={isHandleSaveCsvChecked}
            onChange={e => setIsHandleSaveCsvChecked(e.target.checked)}
          />
          {`저장 유형: ${csvSaveModeText}`}
        </label>
      </div>
      <div className={styles['DataListContainer']}>
        <List
          className={`${styles['scroll']} ${styles['scroll-css']}`}
          height={400}
          itemCount={filteredDataList.length}
          itemSize={30}
          width={'100%'}
        >
          {Row}
        </List>
      </div>
      <div className={styles['buttonWrap']}>
        <div className={styles['buttonContainer']}>
          {selectedItems.length > 0 && (
            <button onClick={handleRemoveSelectedData} className={styles['removeButton']}>제거</button>
          )}
        </div>
        <div className={styles['userButton']}>
          <div>
            <button onClick={handleLoadSelectedData} className={styles['loadDataButton']}>불러오기</button>
          </div>
          <div>
            <button onClick={handleSaveCsv} className={styles['saveCsvButton']}>CSV 데이터 저장</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataListUI;

