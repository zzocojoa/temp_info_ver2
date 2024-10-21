// client/src/components/tempgraph/tempgraphmodule/UploadDataButton.js

import React, { useState } from 'react';
import styles from './UploadDataButton.module.css';
import { uploadFile, uploadPLCFile } from '../../../api';
import Loader from './Loader';

function UploadDataButton({ selectedFile, selectedPLCFile, onUploadSuccess, isEnabled, resetFileState }) {
  const [isLoading, setIsLoading] = useState(false);

  // 그래프 생성 및 파일 업로드 처리 함수
  const handleUpload = async () => {
    // 선택된 파일이 없을 경우 경고 및 업로드 중단
    if (!selectedFile && !selectedPLCFile) {
      alert('Please select a file first.');
      return;
    }

    // 로딩 상태 표시
    setIsLoading(true);

    try {
      let response = {};
      
      // 일반 파일 업로드 처리
      if (selectedFile) {
        const fileResponse = await uploadFile(selectedFile);
        response.averagedData = fileResponse.averagedData;
        response.boxplotStats = fileResponse.boxplotStats;
      }

      // PLC 파일 업로드 처리
      if (selectedPLCFile) {
        const plcResponse = await uploadPLCFile(selectedPLCFile);
        response.plcData = plcResponse.averagedData;
      }

      setIsLoading(false);  // 로딩 상태 종료

      // 업로드가 성공적으로 완료된 경우
      if (Object.keys(response).length > 0) {
        const startTime = response.averagedData?.[0]?.time || response.plcData?.[0]?.time || '';
        const endTime = response.averagedData?.[response.averagedData?.length - 1]?.time ||
          response.plcData?.[response.plcData?.length - 1]?.time || '';
        
        // 업로드 성공 콜백 호출 및 파일 상태 초기화
        onUploadSuccess(
          response.averagedData || [],
          response.boxplotStats,
          response.plcData || [],
          selectedFile?.name || selectedPLCFile?.name,
          startTime,
          endTime
        );

        // 업로드 후 파일 상태를 초기화
        resetFileState();
      } else {
        alert('Failed to upload file.');
      }
    } catch (error) {
      // 에러 발생 시 처리
      setIsLoading(false);
      console.error('Error uploading file:', error);
      alert('Error uploading file.');
    }
  };

  return (
    <>
      {/* 로딩 상태에 따라 로더 표시 또는 버튼 표시 */}
      {isLoading ? (
        <Loader />
      ) : (
        <button 
          className={styles['UploadDataButton']} 
          onClick={handleUpload} 
          disabled={!isEnabled || isLoading || (!selectedFile && !selectedPLCFile)} // 파일이 없거나 로딩 중일 때 비활성화
        >
          그래프 생성
        </button>
      )}
    </>
  );
}

export default UploadDataButton;
