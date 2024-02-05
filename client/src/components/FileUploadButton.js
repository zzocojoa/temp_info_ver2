// src\components\FileUploadButton.js

import React, { useState } from 'react';
import './FileUploadButton.module.css'

function FileUploadButton({ onFileSelect }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    onFileSelect(file); // 부모 컴포넌트로 파일 데이터 전달
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} accept=".csv" />
      {selectedFile && <p>File name: {selectedFile.name}</p>}
    </div>
  );
}

export default FileUploadButton;
