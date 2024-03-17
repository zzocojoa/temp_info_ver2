// client/src/components/tempgraph/tempgraphmodule/StatisticsTable.js

import React from 'react';
import styles from './BoxGraph.module.css';

// 숫자 형식을 포맷하는 함수
const formatNumber = (num) => isNaN(parseFloat(num)) ? 'N/A' : parseFloat(num).toFixed(2);

const StatisticsTable = ({ stats }) => {
    return (
        <table className={styles['boxTable']}>
            <tbody>
                <tr>
                    <td>최대값</td>
                    <td>{formatNumber(stats.min)}</td>
                </tr>
                <tr>
                    <td>Q3 (75번째 백분위수)</td>
                    <td>{formatNumber(stats.q1)}</td>
                </tr>
                <tr>
                    <td>중앙값</td>
                    <td>{formatNumber(stats.median)}</td>
                </tr>
                <tr>
                    <td>Q1 (25번째 백분위수)</td>
                    <td>{formatNumber(stats.q3)}</td>
                </tr>
                <tr>
                    <td>최소값</td>
                    <td>{formatNumber(stats.max)}</td>
                </tr>
            </tbody>
        </table>
    );
};

export default StatisticsTable;