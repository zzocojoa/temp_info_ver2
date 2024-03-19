// client\src\components\clustercomponents\DieTempProfile.js

import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchDieTemperatureProfile } from '../../api';
import styles from './DieTempProfile.module.css';
import useWindowSize from './hooks/useWindowSize';

const DieTemperatureProfileChart = () => {
  const [data, setData] = useState([]);
  const [width, height] = useWindowSize();

  useEffect(() => {
    const loadData = async () => {
      const dieTemperatureProfile = await fetchDieTemperatureProfile();

      const formattedData = dieTemperatureProfile.map(item => ({
        ...item,
        dieNumber: Number(item.dieNumber),
      }));
      console.log("Formatted dieTemperatureProfile: ", formattedData);
      setData(formattedData);
    };
    loadData();
  }, []);

  const chartWidth = width * 0.9;
  const chartHeight = height * 0.6;

  return (
    <div className={styles['DieTempProfileWrap']}>
      <div className={styles['DieTempProfileContainer']}>
        <div className={styles['DieTempProfileBox']}>
          <ResponsiveContainer width={chartWidth} height={chartHeight}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="dieNumber" allowDecimals={false} />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="min" stroke="#8884d8" />
              <Line type="monotone" dataKey="median" stroke="#82ca9d" />
              <Line type="monotone" dataKey="max" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DieTemperatureProfileChart;
