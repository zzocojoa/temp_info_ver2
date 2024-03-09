// client/src/components/tempgraph/tempgraphmodule/DataListUI.js

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
// 가상 스크롤링을 위해 react-window 사용
import { FixedSizeList as List } from 'react-window';
import { fetchDataList, deleteData, fetchDataDetails } from '../../../api';
import DataUploadComponent from './DataUploadComponent';
import styles from './DataListUI.module.css';

function DataListUI() {
  const [dataList, setDataList] = useState([]);
  const [filteredDataList, setFilteredDataList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isHandleSaveCsvChecked, setIsHandleSaveCsvChecked] = useState(true);
  const csvSaveModeText = isHandleSaveCsvChecked ? "개별" : "복수";
  const navigate = useNavigate();

  useEffect(() => {
    const loadDataList = async () => {
      try {
        const response = await fetchDataList();
        if (response && Array.isArray(response)) {
          setDataList(response);
          setFilteredDataList(response);
        }
      } catch (error) {
        console.error("데이터 로딩 중 오류 발생:", error);
        alert('데이터를 로드하는데 실패했습니다.');
      }
    };
    loadDataList();
  }, []);

  useEffect(() => {
    // searchTerm이 변경될 때마다 실행되며, dataList를 기반으로 필터링
    const filtered = dataList.filter(dataItem =>
      `${dataItem.filedate}-${dataItem.numbering?.countNumber ?? ''}_${dataItem.numbering?.wNumber ?? ''}_${dataItem.numbering?.dwNumber ?? ''}_${dataItem.numbering?.dieNumber ?? ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    setFilteredDataList(filtered); // 필터링된 결과를 저장
    // setDisplayCount(10); // 검색 후 보여줄 아이템 수를 초기화
  }, [searchTerm, dataList]);

  // useCallback을 사용하여 함수가 필요할 때만 재생성되도록 함
  const handleCheckboxChange = useCallback((itemId) => {
    setSelectedItems(prev => {
      const newSelectedItems = prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId];
      return newSelectedItems;
    });
  }, []);

  const handleLoadSelectedData = useCallback(() => {
    navigate('/view-data', { state: { selectedItems } });
    setSelectedItems([]); // 추가: 불러오기 후 선택된 아이템 상태 초기화
  }, [navigate, selectedItems]);

  const handleRemoveSelectedData = async () => {
    try {
      await Promise.all(selectedItems.map(itemId => deleteData(itemId)));
      const updatedDataList = dataList.filter(item => !selectedItems.includes(item._id));
      setDataList(updatedDataList);
      setFilteredDataList(updatedDataList);
      setSelectedItems([]);
    } catch (error) {
      console.error("데이터 삭제 중 오류 발생:", error);
      alert('데이터 삭제에 실패했습니다.');
    }
  };

  const handleSelectAllChange = useCallback((e) => {
    setSelectedItems(e.target.checked ? filteredDataList.map(item => item._id) : []);
  }, [filteredDataList]);

  // DB CSV data save
  const handleSaveCsv = useCallback(async () => {
    if (isHandleSaveCsvChecked) {
      const selectedDataDetails = await Promise.all(selectedItems.map(id => fetchDataDetails(id)));

      selectedDataDetails.forEach((item) => {
        // CSV 헤더
        const csvHeader = 'date,time,temperature\n';

        // 각 항목의 temperatureData를 CSV 형식의 문자열로 변환
        const csvRows = item.temperatureData.map(tempData => {
          const { date, time, temperature } = tempData;
          return `"${date}","${time}","${temperature}"`;
        }).join("\n");

        // 파일명 생성 로직 수정: 각 항목에 대한 고유 파일명 생성
        const { filedate, numbering: { countNumber, wNumber, dwNumber, dieNumber } } = item;
        // 파일명을 생성하는 부분을 forEach 루프 내부에 넣어 각 항목별로 고유한 이름을 가지도록 함
        const csvFileName = `${filedate}-${countNumber}_${wNumber}_${dwNumber}_${dieNumber}`.replace(/\/|:|\s/g, '_'); // 파일명에 사용 불가능한 문자는 '_'로 대체

        // CSV 헤더와 모든 행을 결합하여 최종 CSV 내용을 생성
        const csvContent = `data:text/csv;charset=utf-8,${csvHeader}${csvRows}`;
        const encodedUri = encodeURI(csvContent);

        // 임시 링크를 생성하여 프로그램적으로 클릭 이벤트를 발생시켜 파일 다운로드를 트리거
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `${csvFileName}.csv`); // 수정된 파일명 사용
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });

    } else {
      // 선택된 항목의 상세 정보를 비동기적으로 가져옵니다.
      const selectedDataDetails = await Promise.all(selectedItems.map(id => fetchDataDetails(id)));
      // CSV 헤더
      const csvHeader = 'filedate,countNumber,wNumber,dwNumber,dieNumber,min,median,max,startTime,endTime\n';
      // 각 항목을 CSV 형식의 문자열로 변환
      const csvRows = selectedDataDetails.map(item => {
        const { filedate, numbering: { countNumber, wNumber, dwNumber, dieNumber }, boxplotStats: { min, median, max }, startTime, endTime } = item;
        return `"${filedate}","${countNumber}","${wNumber}","${dwNumber}","${dieNumber}","${min}","${median}","${max}","${startTime}","${endTime}"`;
      });
      // CSV 헤더와 모든 행을 결합하여 최종 CSV 내용을 생성
      const csvContent = `data:text/csv;charset=utf-8,${csvHeader}${csvRows.join("\n")}`;
      // encodeURI를 사용하여 CSV 내용에 대한 URI를 생성
      const encodedUri = encodeURI(csvContent);
      // 임시 링크를 생성하여 프로그램적으로 클릭 이벤트를 발생시켜 파일 다운로드를 트리거
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'selected_data.csv'); // 다운로드될 파일명 설정
      document.body.appendChild(link); // 링크를 문서에 추가
      link.click(); // 링크 클릭 이벤트 강제 실행
      document.body.removeChild(link); // 사용 후 링크 제거
    }
  }, [isHandleSaveCsvChecked, selectedItems]);

  // 가상 리스트를 통해 대규모 데이터 렌더링 최적화
  const Row = useCallback(({ index, style }) => {
    const { _id, filedate, numbering } = filteredDataList[index];
    const { countNumber, wNumber, dwNumber, dieNumber } = numbering || {};
    return (
      <div style={style} key={_id} className={styles['dataItem']}>
        <label htmlFor={`checkbox-${_id}`} className={styles['dataItemLabel']}>
          <input
            type="checkbox"
            id={`checkbox-${_id}`}
            checked={selectedItems.includes(_id)}
            onChange={() => handleCheckboxChange(_id)}
          />
          {`${filedate}-${countNumber ?? 'N/A'}_${wNumber ?? 'N/A'}_${dwNumber ?? 'N/A'}_${dieNumber ?? 'N/A'}`}
        </label>
      </div>
    );
  }, [selectedItems, handleCheckboxChange, filteredDataList]);

  // 검색 결과 및 선택된 아이템 개수 표시
  const displayCounts = (
    <div className={styles['dataCountsWrap']}>
      <div className={styles['dataCountsContainer']}>
        <div className={styles['dataCounts']}>
          <span>총: {filteredDataList.length}</span>
        </div>
        <div className={styles['dataSelectCount']}>
          <span>선택: {selectedItems.length}</span>
        </div>
        <DataUploadComponent />
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
      {displayCounts}
      <div className={styles['selectAllCheckbox']}>
        <div className={styles['selectAllLabel']}>
          <label className={styles['checkboxLabel']}>
            <input
              type="checkbox"
              checked={selectedItems.length === filteredDataList.length && filteredDataList.length > 0}
              onChange={handleSelectAllChange}
            /> 전체 선택
          </label>
        </div>
        <div className={styles['selectAllLabel']}>
          <label className={styles['checkboxLabel']}>
            <input
              type="checkbox"
              checked={isHandleSaveCsvChecked}
              onChange={e => setIsHandleSaveCsvChecked(e.target.checked)}
            />
            <label>{`저장 유형: ${csvSaveModeText}`}</label>
          </label>
        </div>
      </div>
      <div className={styles['DataListContainer']}>
        <List className={` ${styles['scroll']} ${styles['scroll-css']}`}
          height={400} // 적절한 높이 설정
          itemCount={filteredDataList.length}
          itemSize={30} // 아이템의 높이
          width={'100%'} // 컨테이너의 너비
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
