// client/src/components/tempgraph/tempgraphmodule/ProgressBar.js

import React from 'react';
import './ProgressBar.css'; // 스타일 파일

const ProgressBar = ({ percentage }) => {
  return (
    <div className="progress-bar-wrapper">
      <div className="progress-bar-background">
        <div
          className="progress-bar-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="progress-bar-text">{percentage}% completed</div>
    </div>
  );
};

export default ProgressBar;
