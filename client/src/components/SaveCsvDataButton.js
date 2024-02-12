// src/components/SaveCsvDataButton.js

import React from 'react';
import styles from './SaveCsvDataButton.module.css'
import { saveData } from '../api';

function SaveCsvDataButton({ data, fileName, onSaveSuccess }) {
  const downloadCsv = (data, fileName) => {
    const { wNumber, dwNumber, dieNumber, graphData } = data;

    // 파일명에서 날짜 추출
    const dateMatch = fileName.match(/\d{4}-\d{2}-\d{2}/);
    const dateFromFileName = dateMatch ? dateMatch[0] : new Date().toISOString().split('T')[0];

    const finalFileName = `${dateFromFileName}_${wNumber}_${dwNumber}_${dieNumber}.csv`;
    let csvContent = "data:text/csv;charset=utf-8,";

    // CSV 헤더 추가
    csvContent += "Date,Time,Temperature\n";

    // 데이터 추가
    graphData.forEach(row => {
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

      await saveData({ ...data, filedate });
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
