import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { fetchDieTemperatureProfile } from '../../api';
import styles from './DieTempProfile.module.css';

const DieTemperatureProfileChart = () => {
  const [data, setData] = useState([]);

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

  return (
    <div className={styles['DieTempProfileWrap']}>
      <div className={styles['DieTempProfileContainer']}>
        <LineChart width={500} height={300} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" dataKey="dieNumber" allowDecimals={false} />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="min" stroke="#8884d8" />
          <Line type="monotone" dataKey="median" stroke="#82ca9d" />
          <Line type="monotone" dataKey="max" stroke="#ffc658" />
        </LineChart>
      </div>
    </div>
  );
};

export default DieTemperatureProfileChart;
