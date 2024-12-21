import React, { useState } from 'react';
import ClusteringVisualization from './ClusteringVisualization';
import { performClustering } from '../../../api';
import './extrusion_clustering.css'; // CSS 파일 추가

function ClusteringComponent() {
  const [dwNumber, setDwNumber] = useState('');
  const [k, setK] = useState(3);
  const [clusteringResults, setClusteringResults] = useState(null);

  const handlePerformClustering = async () => {
    if (!dwNumber.trim()) {
      alert('Please enter a valid DW Number.');
      return;
    }
    if (k <= 0 || isNaN(k)) {
      alert('Please enter a valid number of clusters (k).');
      return;
    }

    try {
      const results = await performClustering({ dwNumber, k });
      console.log('Clustering Results Received:', results);
      setClusteringResults(results.results);
    } catch (error) {
      alert('Error performing clustering. Please try again later.');
      console.error('Clustering error:', error);
    }
  };

  return (
    <div className="upload-container">
      <h3>Extrusion Clustering</h3>
      <div className="input-group">
        <label htmlFor="dwNumber">DW Number:</label>
        <input
          id="dwNumber"
          type="text"
          value={dwNumber}
          onChange={(e) => setDwNumber(e.target.value)}
          placeholder="Enter DW Number"
        />
      </div>
      <div className="input-group">
        <label htmlFor="clusters">Number of Clusters (k):</label>
        <input
          id="clusters"
          type="number"
          value={k}
          onChange={(e) => setK(Number(e.target.value))}
          min="1"
        />
      </div>
      <button className="upload-button" onClick={handlePerformClustering}>
        Perform Clustering
      </button>
      {clusteringResults && (
        <div className="result-container">
          <ClusteringVisualization
            clusteringResults={clusteringResults}
            title={dwNumber}
          />
        </div>
      )}
    </div>
  );
}

export default ClusteringComponent;
