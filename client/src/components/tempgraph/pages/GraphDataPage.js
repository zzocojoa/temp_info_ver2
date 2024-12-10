// client/src/components/tempgraph/pages/GraphDataPage.js

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import FileUploadButton from '../tempgraphmodule/FileUploadButton';
import UploadDataButton from '../tempgraphmodule/UploadDataButton';
import SaveCsvDataButton from '../tempgraphmodule/SaveCsvDataButton';
import LineGraph from '../tempgraphmodule/LineGraph';
import BoxGraph from '../tempgraphmodule/BoxGraph';
import DataListUI from '../tempgraphmodule/DataListUI';
import TextInputBox from '../tempgraphmodule/TextInputBox';
import ThresholdOutlierEliminationLogic from '../tempgraphmodule/ThresholdOutlierEliminationlogic';
import { fetchDataList } from '../../../api'; // 수정됨: API 호출 추가
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
  const [isBoxPlotUsed, setIsBoxPlotUsed] = useState(false);

  // 수정됨: API 데이터 상태 추가
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 수정됨: useEffect to load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await fetchDataList();
        setData(fetchedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  // 업로드 성공 시 처리할 콜백 함수
  const handleUploadSuccess = useCallback((averagedData, boxplotStats, plcData, uploadedFileName, startTime, endTime, uploadedStartTime, uploadedEndTime, isBoxPlot) => {
    setGraphData(Array.isArray(averagedData) ? averagedData : []);
    setBoxPlotData(isBoxPlot ? boxplotStats : null);
    setPlcGraphData(Array.isArray(plcData) ? plcData : []);
    setUploadedFileName(uploadedFileName);
    setIsGraphGenerated(true);
    setInitialStartTime(startTime);
    setInitialEndTime(endTime);
    setStartTime(uploadedStartTime);
    setEndTime(uploadedEndTime);
    setIsBoxPlotUsed(isBoxPlot);
  }, []);

  // 파일 처리 로직
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
        setIsGraphGenerated(false);
      };
    };
    reader.readAsText(file);
  }, []);

  // PLC 파일 처리 로직
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
        setIsGraphGenerated(false);
      };
    };
    reader.readAsText(file);
  }, []);

  // 파일 선택 시 상태 초기화 및 처리
  const handleFileSelect = useCallback((file) => {
    if (file) {
      const isBoxPlot = file.name.includes('LandData');
      setUploadedFile(file);
      setGraphData([]);
      setBoxPlotData(null);
      setUserInput('');
      setIsGraphGenerated(false);
      processFile(file);
      setIsBoxPlotUsed(isBoxPlot);
    } else {
      setUploadedFile(null);
      setGraphData([]);
      setBoxPlotData(null);
      setIsGraphGenerated(false);
      setIsBoxPlotUsed(false);
    }
  }, [processFile]);

  // PLC 파일 선택 시 상태 초기화 및 처리
  const handlePLCFileSelect = useCallback((file) => {
    if (file) {
      setUploadedPLCFile(file);
      setPlcGraphData([]);
      setIsGraphGenerated(false);
      processPLCFile(file);
      setIsBoxPlotUsed(false);
    } else {
      setUploadedPLCFile(null);
      setPlcGraphData([]);
      setIsGraphGenerated(false);
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

  const handleBrushChange = useCallback((startIndex, endIndex) => {
    // 데이터 유효성 검사
    if ((graphData && graphData.length > 0) || (plcGraphData && plcGraphData.length > 0)) {
        const newStartTime = graphData?.[startIndex]?.time || plcGraphData?.[startIndex]?.time || '';
        const newEndTime = graphData?.[endIndex]?.time || plcGraphData?.[endIndex]?.time || '';
        console.log("GraphDataPage newStartTime: ", newStartTime);
        console.log("GraphDataPage newEndTime: ", newEndTime);

        // setTimeout을 사용해 렌더링이 완료된 후 상태 업데이트
        setTimeout(() => {
            setStartTime(newStartTime);
            setEndTime(newEndTime);
            setSelectedRange({ start: startIndex, end: endIndex });
        }, 0);
    } else {
        // 데이터가 없을 경우 초기 상태로 설정
        setTimeout(() => {
            setStartTime('');
            setEndTime('');
            setSelectedRange({ start: 0, end: 0 });
        }, 0);
    }
}, [graphData, plcGraphData]);


  useEffect(() => {
    if (startTime && endTime) {
      console.log("GraphDataPage Updated startTime:", startTime);
      console.log("GraphDataPage Updated endTime:", endTime);
    }
  }, [startTime, endTime]);



  if (isLoading) return <div>Loading...</div>; // 수정됨: 로딩 상태 처리
  if (error) return <div>Error: {error}</div>;  // 수정됨: 오류 상태 처리

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
              onUploadSuccess={(
                averagedData,
                boxplotStats,
                plcData,
                uploadedFileName,
                startTime,
                endTime,
                uploadedStartTime,
                uploadedEndTime) => {
                handleUploadSuccess(
                  averagedData,
                  boxplotStats,
                  plcData,
                  uploadedFileName,
                  startTime,
                  endTime,
                  uploadedStartTime,
                  uploadedEndTime,
                  isBoxPlotUsed);
              }}
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
                {isBoxPlotUsed && boxPlotData && (
                  <BoxGraph
                    initialStartTime={initialStartTime}
                    initialEndTime={initialEndTime}
                    averagedData={graphData}
                    boxplotStats={boxPlotData}
                    selectedRange={selectedRange}
                    onBrushChange={handleBrushChange}
                  />
                )}
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
