// src\components\UploadDataButton.js

import React, { useState } from 'react';
import styles from './UploadDataButton.module.css'
import { uploadFile } from '../api';
import Loader from './Loader';

function UploadDataButton({ selectedFile, onUploadSuccess, isEnabled }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async () => {

    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }

    setIsLoading(true); // 업로드 시작 시 로딩 상태를 true로 설정

    try {
      // API를 호출하여 파일 업로드
      const response = await uploadFile(selectedFile);
      setIsLoading(false); // 업로드 성공 또는 실패 시 로딩 상태를 false로 설정
      if (response) {
        const { averagedData, boxplotStats } = response;
        const startTime = averagedData[0]?.time || '';
        const endTime = averagedData[averagedData.length - 1]?.time || '';
        onUploadSuccess(averagedData, boxplotStats, selectedFile.name, startTime, endTime);
        // alert('File uploaded successfully!');
      } else {
        // 서버 응답이 없거나 업로드 실패 시
        alert('Failed to upload file.');
      }
    } catch (error) {
      setIsLoading(false); // 오류 발생 시 로딩 상태를 false로 설정
      console.error('Error uploading file:', error);
      alert('Error uploading file.');
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader /> // 로딩 중인 경우 로딩 인디케이터(스피너 등)를 표시
      ) : (
        <button className={styles['UploadDataButton']} onClick={handleUpload} disabled={!isEnabled || isLoading}>
          그래프 생성
        </button>
      )}
    </>
  );
}

export default UploadDataButton;
