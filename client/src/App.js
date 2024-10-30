// client\src\App.js

import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Banner from './components/Banner';
import GraphDataPage from './components/tempgraph/pages/GraphDataPage';
import ViewDataPage from './components/tempgraph/pages/ViewDataPage';
import LineBarPage from './components/line_box/pages/LineBarPage';
import AnalysisPage from './components/clustercomponents/pages/analysisPage';
import ClusteredDataVisualization from './components/clustercomponents/ClusteredData';
import DieTemperatureProfileChart from './components/clustercomponents/DieTempProfile';
import Card from './components/3D/Card';
import Footer from './components/Footer';
import styles from './App.css';

// Importing the API function to fetch data
import { fetchDataList } from './api'; // Adjust the path as necessary

function App() {
  const profileImage = "./images/jeonghyeon-1.jpg";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // New state to hold the fetched data
  const [data, setData] = useState([]);

  // useEffect to fetch the data when the app loads
  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await fetchDataList(); // Call the API
        setData(fetchedData); // Update the state with fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
        alert(`Failed to load data: ${error.message}`);
      }
    };
    loadData(); // Fetch data on component mount
  }, []);  

  return (
    <Router>
      <div className={styles['root-display']}>
        <Banner isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div style={{ marginLeft: isSidebarOpen ? '160px' : '60px', transition: 'margin-left 0.3s ease' }}>
          <Routes>
            <Route path="/" element={<GraphDataPage data={data} />} />
            <Route path="/graph-data" element={<GraphDataPage data={data} />} />
            <Route path="/view-data" element={<ViewDataPage data={data} />} />
            <Route path="/line-bar" element={<LineBarPage data={data} />} />
            <Route path="/Analysis-page" element={<AnalysisPage data={data} />} />
            <Route path="/cluster-data" element={<ClusteredDataVisualization data={data} />} />
            <Route path="/dietemp-data" element={<DieTemperatureProfileChart data={data} />} />
            <Route path="/card" element={<Card selectedImage={profileImage} />} />
          </Routes>
        </div>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
