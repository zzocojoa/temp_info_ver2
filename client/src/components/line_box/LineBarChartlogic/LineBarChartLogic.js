// client\src\components\line_box\LineBarChartlogic\LineBarChartLogic.js

import React, { useEffect, useState } from 'react';
import styles from './LineBarChartLogic.module.css';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from 'recharts';

const transformData = (fileMetadata) => {
    return fileMetadata.map((item, index) => {
        const { min, median, max } = item.boxplotStats;
        const filedate = item.filedate;
        const dwNumber = item.numbering.dwNumber;
        return {
            index: index + 1,
            filedate,
            dwNumber,
            min,
            median,
            max,
            medianMinusMin: median - min,
            maxMinusMedian: max - median,
        };
    });
};

const TemperatureChart = ({ fileMetadata }) => {
    const [chartData, setChartData] = useState([]);
    const [chartTitle, setChartTitle] = useState('');

    useEffect(() => {
        const transformedData = transformData(fileMetadata);
        setChartData(transformedData);
        setChartTitle(`DW-Number: ${transformedData[0]?.dwNumber}`);
    }, [fileMetadata]);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className={styles['custom-tooltip']}>
                    <p>{payload[0].payload.filedate}</p>
                    <p>Min: {payload[0].payload.min.toFixed(2)}</p>
                    <p>Median: {payload[0].payload.median.toFixed(2)}</p>
                    <p>Max: {payload[0].payload.max.toFixed(2)}</p>
                </div>
            );
        }

        return null;
    };

    return (
        <>
            <div className={styles['chart-LineBarWrap']}>
                <div className={styles['chart-LineBarContainer']}>
                    <div className={styles['chart-LineBarTitle']}>
                        <h2 className={styles['chart-title']}>{chartTitle}</h2>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <ComposedChart
                            data={chartData}
                            margin={{
                                top: 20, right: 30, left: 20, bottom: 5,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="index" />
                            <YAxis yAxisId="left" orientation="left" domain={['auto', 'auto']} />
                            <YAxis yAxisId="right" orientation="right" domain={['auto', 'auto']} allowDataOverflow />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar yAxisId="left" dataKey="min" stackId="a" fill="#8884d8" name="Min" />
                            <Bar yAxisId="left" dataKey="medianMinusMin" stackId="a" fill="#82ca9d" name="Median" />
                            <Bar yAxisId="left" dataKey="maxMinusMedian" stackId="a" fill="#ffc658" name="Max" />
                            <Line yAxisId="right" type="monotone" dataKey="median" stroke="#00008B" name="Median Line" dot={false} activeDot={{ r: 4 }} />
                            <Brush dataKey="filedate" height={20} stroke="#8884d8" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </>
    );
};

export default TemperatureChart;
