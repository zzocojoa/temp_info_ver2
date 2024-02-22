// src/components/SaveCsvDataButton.js

import React from 'react';
import styles from './SaveCsvDataButton.module.css'
import { saveData } from '../api';

function SaveCsvDataButton({ data, fileName, onSaveSuccess }) {
  const downloadCsv = (data, fileName) => {
    // numbering 정보가 있는 경우 해당 값을 사용하고, 없는 경우 기본값 사용
    const { wNumber = 'N/A', dwNumber = 'N/A', dieNumber = 'N/A' } = data.numbering || {};
    const { graphData } = data;

    // 파일명에서 날짜 추출
    const dateMatch = fileName.match(/\d{4}-\d{2}-\d{2}/);
    const dateFromFileName = dateMatch ? dateMatch[0] : new Date().toISOString().split('T')[0];

    const finalFileName = `${dateFromFileName}_${wNumber}_${dwNumber}_${dieNumber}.csv`;
    console.log("finalFileName :", finalFileName);
    let csvContent = "data:text/csv;charset=utf-8,Date,Time,Temperature\n";

    // graphData가 정의되지 않았을 경우를 처리
    (graphData || []).forEach(row => {
      const { Date, Time, Temperature } = row;
      csvContent += `${Date},${Time},${Temperature}\n`;
    });

    // CSV 파일 다운로드 로직
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', finalFileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveData = async () => {
    try {
      const dateMatch = fileName.match(/\d{4}-\d{2}-\d{2}/);
      const filedate = dateMatch ? dateMatch[0] : new Date().toISOString().split('T')[0]; // 파일명에서 날짜 추출
      const { userInput } = data;

      await saveData({ ...data, filedate, userInput });
      onSaveSuccess();
    } catch (error) {
      alert('Error saving data.');
    }
    downloadCsv(data, fileName);
  };

  return (
    <button className={styles['DownloadBtn']} onClick={handleSaveData}>Download CSV</button>
  );
}

export default SaveCsvDataButton;
