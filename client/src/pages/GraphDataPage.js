// src\pages\GraphDataPage.js

import React, { useState } from 'react';
import FileUploadButton from '../components/FileUploadButton';
import UploadDataButton from '../components/UploadDataButton';
import GenerateGraphButton from '../components/GenerateGraphButton';
import LineGraph from '../components/LineGraph';
<<<<<<< HEAD
import BoxGraph from '../components/BoxGraph';
import { uploadFile } from '../api';
=======
// 다른 필요한 컴포넌트 import
>>>>>>> parent of 175ce43 (add commit)

function GraphDataPage() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
<<<<<<< HEAD
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
=======

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
>>>>>>> parent of 175ce43 (add commit)
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
