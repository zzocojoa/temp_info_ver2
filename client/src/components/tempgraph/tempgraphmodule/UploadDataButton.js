// client/src/components/tempgraph/tempgraphmodule/UploadDataButton.js

import React, { useState } from 'react';
import styles from './UploadDataButton.module.css';
import { uploadFile, uploadPLCFile, uploadCombinedFiles } from '../../../api';  // API 함수 임포트
import ProgressBar from './ProgressBar';  // ProgressBar 컴포넌트 추가

function UploadDataButton({ selectedFile, selectedPLCFile, onUploadSuccess, isEnabled, resetFileState }) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0); // 진행률 상태 추가

  const handleProgress = (event) => {
    if (event.lengthComputable) {
      const percentComplete = Math.round((event.loaded / event.total) * 100);
      setProgress(percentComplete); // 진행률 업데이트
    }
  };

  const handleUpload = async () => {
    if (!selectedFile && !selectedPLCFile) {
      alert('Please select a file first.');
      return;
    }

    setIsLoading(true);
    setProgress(0);

    try {
      let response = {};

      // 두 파일이 모두 선택된 경우 통합 업로드 처리
      if (selectedFile && selectedPLCFile) {
        const combinedResponse = await uploadCombinedFiles(selectedFile, selectedPLCFile, handleProgress);
        response.mergedData = combinedResponse.data;
      } 
      // 일반 파일 단독 업로드 처리
      else if (selectedFile) {
        const fileResponse = await uploadFile(selectedFile, handleProgress);
        response.averagedData = fileResponse.data;
        response.boxplotStats = fileResponse.boxplotStats;
      } 
      // PLC 파일 단독 업로드 처리
      else if (selectedPLCFile) {
        const plcResponse = await uploadPLCFile(selectedPLCFile, handleProgress);
        response.plcData = plcResponse.data;
      }

      setIsLoading(false);  // 로딩 상태 종료
      setProgress(100);     // 업로드 완료 시 진행률 100%

      if (Object.keys(response).length > 0) {
        const startTime = response.mergedData?.[0]?.time || response.averagedData?.[0]?.time || response.plcData?.[0]?.time || '';
        const endTime = response.mergedData?.[response.mergedData?.length - 1]?.time ||
          response.averagedData?.[response.averagedData?.length - 1]?.time ||
          response.plcData?.[response.plcData?.length - 1]?.time || '';

        // 업로드 성공 콜백 호출
        onUploadSuccess(
          response.mergedData || response.averagedData || [],
          response.boxplotStats,
          response.plcData || [],
          selectedFile?.name || selectedPLCFile?.name,
          startTime,
          endTime
        );

        resetFileState();  // 업로드 후 파일 상태 초기화
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
        <ProgressBar percentage={progress} />  // 진행률 표시
      ) : (
        <button 
          className={styles['UploadDataButton']} 
          onClick={handleUpload} 
          disabled={!isEnabled || isLoading || (!selectedFile && !selectedPLCFile)}  // 파일이 없거나 로딩 중일 때 비활성화
        >
          그래프 생성
        </button>
      )}
    </>
  );
}

export default UploadDataButton;
