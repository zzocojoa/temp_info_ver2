// client\src\components\line_box\LineBarChartlogic\utils\clusterDataByDwNumber.js

const clusterDataByDwNumber = (fileMetadata) => {
  const clusterMap = {};

  fileMetadata.forEach(item => {
    const dwNumber = item.numbering.dwNumber;

    if (!clusterMap[dwNumber]) {
      clusterMap[dwNumber] = [];
    }

    clusterMap[dwNumber].push(item);
  });

  return Object.values(clusterMap);
};

export default clusterDataByDwNumber;
