// src\pages\GraphDataPage.js

import React, { useState } from 'react';
import FileUploadButton from '../components/FileUploadButton';
import UploadDataButton from '../components/UploadDataButton';
import GenerateGraphButton from '../components/GenerateGraphButton';
import LineGraph from '../components/LineGraph';
import BoxGraph from '../components/BoxGraph';
import { uploadFile } from '../api';

function GraphDataPage() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [graphData, setGraphData] = useState([]);
  const [boxPlotData, setBoxPlotData] = useState(null);
  // const [uploadResult, setUploadResult] = useState(null); // 업로드 결과를 저장할 상태

  const handleFileSelect = (file) => {
    setUploadedFile(file);
    setIsUploaded(false); // 파일을 새로 선택하면 그래프 생성 버튼을 비활성화
    setGraphData([]); // 새 파일이 선택되면 이전 그래프 데이터를 초기화

    // setUploadResult(null); // 이전 업로드 결과 초기화
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
      // setUploadResult(result); // 업로드 결과 저장
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleGenerateGraph = async () => {
    try {
      const { averagedData, boxplotStats } = await uploadFile(uploadedFile)
      setGraphData(averagedData)
      setBoxPlotData(boxplotStats)
    } catch (error) {
      console.error('Error uploading file and generating graph:', error)
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
