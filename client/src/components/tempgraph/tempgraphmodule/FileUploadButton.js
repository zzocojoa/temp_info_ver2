// client/src/components/tempgraph/tempgraphmodule/FileUploadButton.js

import React, { useState } from 'react';
import styles from './FileUploadButton.module.css';

function FileUploadButton({ onFileSelect, onPLCFileSelect }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPLCFile, setSelectedPLCFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    console.log('Selected file:', file); // 디버깅 로그 추가
    setSelectedFile(file);
    onFileSelect(file);
  };

  const handlePLCFileChange = (event) => {
    const file = event.target.files[0];
    console.log('Selected PLC file:', file); // 디버깅 로그 추가
    setSelectedPLCFile(file);
    onPLCFileSelect(file);
  };

  return (
    <div className={styles["fileUploadWrap"]}>
      <div className={styles["fileUploadContainer"]}>
        <div className={styles["fileUploadButton"]}>
          <label htmlFor="file">
            <div className={styles["fileUpload"]}>파일 업로드하기</div>
          </label>
          <input className={styles['fileUpload-btn']} type="file" id='file' onChange={handleFileChange} accept=".csv" />
        </div>
        <div className={styles["fileUploadName"]}>
          {selectedFile && <p className={styles['fileName']}>File name: {selectedFile.name}</p>}
        </div>
        <div className={styles["fileUploadButton"]}>
          <label htmlFor="plcFile">
            <div className={styles["fileUpload"]}>PLC 파일 업로드하기</div>
          </label>
          <input className={styles['fileUpload-btn']} type="file" id='plcFile' onChange={handlePLCFileChange} accept=".csv" />
        </div>
        <div className={styles["fileUploadName"]}>
          {selectedPLCFile && <p className={styles['fileName']}>PLC File name: {selectedPLCFile.name}</p>}
        </div>
      </div>
    </div>
  );
}

export default FileUploadButton;