// src/pages/GraphDataPage.js

import React, { useState } from 'react';
import FileUploadButton from '../components/FileUploadButton';
import UploadDataButton from '../components/UploadDataButton';
import SaveCsvDataButton from '../components/SaveCsvDataButton';
import LineGraph from '../components/LineGraph';
import BoxGraph from '../components/BoxGraph';
import DataListUI from '../components/DataListUI';
import styles from './GraphDataPage.module.css';

function GraphDataPage() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [boxPlotData, setBoxPlotData] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [details, setDetails] = useState({
    wNumber: '',
    dwNumber: '',
    dieNumber: '',
  });
  // const [isDataSaved, setIsDataSaved] = useState(false);

  // details 상태가 업데이트될 때마다 실행될 useEffect 훅
  // useEffect(() => {
  //   console.log("Current details state:", details);
  // }, [details]);

  const handleFileSelect = (file) => {
    setUploadedFile(file);
    setGraphData([]);
    setBoxPlotData(null);
    // setIsDataSaved(false);
  };

  const handleUploadSuccess = async (averagedData, boxplotStats, uploadedFileName) => {
    setGraphData(averagedData);
    setBoxPlotData(boxplotStats);
    // setIsDataSaved(false);
    setUploadedFileName(uploadedFileName);
    console.log("uploadedFileName: ", uploadedFileName)
  };

  const handleSaveDataSuccess = () => {
    // alert('Data saved successfully!');
    // setIsDataSaved(true);
  };

  return (
    <div className={styles.graphDataWrap}>
      <div className={styles.graphDataContainer}>
        <div className={styles.leftPanel}>
          <FileUploadButton onFileSelect={handleFileSelect} />
          <UploadDataButton selectedFile={uploadedFile} onUploadSuccess={handleUploadSuccess} isEnabled={!!uploadedFile} />
          {graphData.length > 0 && (
            <>
              <SaveCsvDataButton
                data={{ graphData, boxPlotData, numbering: details }}
                fileName={uploadedFileName}
                onSaveSuccess={handleSaveDataSuccess}
              />
              <LineGraph
                averagedData={graphData}
                wNumber={details.wNumber}
                dwNumber={details.dwNumber}
                dieNumber={details.dieNumber}
                onDetailsChange={(key, value) => setDetails({ ...details, [key]: value })}
              />
              <BoxGraph boxplotStats={boxPlotData} />
            </>
          )}
        </div>
        <div className={styles.rightPanel}>
          <DataListUI />
        </div>
        {/* </div> */}
      </div>
    </div>
  );
}

export default GraphDataPage;
