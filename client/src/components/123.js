// src/components/SaveCsvDataButton.js

import React from 'react';
import { saveData } from '../api';

function SaveCsvDataButton({ data, onSaveSuccess }) {
  // CSV 파일 다운로드를 위한 함수
  const downloadCSV = (data) => {
    const { wNumber, dwNumber, dieNumber } = data;
    // 현재 날짜를 YYYY-MM-DD 형식으로 포매팅
    const dateStr = new Date().toISOString().split('T')[0];
    const fileName = `${dateStr}_${wNumber}_${dwNumber}_${dieNumber}.csv`;

    // CSV 형식으로 변환할 데이터 준비
    const csvContent = "data:text/csv;charset=utf-8," 
      + Object.keys(data).map(key => `${key},${data[key]}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", fileName);
    document.body.appendChild(link); // 필요한 경우만 DOM에 추가

    link.click(); // 다운로드 링크 클릭을 시뮬레이션

    document.body.removeChild(link); // 정리
  };

  const handleSaveData = async () => {
    try {
      await saveData(data);
      onSaveSuccess(); // 성공 콜백 호출
      downloadCSV(data); // 데이터 저장 성공 후 CSV 다운로드
    } catch (error) {
      alert('Error saving data.'); // 사용자에게 에러 알림
    }
  };

  return (
    <button onClick={handleSaveData}>Save Data</button>
  );
}

export default SaveCsvDataButton;
