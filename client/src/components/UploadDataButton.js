// src\components\UploadDataButton.js

import React from 'react';
import { uploadFile } from '../api';

function UploadDataButton({ selectedFile, onUploadSuccess, isEnabled }) {
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }

    try {
      // API를 호출하여 파일 업로드
      const response = await uploadFile(selectedFile);
      if (response) {
        const { averagedData, boxplotStats } = response;
        // 파일 업로드 성공 시, handleUploadSuccess 콜백을 호출하고,
        // 업로드된 파일의 데이터와 파일 이름을 인자로 전달
        onUploadSuccess(averagedData, boxplotStats, selectedFile.name);
        // alert('File uploaded successfully!');
      } else {
        // 서버 응답이 없거나 업로드 실패 시
        alert('Failed to upload file.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file.');
    }
  };

  return (
    <button onClick={handleUpload} disabled={!isEnabled}>
      Upload Data
    </button>
  );
}

export default UploadDataButton;
