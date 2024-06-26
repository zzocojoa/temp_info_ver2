// client\src\pages\ViewDataPage.js

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import LineGraph from '../tempgraphmodule/LineGraph';
import BoxGraph from '../tempgraphmodule/BoxGraph';
import DataListUI from '../tempgraphmodule/DataListUI';
import TextInputBox from '../tempgraphmodule/TextInputBox';
import { fetchDataDetails, updateData } from '../../../api';
import styles from './GraphData.module.css'

function ViewDataPage() {
  const location = useLocation();
  const { selectedItems } = location.state || {};
  const [graphData, setGraphData] = useState([]);
  const [boxPlotData, setBoxPlotData] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [startTime, setstartTime] = useState('');
  const [endTime, setendTime] = useState('');
  const [details, setDetails] = useState({
    countNumber: '',
    wNumber: '',
    dwNumber: '',
    dieNumber: '',
  });

  useEffect(() => {
    const fetchDetails = async () => {
      if (selectedItems && selectedItems.length > 0) {
        try {
          const detailsPromises = selectedItems.map(id => fetchDataDetails(id));
          const results = await Promise.all(detailsPromises);
          
          const allGraphData = results.flatMap(detail => detail.temperatureData || []);
          const allBoxPlotData = results.map(detail => detail.boxplotStats).filter(data => data);
          const firstUserInput = results[0]?.userInput || '';
          const firstItemDetails = results[0]?.numbering || {};
          const { countNumber, wNumber, dwNumber, dieNumber } = firstItemDetails;
          const setInitialStartTime = results[0]?.startTime || '';
          const setInitialEndTime = results[0]?.endTime || '';
    
          setDetails({ countNumber, wNumber, dwNumber, dieNumber });
          setGraphData(allGraphData);
          setBoxPlotData(allBoxPlotData);
          setUserInput(firstUserInput);
          setstartTime(setInitialStartTime);
          setendTime(setInitialEndTime);
        } catch (error) {
          console.error('Error fetching details:', error);
          alert('Failed to fetch data details');
        }
      }
    };
    

    fetchDetails();
  }, [selectedItems]);

  // textBox Update logic
  const handleSaveData = async () => {
    if (selectedItems && selectedItems.length > 0) {
      const itemId = selectedItems[0];
      try {
        // 수정된 userInput을 서버에 업데이트
        await updateData(itemId, { userInput });
        alert('데이터가 성공적으로 업데이트 되었습니다.');
      } catch (error) {
        console.error('데이터 업데이트 실패:', error);
        alert('데이터 업데이트에 실패했습니다.');
      }
    }
  };

  return (
    <div className={styles['graphDataWrap']}>
      <div className={styles['graphDataContainer']}>
        <div className={styles['leftPanel']}>
          <h2 className={styles['headerTitle']}>Graph Data Visualization</h2>
          {graphData.length > 0 ? (
            <LineGraph
              averagedData={graphData}
              countNumber={details.countNumber}
              wNumber={details.wNumber}
              dwNumber={details.dwNumber}
              dieNumber={details.dieNumber}
              onDetailsChange={(key, value) => setDetails(prev => ({ ...prev, [key]: value }))}
              onBrushChange={() => { }}
              initialStartTime={startTime}
              initialEndTime={endTime}
            />
          ) : (
            <p>Line graph 데이터를 불러오는 중...</p>
          )}
          {boxPlotData.length > 0 ? (
            boxPlotData.map((data, index) => <BoxGraph key={index} boxplotStats={data} />)
          ) : (
            <p>Box plot graph 데이터를 불러오는 중...</p>
          )}
        </div>
        <div className={styles['rightPanel']}>
          <DataListUI />
          <TextInputBox
            // className={styles['textBox']}
            value={userInput}
            onTextChange={setUserInput}
            onSave={handleSaveData}
            showSaveButton={true}
          />
        </div>
      </div>
    </div>
  );
}

export default ViewDataPage;
