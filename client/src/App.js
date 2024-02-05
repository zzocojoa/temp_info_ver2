// src\App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Banner from './components/Banner';
import GraphDataPage from './pages/GraphDataPage';
import ViewDataPage from './pages/ViewDataPage';
import './App.css';

function App() {
  return (
    <Router>
      <Banner />
      <Routes>
        <Route path="/"  />
        <Route path="/graph-data" element={<GraphDataPage />} />
        <Route path="/view-data" element={<ViewDataPage />} />
      </Routes>
    </Router>
  );
}

export default App;
