// client/src/components/DataListUI.js

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDataList, deleteData, fetchDataDetails } from '../api';
import styles from './DataListUI.module.css';

function DataListUI() {
  const [dataList, setDataList] = useState([]);
  const [filteredDataList, setFilteredDataList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [displayCount, setDisplayCount] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [isHandleSaveCsvChecked, setIsHandleSaveCsvChecked] = useState(true);
  const csvSaveModeText = isHandleSaveCsvChecked ? "개별" : "복수";
  const navigate = useNavigate();

  useEffect(() => {
    const loadDataList = async () => {
      const response = await fetchDataList();
      if (response && Array.isArray(response)) { // 응답 확인 및 배열인지 확인
        setDataList(response);
        setFilteredDataList(response); // 초기에는 모든 데이터를 보여줌
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
    // console.log("Filtered data:", filtered);
    setFilteredDataList(filtered); // 필터링된 결과를 저장
    setDisplayCount(10); // 검색 후 보여줄 아이템 수를 초기화
  }, [searchTerm, dataList]);

  const handleCheckboxChange = (itemId) => {
    setSelectedItems(prev => {
      const newSelectedItems = prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId];
      return newSelectedItems;
    });
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

  const handleSelectAllChange = (e) => {
    if (e.target.checked) {
      // 모든 데이터 항목의 ID를 selectedItems 배열에 추가
      setSelectedItems(filteredDataList.map(item => item._id));
    } else {
      // selectedItems 배열을 비움
      setSelectedItems([]);
    }
  };

  // DB CSV data save
  const handleSaveCsv = async () => {
    if (isHandleSaveCsvChecked) {
      const selectedDataDetails = await Promise.all(selectedItems.map(id => fetchDataDetails(id)));

      selectedDataDetails.forEach((item) => {
        // CSV 헤더
        const csvHeader = 'Date,Time,Temperature\n';

        // 각 항목의 temperatureData를 CSV 형식의 문자열로 변환
        const csvRows = item.temperatureData.map(tempData => {
          const { Date, Time, Temperature } = tempData;
          return `"${Date}","${Time}","${Temperature}"`;
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
      const csvHeader = 'filedate,countNumber,wNumber,dwNumber,dieNumber,median, startTime, endTime\n';

      // 각 항목을 CSV 형식의 문자열로 변환
      const csvRows = selectedDataDetails.map(item => {
        const { filedate, numbering: { countNumber, wNumber, dwNumber, dieNumber }, boxplotStats: { median }, startTime, endTime } = item;
        return `"${filedate}","${countNumber}","${wNumber}","${dwNumber}","${dieNumber}","${median}","${startTime}","${endTime}"`;
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
  };

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
      <div className={styles['selectAllCheckbox']}>
        <div className={styles['selectAllLabel']}>
          <input
            type="checkbox"
            checked={selectedItems.length === filteredDataList.length && filteredDataList.length > 0}
            onChange={handleSelectAllChange}
          />전체 선택
        </div>
        <div className={styles['selectAllLabel']}>
          <input
            type="checkbox"
            checked={isHandleSaveCsvChecked}
            onChange={e => setIsHandleSaveCsvChecked(e.target.checked)}
          />
          <label>{`저장 유형 선택: ${csvSaveModeText}`}</label>
        </div>
      </div>
      <div className={`${styles['DataListContainer']} ${styles['scroll']} ${styles['scroll-css']}`}>
        {filteredDataList.slice(0, displayCount).map((dataItem, index) => (
          <div key={index} className={styles['dataItem']}>
            <label htmlFor={`checkbox-${dataItem._id}`} className={styles['dataItemLabel']}>
              <input
                type="checkbox"
                id={`checkbox-${dataItem._id}`}
                checked={selectedItems.includes(dataItem._id)}
                onChange={() => handleCheckboxChange(dataItem._id)}
              />
              {`${dataItem.filedate}-${dataItem.numbering?.countNumber ?? 'N/A'}_${dataItem.numbering?.wNumber ?? 'N/A'}_${dataItem.numbering?.dwNumber ?? 'N/A'}_${dataItem.numbering?.dieNumber ?? 'N/A'}`}
            </label>
          </div>
        ))}
      </div>
      <div className={styles['buttonWrap']}>
        <div className={styles['buttonContainer']}>
          {displayCount < dataList.length && (
            <button onClick={handleScrollDown} className={styles['loadMoreButton']}>더 보기</button>
          )}
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
