// src\components\FileUploadButton.js

import React, { useState } from 'react';
import styles from './FileUploadButton.module.css'

function FileUploadButton({ onFileSelect }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    onFileSelect(file); // 부모 컴포넌트로 파일 데이터 전달
  };

  return (
    <div className={styles["fileUploadWrap"]}>
      <label htmlFor="file">
        <div className={styles["fileUpload"]}>파일 업로드하기</div>
      </label>
      <input className={styles['fileUpload-btn']} type="file" id='file' onChange={handleFileChange} accept=".csv" />
      {selectedFile && <p className={styles['fileName']}>File name: {selectedFile.name}</p>}
    </div>
  );
}

export default FileUploadButton;
