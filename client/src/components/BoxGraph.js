// src\components\BoxGraph.js

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function BoxGraph({ data }) {
  const svgRef = useRef(); // svgRef 정의

  useEffect(() => {
    if (!data) return; // 데이터가 없으면 초기화하지 않음
    // D3를 사용한 그래프 그리기 로직 추가
    // 예: d3.select(svgRef.current)...
  }, [data]); // 데이터가 변경될 때마다 이펙트 실행

  return <svg ref={svgRef} width={500} height={300}></svg>; // svgRef를 svg 요소에 연결
}

export default BoxGraph;
