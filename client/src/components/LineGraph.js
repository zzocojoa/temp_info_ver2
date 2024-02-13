// src\components\LineGraph.js

import React from 'react';
import {
  Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, Brush
} from 'recharts';
import styles from './LineGraph.module.css'

function LineGraph({ averagedData, wNumber, dwNumber, dieNumber, onDetailsChange }) {

  return (
    <>
      <div className={styles['NumberWrap']}>
        <label>
          <p>W_number:</p>
          <input type="text" value={wNumber} onChange={(e) => onDetailsChange('wNumber', e.target.value)} />
        </label>
        <label>
          <p>DW_number:</p>
          <input type="text" value={dwNumber} onChange={(e) => onDetailsChange('dwNumber', e.target.value)} />
        </label>
        <label>
          <p>Die_number:</p>
          <input type="text" value={dieNumber} onChange={(e) => onDetailsChange('dieNumber', e.target.value)} />
        </label>
      </div>
      <LineChart
        width={1000}
        height={500}
        data={averagedData}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Time" />
        <YAxis />
        <Legend />
        <Line type="monotone" dataKey="Temperature" stroke="#8884d8" />
        <Brush dataKey="Time" height={30} stroke="#8884d8" />
      </LineChart>
    </>
  );
}

export default LineGraph;

