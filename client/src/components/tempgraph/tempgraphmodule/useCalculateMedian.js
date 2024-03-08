// client\src\components\tempgraph\tempgraphmodule\useCalculateMedian.js

const useCalculateMedian = (data) => {
    if (!data || data.length === 0) return 0;
  
    const sortedData = [...data].sort((a, b) => a - b);
    const midIndex = Math.floor(sortedData.length / 2);
  
    if (sortedData.length % 2 === 0) {
      // 짝수 개의 요소가 있을 경우, 가운데 두 수의 평균 반환
      return (sortedData[midIndex - 1] + sortedData[midIndex]) / 2;
    } else {
      // 홀수 개의 요소가 있을 경우, 가운데 수 반환
      return sortedData[midIndex];
    }
  };
  
  export default useCalculateMedian;
  