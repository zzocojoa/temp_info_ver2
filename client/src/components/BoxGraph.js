// src\components\BoxGraph.js

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function BoxGraph({ stats }) {
  const svgRef = useRef(); // SVG 요소를 위한 ref 생성

  useEffect(() => {
    if (!stats) return; // stats가 없다면 그리기 중단

    const svg = d3.select(svgRef.current);
    const margin = { top: 10, right: 30, bottom: 30, left: 40 };
    const width = 450 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // 이전에 추가된 요소를 모두 지웁니다.
    svg.selectAll("*").remove();

    // SVG 요소에 그룹 요소 추가 및 변환 적용
    const g = svg.append('g')
                 .attr("transform", `translate(${margin.left},${margin.top})`);

    // 축 스케일 생성
    const y = d3.scaleLinear()
                .domain([stats.min, stats.max])
                .range([height, 0]);
    g.append("g").call(d3.axisLeft(y));

    // 주 수직선(박스의 중심선)
    g.append("line")
     .attr("x1", width / 2)
     .attr("x2", width / 2)
     .attr("y1", y(stats.min))
     .attr("y2", y(stats.max))
     .attr("stroke", "black");

    // 박스 그리기
    g.append("rect")
     .attr("x", width / 2 - 50)
     .attr("y", y(stats.q3))
     .attr("height", y(stats.q1) - y(stats.q3))
     .attr("width", 100)
     .attr("stroke", "black")
     .style("fill", "#69b3a2");

    // 중앙값 선 그리기
    g.append("line")
     .attr("x1", width / 2 - 50)
     .attr("x2", width / 2 + 50)
     .attr("y1", y(stats.median))
     .attr("y2", y(stats.median))
     .attr("stroke", "black");

    // 최소 및 최대값 수평선(whiskers) 그리기
    g.selectAll(".whisker")
     .data([stats.min, stats.max])
     .enter().append("line")
     .attr("x1", width / 2 - 25)
     .attr("x2", width / 2 + 25)
     .attr("y1", d => y(d))
     .attr("y2", d => y(d))
     .attr("stroke", "black");

    // 이상치 그리기
    if (Array.isArray(stats.outliers)) {
      g.selectAll(".outlier")
       .data(stats.outliers)
       .enter().append("circle")
       .attr("class", "outlier")
       .attr("cx", width / 2)
       .attr("cy", d => y(d))
       .attr("r", 5)
       .style("fill", "red");
    }
  }, [stats]); // stats가 변경될 때마다 효과를 다시 실행

  return (
    <svg ref={svgRef} width={450} height={400}></svg> // SVG 요소를 반환, ref 사용
  );
}

export default BoxGraph;
