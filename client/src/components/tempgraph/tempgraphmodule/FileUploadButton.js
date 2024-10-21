import React, { useState, useRef } from 'react';
import styles from './FileUploadButton.module.css';

function FileUploadButton({ onFileSelect, onPLCFileSelect }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedPLCFile, setSelectedPLCFile] = useState(null);
  const fileInputRef = useRef(null);
  const plcFileInputRef = useRef(null);

  // 파일 선택 시 처리
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('파일 선택됨:', file.name);
      setSelectedFile(file);
      onFileSelect(file); // 선택된 파일을 상위 컴포넌트로 전달
    }
  };

  // PLC 파일 선택 시 처리
  const handlePLCFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('PLC 파일 선택됨:', file.name);
      setSelectedPLCFile(file);
      onPLCFileSelect(file); // 선택된 PLC 파일을 상위 컴포넌트로 전달
    }
  };

  // 파일 업로드 버튼 클릭 시 상태 초기화
  const handleFileUploadClick = () => {
    if (selectedFile) {
      console.log('파일 선택 취소됨');
      setSelectedFile(null); // 파일 상태 초기화
      onFileSelect(null); // 상위 컴포넌트에 파일 취소 상태 전달
    }
    fileInputRef.current.value = null; // input 엘리먼트 초기화
  };

  // PLC 파일 업로드 버튼 클릭 시 상태 초기화
  const handlePLCFileUploadClick = () => {
    if (selectedPLCFile) {
      console.log('PLC 파일 선택 취소됨');
      setSelectedPLCFile(null); // PLC 파일 상태 초기화
      onPLCFileSelect(null); // 상위 컴포넌트에 PLC 파일 취소 상태 전달
    }
    plcFileInputRef.current.value = null; // input 엘리먼트 초기화
  };

  return (
    <div className={styles["fileUploadWrap"]}>
      <div className={styles["fileUploadContainer"]}>
        {/* 일반 파일 업로드 */}
        <div className={styles["fileUploadButton"]}>
          <label htmlFor="file">
            <div className={styles["fileUpload"]}>파일 업로드하기</div>
          </label>
          <input
            ref={fileInputRef}
            className={styles['fileUpload-btn']}
            type="file"
            id="file"
            onChange={handleFileChange} // 파일 변경 시 상태 업데이트
            onClick={handleFileUploadClick} // 파일 선택 창 열 때 상태 초기화
            accept=".csv"
          />
        </div>
        <div className={styles["fileUploadName"]}>
          {selectedFile && <p className={styles['fileName']}>{selectedFile.name}</p>}
        </div>

        {/* PLC 파일 업로드 */}
        <div className={styles["fileUploadButton"]}>
          <label htmlFor="plcFile">
            <div className={styles["fileUpload"]}>PLC 파일 업로드하기</div>
          </label>
          <input
            ref={plcFileInputRef}
            className={styles['fileUpload-btn']}
            type="file"
            id="plcFile"
            onChange={handlePLCFileChange} // PLC 파일 변경 시 상태 업데이트
            onClick={handlePLCFileUploadClick} // PLC 파일 선택 창 열 때 상태 초기화
            accept=".csv"
          />
        </div>
        <div className={styles["fileUploadName"]}>
          {selectedPLCFile && <p className={styles['fileName']}>{selectedPLCFile.name}</p>}
        </div>
      </div>
    </div>
  );
}

export default FileUploadButton;
