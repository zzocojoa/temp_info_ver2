// src/pages/GraphDataPage.js

import React, { useState } from 'react';
import FileUploadButton from '../components/FileUploadButton';
import UploadDataButton from '../components/UploadDataButton';
import SaveCsvDataButton from '../components/SaveCsvDataButton';
import LineGraph from '../components/LineGraph';
import BoxGraph from '../components/BoxGraph';
import DataListUI from '../components/DataListUI';

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
  };

  const handleSaveDataSuccess = () => {
    // alert('Data saved successfully!');
    // setIsDataSaved(true);
  };

  return (
    <div>
      <FileUploadButton onFileSelect={handleFileSelect} />
      <UploadDataButton selectedFile={uploadedFile} onUploadSuccess={handleUploadSuccess} isEnabled={!!uploadedFile} />
      {graphData.length > 0 && (
        <SaveCsvDataButton
          data={{ graphData, boxPlotData, numbering: details }}
          fileName={uploadedFileName}
          onSaveSuccess={handleSaveDataSuccess}
        />
      )}
      {graphData.length > 0 && (
        <div>
          <LineGraph
            averagedData={graphData}
            wNumber={details.wNumber}
            dwNumber={details.dwNumber}
            dieNumber={details.dieNumber}
            onDetailsChange={(key, value) => setDetails({ ...details, [key]: value })}
          />
          <BoxGraph boxplotStats={boxPlotData} />
        </div>
      )}
      <DataListUI />
    </div>
  );
}

export default GraphDataPage;
