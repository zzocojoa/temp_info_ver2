// src\pages\GraphDataPage.js

import React, { useState } from 'react';
import FileUploadButton from '../components/FileUploadButton';
import UploadDataButton from '../components/UploadDataButton';
import GenerateGraphButton from '../components/GenerateGraphButton';
import LineGraph from '../components/LineGraph';
import BoxGraph from '../components/BoxGraph';
import { uploadFile } from '../api'; // API 함수 임포트

function GraphDataPage() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [graphData, setGraphData] = useState([]); // 그래프 데이터 상태 추가
  const [uploadResult, setUploadResult] = useState(null); // 업로드 결과를 저장할 상태
  const [boxPlotData, setBoxPlotData] = useState(null);

  const handleFileSelect = (file) => {
    setUploadedFile(file);
    setIsUploaded(false); // 파일을 새로 선택하면 그래프 생성 버튼을 비활성화
    setGraphData([]); // 새 파일이 선택되면 이전 그래프 데이터를 초기화
    setUploadResult(null); // 이전 업로드 결과 초기화
  };

  const handleUploadSuccess = async () => {
    if (!uploadedFile) {
      console.error('No file selected for upload');
      return;
    }
    
    try {
      const result = await uploadFile(uploadedFile);
      // console.log('File uploaded successfully:', result);
      setIsUploaded(true);
      setUploadResult(result); // 업로드 결과 저장
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleGenerateGraph = async () => {
    // console.log('GraphDataPage 그래프 생성 시작');
    if (uploadResult && uploadResult.data) {
      setGraphData(uploadResult.data);
      setBoxPlotData(uploadResult.data)
    } else {
      console.error('No data available to generate graph');
    }
  };

  return (
    <div>
      <FileUploadButton onFileSelect={handleFileSelect} />
      <UploadDataButton selectedFile={uploadedFile} onUploadSuccess={handleUploadSuccess} />
      <GenerateGraphButton isEnabled={isUploaded} onGenerateGraph={handleGenerateGraph} />
      {graphData.length > 0 && <LineGraph data={graphData} />}
      {boxPlotData && <BoxGraph stats={boxPlotData} />}
    </div>
  );
}

export default GraphDataPage;
