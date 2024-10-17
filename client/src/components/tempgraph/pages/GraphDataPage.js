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

  const handleUploadSuccess = useCallback((
    averagedData, boxplotStats,
    plcData, uploadedFileName, startTime, endTime,
    uploadedStartTime, uploadedEndTime
  ) => {
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

  const processFile = useCallback((file) => {
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
        setIsGraphGenerated(true);
      };
    };
    reader.readAsText(file);
  }, []);

  const processPLCFile = useCallback((file) => {
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
        setIsGraphGenerated(true);
      };
    };
    reader.readAsText(file);
  }, []);

  const handleFileSelect = useCallback((file) => {
    setUploadedFile(file);
    setGraphData([]);
    setBoxPlotData(null);
    setUserInput('');
    setIsGraphGenerated(false);
    processFile(file);
  }, [processFile]);

  const handlePLCFileSelect = useCallback((file) => {
    setUploadedPLCFile(file);
    setPlcGraphData([]);
    setIsGraphGenerated(false);
    processPLCFile(file);
  }, [processPLCFile]);

  useEffect(() => {
    setStartTime(initialStartTime);
    setEndTime(initialEndTime);
  }, [initialStartTime, initialEndTime]);

  const handleSaveDataSuccess = useCallback(() => {
    // 데이터 저장 성공 처리 로직
  }, []);

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
                  onSaveSuccess={handleSaveDataSuccess}
                  selectedRange={selectedRange}
                  startTime={startTime}
                  endTime={endTime}
                />
                <LineGraph
                  averagedData={graphData}
                  plcData={plcGraphData}  // 여기서 PLC 데이터를 전달하고 있는지 확인
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