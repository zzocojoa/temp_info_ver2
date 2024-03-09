// client\src\components\line_box\LineBarChartlogic\LineBarChartLogic.js

import React, { useEffect, useState } from 'react';
import { BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const transformData = (fileMetadata) => {
    return fileMetadata.map((item, index) => {
        const { min, median, max } = item.boxplotStats;
        return {
            index: index + 1,
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

    useEffect(() => {
        try {
            const transformedData = transformData(fileMetadata);
            setChartData(transformedData);
        } catch (error) {
            console.error('Error transforming data:', error);
        }
    }, [fileMetadata]);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip" style={{ backgroundColor: 'white', padding: '5px', border: '1px solid #ccc' }}>
                    <p>index : {payload[0].payload.index}</p>
                    <p>최소 온도 : {payload[0].payload.min.toFixed(2)}</p>
                    <p>중앙 온도 : {payload[0].payload.median.toFixed(2)}</p>
                    <p>최대 온도 : {payload[0].payload.max.toFixed(2)}</p>
                </div>
            );
        }

        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={400}>
            <BarChart
                data={chartData}
                margin={{
                    top: 20, right: 30, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="index" />
                <YAxis domain={[400, 700]} />
                <YAxis yAxisId="right" orientation="right" domain={[400, 700]} allowDataOverflow />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="min" stackId="a" fill="#8884d8" name="최소 온도" />
                <Bar dataKey="medianMinusMin" stackId="a" fill="#82ca9d" name="중앙 온도" />
                <Bar dataKey="maxMinusMedian" stackId="a" fill="#ffc658" name="최대 온도" />
                <Line yAxisId="right" type="monotone" dataKey="median" stroke="darkblue" name="중앙 온도" dot={false} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default TemperatureChart;
