// client/src/components/tempgraph/tempgraphmodule/FileUploadButton.js

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
      </div>
    </div>
  );
}

export default FileUploadButton;
