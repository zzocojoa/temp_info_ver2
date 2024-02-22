// src\components\BoxGraph.js

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import styles from './BoxGraph.module.css'; // 가정한 CSS 모듈 경로

function BoxGraph({ boxplotStats }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!boxplotStats) return;
    const svg = d3.select(svgRef.current);
    const margin = { top: 10, right: 30, bottom: 30, left: 40 };
    const width = 460 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    svg.selectAll("*").remove();
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const y = d3.scaleLinear().domain([boxplotStats.min, boxplotStats.max]).range([height, 0]);
    g.append("g").call(d3.axisLeft(y));

    g.append("line")
      .attr("x1", width / 2)
      .attr("x2", width / 2)
      .attr("y1", y(boxplotStats.min))
      .attr("y2", y(boxplotStats.max))
      .attr("stroke", "black");

    g.append("rect")
      .attr("x", width / 2 - 50)
      .attr("y", y(boxplotStats.q3))
      .attr("height", y(boxplotStats.q1) - y(boxplotStats.q3))
      .attr("width", 100)
      .attr("stroke", "black")
      .style("fill", "#69b3a2");

    g.append("line")
      .attr("x1", width / 2 - 50)
      .attr("x2", width / 2 + 50)
      .attr("y1", y(boxplotStats.median))
      .attr("y2", y(boxplotStats.median))
      .attr("stroke", "black");

    g.selectAll(".whisker")
      .data([boxplotStats.min, boxplotStats.max])
      .enter()
      .append("line")
      .attr("x1", width / 2 - 25)
      .attr("x2", width / 2 + 25)
      .attr("y1", d => y(d))
      .attr("y2", d => y(d))
      .attr("stroke", "black");

    if (Array.isArray(boxplotStats.outliers)) {
      g.selectAll(".outlier")
        .data(boxplotStats.outliers)
        .enter()
        .append("circle")
        .attr("class", "outlier")
        .attr("cx", width / 2)
        .attr("cy", d => y(d))
        .attr("r", 5)
        .style("fill", "red");
    }
  }, [boxplotStats]);

  // 숫자 포맷팅 함수
  const formatNumber = (num) => num ? num.toFixed(2) : 'N/A';

  return (
    <div className={styles['graphDataWrap']}>
      <div className={styles['graphDataSVG']}>
        <svg ref={svgRef} width={460} height={400}></svg>
      </div>
      <div className={styles['graphDataTable']}>
        {boxplotStats && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>최소값</th>
                <td className={styles.td}>{formatNumber(boxplotStats.min)}</td>
              </tr>
              <tr>
                <th className={styles.th}>Q1 (25번째 백분위수)</th>
                <td className={styles.td}>{formatNumber(boxplotStats.q1)}</td>
              </tr>
              <tr>
                <th className={styles.th}>중앙값</th>
                <td className={styles.td}>{formatNumber(boxplotStats.median)}</td>
              </tr>
              <tr>
                <th className={styles.th}>Q3 (75번째 백분위수)</th>
                <td className={styles.td}>{formatNumber(boxplotStats.q3)}</td>
              </tr>
              <tr>
                <th className={styles.th}>최대값</th>
                <td className={styles.td}>{formatNumber(boxplotStats.max)}</td>
              </tr>
            </thead>
          </table>
        )}
      </div>
    </div>
  );
}

export default BoxGraph;
