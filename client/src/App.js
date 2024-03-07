// src\App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Banner from './components/tempgraph/tempgraphmodule/Banner';
import GraphDataPage from './components/tempgraph/pages/GraphDataPage';
import ViewDataPage from './components/tempgraph/pages/ViewDataPage';
import Card from './components/3D/Card'
import Footer from './components/tempgraph/tempgraphmodule/Footer';
import './App.css';

function App() {
  const profileImage = process.env.PUBLIC_URL + "/images/jeonghyeon.jpg";
  return (
    <Router>
      <Banner />
      <Routes>
        <Route path="/"  />
        <Route path="/graph-data" element={<GraphDataPage />} />
        <Route path="/view-data" element={<ViewDataPage />} />
        <Route path="/Card" element={<Card selectedImage={profileImage} />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
