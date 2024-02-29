// src/pages/GraphDataPage.js

import React, { useState, useEffect } from 'react';
import FileUploadButton from '../components/FileUploadButton';
import UploadDataButton from '../components/UploadDataButton';
import SaveCsvDataButton from '../components/SaveCsvDataButton';
import LineGraph from '../components/LineGraph';
import BoxGraph from '../components/BoxGraph';
import DataListUI from '../components/DataListUI';
import TextInputBox from '../components/TextInputBox';
import styles from './GraphData.module.css';

function GraphDataPage() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [selectedRange, setSelectedRange] = useState({ start: 0, end: 0 });
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [initialStartTime, setInitialStartTime] = useState('');
  const [initialEndTime, setInitialEndTime] = useState('');
  const [boxPlotData, setBoxPlotData] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [userInput, setUserInput] = useState('');
  const [details, setDetails] = useState({
    countNumber: '',
    wNumber: '',
    dwNumber: '',
    dieNumber: '',
  });

  // 그래프 생성 여부를 추적하는 상태 추가
  const [isGraphGenerated, setIsGraphGenerated] = useState(false);

  const handleFileSelect = (file) => {
    setUploadedFile(file);
    setGraphData([]);
    setBoxPlotData(null);
    setUserInput('');
    setIsGraphGenerated(false);
  };
  const handleUploadSuccess = async (
    averagedData, boxplotStats,
    uploadedFileName, startTime, endTime,
    uploadedStartTime, uploadedEndTime
  ) => {
    setGraphData(averagedData);
    setBoxPlotData(boxplotStats);
    setUploadedFileName(uploadedFileName);
    setIsGraphGenerated(true);
    setInitialStartTime(startTime);
    setInitialEndTime(endTime);
    setStartTime(uploadedStartTime);
    setEndTime(uploadedEndTime);
    console.log("uploadedFileName: ", uploadedFileName)
  };

  useEffect(() => {
    // props로 받은 initialStartTime과 initialEndTime을 사용하여 초기 시간 설정
    setStartTime(initialStartTime);
    setEndTime(initialEndTime);
    // console.log(`Initial start time: ${initialStartTime}, Initial end time: ${initialEndTime}`);
  }, [initialStartTime, initialEndTime]);

  const handleSaveDataSuccess = () => {
    // alert('Data saved successfully!');
    // setIsDataSaved(true);
  };

  const handleBrushChange = (startIndex, endIndex) => {
    // 시간 UI 상태로 저장
    const newStartTime = graphData[startIndex]?.Time || '';
    const newEndTime = graphData[endIndex]?.Time || '';
    setStartTime(newStartTime);
    setEndTime(newEndTime);
    // 선택된 데이터 범위를 상태로 저장
    setSelectedRange({ start: startIndex, end: endIndex });
  };

  return (
    <div className={styles['graphDataWrap']}>
      <div className={styles['graphDataContainer']}>
        <div className={styles['leftPanel']}>
          <h2 className={styles['headerTitle']}>Graph Data Visualization</h2>
          <FileUploadButton className={styles['fileUploadButton']} onFileSelect={handleFileSelect} />
          <div className={styles['graphGenerated']}>
            <UploadDataButton className={styles['uploadDataButton']} selectedFile={uploadedFile} onUploadSuccess={handleUploadSuccess} isEnabled={!!uploadedFile} />
            {isGraphGenerated && (
              <>
                <SaveCsvDataButton
                  data={{
                    graphData: selectedRange.start !== 0 || selectedRange.end !== 0 ?
                      graphData.slice(selectedRange.start, selectedRange.end + 1) :
                      graphData,
                    boxPlotData,
                    numbering: details,
                    userInput
                  }}
                  fileName={uploadedFileName}
                  onSaveSuccess={handleSaveDataSuccess}
                  selectedRange={selectedRange}
                  startTime={startTime}
                  endTime={endTime}
                />
                <LineGraph
                  averagedData={graphData}
                  countNumber={details.countNumber}
                  wNumber={details.wNumber}
                  dwNumber={details.dwNumber}
                  dieNumber={details.dieNumber}
                  onDetailsChange={(key, value) => setDetails({ ...details, [key]: value })}
                  onBrushChange={handleBrushChange}
                  initialStartTime={initialStartTime}
                  initialEndTime={initialEndTime}
                />
                <BoxGraph
                  initialStartTime={initialStartTime}
                  initialEndTime={initialEndTime}
                  averagedData={graphData}
                  boxplotStats={boxPlotData}
                  selectedRange={selectedRange}
                  onBrushChange={handleBrushChange}
                  />
              </>
            )}
          </div>
        </div>
        <div className={styles['rightPanel']}>
          <DataListUI />
          {isGraphGenerated && (
            <TextInputBox
              value={userInput}
              onTextChange={setUserInput}
              showSaveButton={false}
            />
          )}
        </div>
      </div>
    </div>
  );
}
export default GraphDataPage;

