// client/src/components/tempgraph/tempgraphmodule/Loader.js

import React, { useState, useEffect } from 'react';
import styles from './Loader.module.css';

const Loader = () => {
  // 시간 기반으로 진행률 계산하여 정확도 향상
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = 5000; // 5초 가정
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = (elapsed / totalDuration) * 100;
      if (newProgress >= 100) {
        setProgress(100);
        clearInterval(interval);
      } else {
        setProgress(newProgress);
      }
    }, 50); // 0.05초마다 진행률 업데이트

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={styles['loaderContainer']}>
      <div className={styles['progressBar']}>
        <div
          className={styles['progressFill']}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className={styles['progressText']}>{Math.round(progress)}% completed</div>
      {/* <div className={styles['progressText']}>{Math.round(progress)}%</div> */}
    </div>
  );
};

export default Loader;
