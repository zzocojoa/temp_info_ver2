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
      const { averagedData, boxplotStats } = await uploadFile(selectedFile);
      onUploadSuccess(averagedData, boxplotStats);
      alert('File uploaded successfully!');
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
