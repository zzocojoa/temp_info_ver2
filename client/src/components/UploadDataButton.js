// src\components\UploadDataButton.js

import React from 'react';
import { uploadFile } from '../api'; // api.js에서 uploadFile 함수를 임포트

function UploadDataButton({ selectedFile, onUploadSuccess }) {
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }

    try {
      const result = await uploadFile(selectedFile); // api.js의 uploadFile 함수 사용
      onUploadSuccess(result); // 업로드 성공 시 부모 컴포넌트에 알림
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file.');
    }
  };

  return (
    <button onClick={handleUpload} disabled={!selectedFile}>
      Upload Data
    </button>
  );
}

export default UploadDataButton;
