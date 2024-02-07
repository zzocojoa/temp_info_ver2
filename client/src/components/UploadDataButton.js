// src\components\UploadDataButton.js

import React from 'react';

function UploadDataButton({ selectedFile, onUploadSuccess }) {
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    // 예제로 서버 업로드 로직을 추가합니다. 실제 URL은 서버 설정에 따라 달라집니다.
    try {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        onUploadSuccess(result); // 업로드 성공 시 부모 컴포넌트에 알림
        alert('File uploaded successfully!');
      } else {
        alert('Failed to upload file.');
      }
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
