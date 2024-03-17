// client/src/components/tempgraph/tempgraphmodule/UploadDataButton.js

import React, { useState } from 'react';
import styles from './UploadDataButton.module.css'
import { uploadFile } from '../../../api';
import Loader from './Loader';

function UploadDataButton({ selectedFile, onUploadSuccess, isEnabled }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async () => {

    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }

    setIsLoading(true);

    try {
      // API를 호출하여 파일 업로드
      const response = await uploadFile(selectedFile);
      setIsLoading(false); // 업로드 성공 또는 실패 시 로딩 상태를 false로 설정
      if (response) {
        const { averagedData, boxplotStats } = response;
        const startTime = averagedData[0]?.time || '';
        const endTime = averagedData[averagedData.length - 1]?.time || '';
        onUploadSuccess(averagedData, boxplotStats, selectedFile.name, startTime, endTime);
      } else {
        alert('Failed to upload file.');
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error uploading file:', error);
      alert('Error uploading file.');
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <button className={styles['UploadDataButton']} onClick={handleUpload} disabled={!isEnabled || isLoading}>
          그래프 생성
        </button>
      )}
    </>
  );
}

export default UploadDataButton;
