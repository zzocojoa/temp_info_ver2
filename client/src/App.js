// client\src\App.js

import React from 'react';
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
import './App.css';

function App() {
  // const profileImage = process.env.PUBLIC_URL + "/images/jeonghyeon-1.jpg";
  const profileImage = "./images/jeonghyeon-1.jpg";

  return (
    <Router>
      <Banner />
      <Routes>
        {/* <Route path="/"  /> */}
        <Route path="/" element={<GraphDataPage />} />
        <Route path="/graph-data" element={<GraphDataPage />} />
        <Route path="/view-data" element={<ViewDataPage />} />
        <Route path="/line-bar" element={<LineBarPage />} />
        <Route path="/Analysis-page" element={<AnalysisPage />} />
        <Route path="/cluster-data" element={<ClusteredDataVisualization />} />
        <Route path="/dietemp-data" element={<DieTemperatureProfileChart />} />
        <Route path="/card" element={<Card selectedImage={profileImage} />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
