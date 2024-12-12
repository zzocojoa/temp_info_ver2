import React, { useState } from 'react';
import styles from './UploadDataButton.module.css'
import { uploadFile } from '../../../api';
import ProgressBar from './ProgressBar';

function UploadDataButton({ selectedFile, onUploadSuccess, isEnabled }) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleProgress = (event) => {
    if (event.lengthComputable) {
      const percentComplete = Math.round((event.loaded / event.total) * 100);
      setProgress(percentComplete);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }

    setIsLoading(true);
    setProgress(0);

    try {
      // API를 호출하여 파일 업로드
      const response = await uploadFile(selectedFile, handleProgress);
      
      setIsLoading(false);
      setProgress(100);

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
      setProgress(0);
      console.error('Error uploading file:', error);
      alert('Error uploading file.');
    }
  };

  return (
    <>
      {isLoading ? (
        <ProgressBar percentage={progress} />
      ) : (
        <button 
          className={styles['UploadDataButton']} 
          onClick={handleUpload} 
          disabled={!isEnabled || isLoading}
        >
          그래프 생성
        </button>
      )}
    </>
  );
}

export default UploadDataButton;