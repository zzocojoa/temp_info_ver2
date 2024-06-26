// client\src\components\tempgraph\pages\GraphDataPage.js

import React, { useState, useEffect, useCallback } from 'react';
import FileUploadButton from '../tempgraphmodule/FileUploadButton';
import UploadDataButton from '../tempgraphmodule/UploadDataButton';
import SaveCsvDataButton from '../tempgraphmodule/SaveCsvDataButton';
import LineGraph from '../tempgraphmodule/LineGraph';
import BoxGraph from '../tempgraphmodule/BoxGraph';
import DataListUI from '../tempgraphmodule/DataListUI';
import TextInputBox from '../tempgraphmodule/TextInputBox';
import ThresholdOutlierEliminationLogic from '../tempgraphmodule/ThresholdOutlierEliminationlogic';
import styles from './GraphData.module.css';
import Papa from 'papaparse'; // Import PapaParse

const GraphDataPage = React.memo(() => {
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

  const handleFileSelect = useCallback((file) => {
    setUploadedFile(file);
    setGraphData([]);
    setBoxPlotData(null);
    setUserInput('');
    setIsGraphGenerated(false);
  }, []);

  const handleUploadSuccess = useCallback((
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
  }, []);

  useEffect(() => {
    // props로 받은 initialStartTime과 initialEndTime을 사용하여 초기 시간 설정
    setStartTime(initialStartTime);
    setEndTime(initialEndTime);
  }, [initialStartTime, initialEndTime]);

  const handleSaveDataSuccess = useCallback(() => {
    // 데이터 저장 성공 처리 로직
  }, []);

  const handleBrushChange = useCallback((startIndex, endIndex) => {
    // 시간 UI 상태로 저장
    const newStartTime = graphData[startIndex]?.time || '';
    const newEndTime = graphData[endIndex]?.time || '';
    setStartTime(newStartTime);
    setEndTime(newEndTime);
    // 선택된 데이터 범위를 상태로 저장
    setSelectedRange({ start: startIndex, end: endIndex });
  }, [graphData]);

  const processFile = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const csvData = event.target.result;
      // CSV 데이터를 JSON으로 파싱하는 로직 추가
      const parsedData = Papa.parse(csvData, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
      }).data;

      const worker = new Worker(new URL('../../../workers/averageDataWorker.js', import.meta.url));
      const chunkSize = 1000; // 청크 크기 설정
      worker.postMessage({ data: parsedData, chunkSize });

      worker.onmessage = (event) => {
        const averagedData = event.data;
        setGraphData(averagedData);
        setIsGraphGenerated(true);
        // 필요한 추가 처리 로직 추가
      };
    };
    reader.readAsText(file);
  };

  return (
    <div className={styles['graphDataWrap']}>
      <div className={styles['graphDataContainer']}>
        <div className={styles['leftPanel']}>
          <h2 className={styles['headerTitle']}>Graph Data Visualization</h2>
          <FileUploadButton className={styles['fileUploadButton']} onFileSelect={(file) => {handleFileSelect(file); processFile(file);}} />
          <ThresholdOutlierEliminationLogic onResults={handleUploadSuccess} />
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
                  setBoxplotStats={setBoxPlotData}
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
});

export default GraphDataPage;
