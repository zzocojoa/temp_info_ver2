// client\src\components\line_box\pages\LineBarChart.js

import React, { useState, useEffect } from 'react';
import DwNumberSelector from '../DWSelector/DwNumberSelector';
import SelectedDwCharts from '../DWSelector/SelectedDwCharts';
import styles from './LineBarPage.module.css';
import { fetchDataList } from '../../../api';

const SelectorPage = () => {
  const [fileMetadata, setFileMetadata] = useState([]);
  const [selectedDwNumbers, setSelectedDwNumbers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDataList();
      setFileMetadata(data);
    };

    fetchData();
  }, []);

  const dwNumbers = [...new Set(fileMetadata.map(data => data.numbering.dwNumber))];

  return (
    <div className={styles['selectorWrap']}>
      <div className={styles['selectorContainer']}>
        <div className={styles['DwNumberSelectorBox']}>
          <DwNumberSelector
            dwNumbers={dwNumbers}
            selectedDwNumbers={selectedDwNumbers}
            setSelectedDwNumbers={setSelectedDwNumbers}
          />
        </div>
        <div className={styles['SelectedDwCharts']}>
          <SelectedDwCharts
            fileMetadata={fileMetadata}
            selectedDwNumbers={selectedDwNumbers}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectorPage;
