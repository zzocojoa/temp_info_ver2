// client/src/components/tempgraph/tempgraphmodule/UploadDataButton.js

import React, { useState } from 'react';
import styles from './UploadDataButton.module.css'
import { uploadFile, uploadPLCFile } from '../../../api';
import Loader from './Loader';

function UploadDataButton({ selectedFile, selectedPLCFile, onUploadSuccess, isEnabled }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async () => {
    if (!selectedFile && !selectedPLCFile) {
      alert('Please select a file first.');
      return;
    }

    setIsLoading(true);

    try {
      let response = {};
      if (selectedFile) {
        const fileResponse = await uploadFile(selectedFile);
        response.averagedData = fileResponse.averagedData;
        response.boxplotStats = fileResponse.boxplotStats;
      }
      if (selectedPLCFile) {
        const plcResponse = await uploadPLCFile(selectedPLCFile);
        response.plcData = plcResponse.averagedData;
      }

      setIsLoading(false);
      if (Object.keys(response).length > 0) {
        const startTime = response.averagedData?.[0]?.time || response.plcData?.[0]?.time || '';
        const endTime = response.averagedData?.[response.averagedData?.length - 1]?.time ||
          response.plcData?.[response.plcData?.length - 1]?.time || '';
        onUploadSuccess(
          response.averagedData || [],
          response.boxplotStats,
          response.plcData || [],
          selectedFile?.name || selectedPLCFile?.name,
          startTime,
          endTime
        );
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
