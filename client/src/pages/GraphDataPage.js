// src/pages/GraphDataPage.js

import React, { useState } from 'react';
import FileUploadButton from '../components/FileUploadButton';
import UploadDataButton from '../components/UploadDataButton';
import LineGraph from '../components/LineGraph';
import BoxGraph from '../components/BoxGraph';

function GraphDataPage() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [boxPlotData, setBoxPlotData] = useState(null);

  const handleFileSelect = (file) => {
    setUploadedFile(file);
    setGraphData([]);
    setBoxPlotData(null);
  };

  const handleUploadSuccess = async (averagedData, boxplotStats) => {
    setGraphData(averagedData);
    setBoxPlotData(boxplotStats);
  };

  return (
    <div>
      <FileUploadButton onFileSelect={handleFileSelect} />
      <UploadDataButton selectedFile={uploadedFile} onUploadSuccess={handleUploadSuccess} isEnabled={!!uploadedFile} />
      {graphData.length > 0 && <LineGraph averagedData={graphData} />}
      {boxPlotData && <BoxGraph boxplotStats={boxPlotData} />}
    </div>
  );
}

export default GraphDataPage;
