import React from 'react';
import styles from './SaveCsvDataButton.module.css'
import { saveData } from '../../../api';

function SaveCsvDataButton({ data, fileName, onSaveSuccess, startTime, endTime }) {
  const downloadCsv = (data, fileName) => {
    const { countNumber = 'N/A', wNumber = 'N/A', dwNumber = 'N/A', dieNumber = 'N/A' } = data.numbering || {};
    const graphData = data.graphData;

    const dateMatch = fileName.match(/\d{4}-\d{2}-\d{2}/);
    const dateFromFileName = dateMatch ? dateMatch[0] : new Date().toISOString().split('T')[0];

    const finalFileName = `${dateFromFileName}-${countNumber}_${wNumber}_${dwNumber}_${dieNumber}.csv`;

    let csvContent = "date,time,temperature\n";
    graphData.forEach(row => {
      const { date, time, temperature } = row;
      csvContent += `${date},${time},${temperature}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) {
      // For Internet Explorer and Edge
      navigator.msSaveBlob(blob, finalFileName);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', finalFileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);  // Object URL 해제
      }
    }
  };

  // 다운로드 핸들 로직
  const handleSaveData = async () => {
    try {
      const dateMatch = fileName.match(/\d{4}-\d{2}-\d{2}/);
      const filedate = dateMatch ? dateMatch[0] : new Date().toISOString().split('T')[0]; // 파일명에서 날짜 추출
      const { userInput } = data;

      await saveData({ ...data, filedate, userInput, startTime, endTime });
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
