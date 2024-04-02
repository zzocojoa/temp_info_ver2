// client\src\components\tempgraph\tempgraphmodule\ThresholdOutlierEliminationlogic.js

import React, { useState } from 'react';
// import { Threshold, downloadFilteredData as downloadFilteredDataAPI } from '../../../api';
import { Threshold, downloadFilteredData as downloadFilteredDataAPI, API_BASE_URL } from '../../../api';

const ThresholdOutlierEliminationLogic = () => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadId, setUploadId] = useState('');

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
    setIsUploading(false);
    setUploadSuccess(false);
    setUploadId('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const result = await Threshold(files);
      if (result.uploadId) {
        setUploadId(result.uploadId);
        setUploadSuccess(true);
      } else {
        console.error('Upload was successful, but no upload ID was returned.');
        setUploadSuccess(false);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      setUploadSuccess(false);
    } finally {
      setIsUploading(false);
    }
  };

  const downloadFilteredData = async () => {
    if (!uploadId) {
      console.error('다운로드를 위한 업로드 ID가 없습니다.');
      return;
    }

    try {
      const url = `${API_BASE_URL}/download-filtered-data?uploadId=${encodeURIComponent(uploadId)}`;
      const response = await fetch(url);

      // 성공적인 응답인지 확인
      if (!response.ok) {
        throw new Error(`서버에서 오류 응답: ${response.status}`);
      }

      // response.blob()을 호출하기 전에 response가 유효한지 확인
      if (response) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'filtered_data.zip'; // 다운로드 받을 파일명
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
      } else {
        throw new Error('응답이 유효하지 않습니다.');
      }
    } catch (error) {
      console.error('필터링된 데이터를 다운로드하는데 실패했습니다:', error);
    }
  };


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" multiple onChange={handleFileChange} />
        <button type="submit" disabled={isUploading}>Upload</button>
      </form>
      {isUploading && <p>Uploading and processing...</p>}
      {uploadSuccess && (
        <>
          <p>업로드 및 처리가 완료되었습니다! 이제 필터링된 데이터를 다운로드할 수 있습니다.</p>
          <button onClick={downloadFilteredData} disabled={!uploadSuccess || !uploadId}>
            Download Filtered Data as CSV
          </button>
        </>
      )}
    </div>
  );
};

export default ThresholdOutlierEliminationLogic;
