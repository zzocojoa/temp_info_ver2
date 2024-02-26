// src/pages/GraphDataPage.js

import React, { useState } from 'react';
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
  const [boxPlotData, setBoxPlotData] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [userInput, setUserInput] = useState('');
  const [details, setDetails] = useState({
    wNumber: '',
    dwNumber: '',
    dieNumber: '',
  });

  // 그래프 생성 여부를 추적하는 상태 추가
  const [isGraphGenerated, setIsGraphGenerated] = useState(false);

  // const [isDataSaved, setIsDataSaved] = useState(false);
  // details 상태가 업데이트될 때마다 실행될 useEffect 훅
  // useEffect(() => {
  //   console.log("Current details state:", details);
  // }, [details]);

  const handleFileSelect = (file) => {
    setUploadedFile(file);
    setGraphData([]);
    setBoxPlotData(null);
    setUserInput('');
    // setIsDataSaved(false);
  };
  const handleUploadSuccess = async (averagedData, boxplotStats, uploadedFileName) => {
    setGraphData(averagedData);
    setBoxPlotData(boxplotStats);
    setUploadedFileName(uploadedFileName);
    setIsGraphGenerated(true);
    // setIsDataSaved(false);
    console.log("uploadedFileName: ", uploadedFileName)
  };
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
                  wNumber={details.wNumber}
                  dwNumber={details.dwNumber}
                  dieNumber={details.dieNumber}
                  onDetailsChange={(key, value) => setDetails({ ...details, [key]: value })}
                  onBrushChange={handleBrushChange}
                />
                <BoxGraph boxplotStats={boxPlotData} />
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
