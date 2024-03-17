// client/src/components/tempgraph/tempgraphmodule/DataUploadComponent.js

import React, { useState } from 'react';
import { uploadCsvFile } from '../../../api';
import styles from './DataUploadComponent.module.css';

function DataUploadComponent() {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (event) => {
    setSuccessMessage([]);
    setErrorMessage('');
    setSelectedFiles(event.target.files);
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setErrorMessage('선택X');
      return;
    }
    setIsLoading(true);
    try {
      const response = await uploadCsvFile(Array.from(selectedFiles));
      setIsLoading(false);
      setSuccessMessage(response.map((result, index) => ({
        fileName: selectedFiles[index].name,
        status: result.success ? '실패' : '성공',
      })));
    } catch (error) {
      setIsLoading(false);
      setErrorMessage('실패');
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className={styles['DataUploadWrap']}>
      <div className={styles['DataUploadContainer']}>
        <div className={styles['DataUpload-wrap']}>
          <label htmlFor="files">
            <div className={styles["DataUploadSelect"]}>파일 업로드하기</div>
          </label>
          <input className={styles['DataUpload-sct']} type="file" id='files' multiple onChange={handleFileChange} accept=".csv" />
        </div>
        <button className={styles['DataUploadbutton']} onClick={handleUpload} disabled={isLoading}>
          {isLoading ? '업로드 중...' : '업로드'}
        </button>
      </div>
      <div className={styles['DataUploadResultWrap']}>
        <div className={styles['DataUploadResultContainer']}>
          <div className={styles['DataUploadResult-set']}>
            {selectedFiles && (
              <ul className={styles['fileNameList']}>
                {Array.from(selectedFiles).map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            )}
            <div className={styles['DataUploadResult']}>
              {successMessage.map((result, index) => (
                <div key={index} className={result.status === '성공' ? styles['DataUploadSuccess'] : styles['DataUploadError']}>
                  {`${result.status}`}
                </div>
              ))}
            </div>
            {errorMessage && <div className={styles['DataUploadError']}>{errorMessage}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataUploadComponent;