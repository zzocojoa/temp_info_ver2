// client/src/components/tempgraph/pages/GraphDataPage.js

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
import Papa from 'papaparse';

const GraphDataPage = React.memo(() => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedPLCFile, setUploadedPLCFile] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [plcGraphData, setPlcGraphData] = useState([]);
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

  const [isGraphGenerated, setIsGraphGenerated] = useState(false);

  // 업로드 성공 시 처리할 콜백 함수
  const handleUploadSuccess = useCallback((averagedData, boxplotStats, plcData, uploadedFileName, startTime, endTime, uploadedStartTime, uploadedEndTime) => {
    setGraphData(Array.isArray(averagedData) ? averagedData : []);
    setBoxPlotData(boxplotStats);
    setPlcGraphData(Array.isArray(plcData) ? plcData : []);
    setUploadedFileName(uploadedFileName);
    setIsGraphGenerated(true);
    setInitialStartTime(startTime);
    setInitialEndTime(endTime);
    setStartTime(uploadedStartTime);
    setEndTime(uploadedEndTime);
  }, []);

  // 파일 처리 로직
  const processFile = useCallback((file) => {
    if (!file) {
      console.error('No file provided');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvData = event.target.result;
      const parsedData = Papa.parse(csvData, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
      }).data;

      const worker = new Worker(new URL('../../../workers/averageDataWorker.js', import.meta.url));
      const chunkSize = 1000;
      worker.postMessage({ data: parsedData, chunkSize });

      worker.onmessage = (event) => {
        const averagedData = event.data;
        setGraphData(averagedData);
        setIsGraphGenerated(false);
      };
    };
    reader.readAsText(file);
  }, []);

  // PLC 파일 처리 로직
  const processPLCFile = useCallback((file) => {
    if (!file) {
      console.error('No PLC file provided');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvData = event.target.result;
      const parsedData = Papa.parse(csvData, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
      }).data;

      const worker = new Worker(new URL('../../../workers/averageDataWorker.js', import.meta.url));
      const chunkSize = 1000;
      worker.postMessage({ data: parsedData, chunkSize });

      worker.onmessage = (event) => {
        const averagedData = event.data;
        setPlcGraphData(averagedData);
        setIsGraphGenerated(false);
      };
    };
    reader.readAsText(file);
  }, []);

  // 파일 선택 시 상태 초기화 및 처리
  const handleFileSelect = useCallback((file) => {
    if (file) {
      setUploadedFile(file);
      setGraphData([]);  // 기존 그래프 데이터 초기화
      setBoxPlotData(null);
      setUserInput('');
      setIsGraphGenerated(false);  // 그래프 생성 상태를 false로 초기화
      processFile(file);
    } else {
      setUploadedFile(null);  // 파일이 없을 경우 상태 초기화
      setGraphData([]);
      setBoxPlotData(null);
      setIsGraphGenerated(false);
      console.log('파일 선택 취소됨');
    }
  }, [processFile]);

  // PLC 파일 선택 시 상태 초기화 및 처리
  const handlePLCFileSelect = useCallback((file) => {
    if (file) {
      setUploadedPLCFile(file);
      setPlcGraphData([]);
      setIsGraphGenerated(false);  // PLC 파일 선택 시 그래프 생성 상태 초기화
      processPLCFile(file);
    } else {
      setUploadedPLCFile(null);  // PLC 파일이 없을 경우 상태 초기화
      setPlcGraphData([]);
      setIsGraphGenerated(false);
      console.log('PLC 파일 선택 취소됨');
    }
  }, [processPLCFile]);

  // 파일 업로드 후 상태 초기화 함수
  const resetFileState = useCallback(() => {
    setUploadedFile(null);
    setUploadedPLCFile(null);
  }, []);

  // 타임 범위 설정 및 그래프 데이터 반영
  useEffect(() => {
    setStartTime(initialStartTime);
    setEndTime(initialEndTime);
  }, [initialStartTime, initialEndTime]);

  // 브러시로 선택된 구간에 따라 시간 범위 설정
  const handleBrushChange = useCallback((startIndex, endIndex) => {
    const newStartTime = graphData[startIndex]?.time || '';
    const newEndTime = graphData[endIndex]?.time || '';
    setStartTime(newStartTime);
    setEndTime(newEndTime);
    setSelectedRange({ start: startIndex, end: endIndex });
  }, [graphData]);

  return (
    <div className={styles['graphDataWrap']}>
      <div className={styles['graphDataContainer']}>
        <div className={styles['leftPanel']}>
          <h2 className={styles['headerTitle']}>Graph Data Visualization</h2>
          <FileUploadButton
            className={styles['fileUploadButton']}
            onFileSelect={handleFileSelect}
            onPLCFileSelect={handlePLCFileSelect}
          />
          <ThresholdOutlierEliminationLogic onResults={handleUploadSuccess} />
          <div className={styles['graphGenerated']}>
            <UploadDataButton
              className={styles['uploadDataButton']}
              selectedFile={uploadedFile}
              selectedPLCFile={uploadedPLCFile}
              onUploadSuccess={handleUploadSuccess}
              isEnabled={!!uploadedFile || !!uploadedPLCFile}
              resetFileState={resetFileState}
            />
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
                  onSaveSuccess={() => { /* 저장 성공 시 처리 로직 */ }}
                  selectedRange={selectedRange}
                  startTime={startTime}
                  endTime={endTime}
                />
                <LineGraph
                  averagedData={graphData}
                  plcData={plcGraphData}
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

