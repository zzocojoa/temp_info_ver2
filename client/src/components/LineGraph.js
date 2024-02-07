// src\components\LineGraph.js

import React from 'react';
import {
  Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush
 } from 'recharts';

function LineGraph({ data }) {
<<<<<<< HEAD
  
=======
>>>>>>> parent of 175ce43 (add commit)
  return (
    <LineChart
          width={1000}
          height={500}
          data={data}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="Time" />
          <YAxis />
          {/* <Tooltip formatter={temperatureFormatter} /> */}
          <Legend />
          <Line type="monotone" dataKey="Temperature" stroke="#8884d8" />
          <Brush dataKey="Time" height={30} stroke="#8884d8"  />
        </LineChart>
  );
}

export default LineGraph;
