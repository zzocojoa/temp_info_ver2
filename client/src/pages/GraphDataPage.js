// src\pages\GraphDataPage.js

import React, { useState } from 'react';
import FileUploadButton from '../components/FileUploadButton';
import UploadDataButton from '../components/UploadDataButton';
import GenerateGraphButton from '../components/GenerateGraphButton';
import LineGraph from '../components/LineGraph';
// 다른 필요한 컴포넌트 import

function GraphDataPage() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);

  const handleFileSelect = (file) => {
    setUploadedFile(file);
    // 여기에서 파일을 처리하거나 서버로 전송하는 로직을 추가할 수 있습니다.
  };

  const handleUploadSuccess = (result) => {
    // 여기에서 업로드 성공 후 로직을 처리할 수 있습니다.
    console.log('GraphDataPage 파일 업로드 성공: ', result);
    setIsUploaded(true);
    setGraphData(result.data);
  };  

  const handleGenerateGraph = () => {
    // 여기에서 그래프 생성 로직을 처리할 수 있습니다.
    console.log('GraphDataPage 그래프 생성: ');
  };

  return (
    <div>
      <FileUploadButton onFileSelect={handleFileSelect} />
      <UploadDataButton selectedFile={uploadedFile} onUploadSuccess={handleUploadSuccess} />
      <GenerateGraphButton isEnabled={isUploaded} onGenerateGraph={handleGenerateGraph} />
      {graphData.length > 0 && <LineGraph data={graphData} />}
      {/* 다른 컴포넌트들을 여기에 배치 */}
    </div>
  );
}

export default GraphDataPage;
