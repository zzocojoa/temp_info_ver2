// src/components/DataUploadComponent.js

import React, { useState } from 'react';
import { uploadCsvFile } from '../../../api';
import styles from './DataUploadComponent.module.css';

function DataUploadComponent() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (event) => {
    setSuccessMessage('');
    setErrorMessage('');
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage('파일을 선택해주세요.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await uploadCsvFile(selectedFile);
      setIsLoading(false);
      setSuccessMessage('파일이 성공적으로 업로드되었습니다.');
      console.log('Upload response:', response);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage('파일 업로드 중 오류가 발생했습니다.');
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className={styles.container}>
      <input type="file" onChange={handleFileChange} accept=".csv" />
      <button onClick={handleUpload} disabled={isLoading}>
        {isLoading ? '업로드 중...' : '파일 업로드'}
      </button>
      {successMessage && <div className={styles.success}>{successMessage}</div>}
      {errorMessage && <div className={styles.error}>{errorMessage}</div>}
    </div>
  );
}

export default DataUploadComponent;