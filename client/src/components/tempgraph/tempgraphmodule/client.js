// ```
// // client\src\pages\ViewDataPage.js

// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import LineGraph from '../tempgraphmodule/LineGraph';
// import BoxGraph from '../tempgraphmodule/BoxGraph';
// import DataListUI from '../tempgraphmodule/DataListUI';
// import TextInputBox from '../tempgraphmodule/TextInputBox';
// import { fetchDataDetails, updateData } from '../../../api';
// import styles from './GraphData.module.css'

// function ViewDataPage() {
//   const location = useLocation();
//   const { selectedItems } = location.state || {};
//   const [graphData, setGraphData] = useState([]);
//   const [boxPlotData, setBoxPlotData] = useState([]);
//   const [userInput, setUserInput] = useState('');
//   const [startTime, setstartTime] = useState('');
//   const [endTime, setendTime] = useState('');
//   const [details, setDetails] = useState({
//     countNumber: '',
//     wNumber: '',
//     dwNumber: '',
//     dieNumber: '',
//   });

//   useEffect(() => {
//     const fetchDetails = async () => {
//       if (selectedItems && selectedItems.length > 0) {
//         const detailsPromises = selectedItems.map(id => fetchDataDetails(id));
//         const results = await Promise.all(detailsPromises);
//         // MongoDB 스키마에 따라 수정된 데이터 접근 로직
//         const allGraphData = results.flatMap(detail => detail.temperatureData || []);
//         const allBoxPlotData = results.map(detail => detail.boxplotStats).filter(data => data);
//         // 사용자 입력 데이터 처리를 위해 첫 번째 선택된 항목의 userInput을 사용
//         const firstUserInput = results[0]?.userInput || '';
//         const firstItemDetails = results[0]?.numbering || {};
//         const { countNumber, wNumber, dwNumber, dieNumber } = firstItemDetails;
//         const setInitialStartTime = results[0]?.startTime || '';
//         const setInitialEndTime = results[0]?.endTime || '';

//         // 상태에 Die_Number, DW_Number, W_Number 저장
//         setDetails({ countNumber, wNumber, dwNumber, dieNumber });
//         setGraphData(allGraphData);
//         setBoxPlotData(allBoxPlotData);
//         setUserInput(firstUserInput);
//         setstartTime(setInitialStartTime);
//         setendTime(setInitialEndTime);
//       }
//     };

//     fetchDetails();
//   }, [selectedItems]);

//   // textBox Update logic
//   const handleSaveData = async () => {
//     if (selectedItems && selectedItems.length > 0) {
//       const itemId = selectedItems[0];
//       try {
//         // 수정된 userInput을 서버에 업데이트
//         await updateData(itemId, { userInput });
//         alert('데이터가 성공적으로 업데이트 되었습니다.');
//       } catch (error) {
//         console.error('데이터 업데이트 실패:', error);
//         alert('데이터 업데이트에 실패했습니다.');
//       }
//     }
//   };

//   return (
//     <div className={styles['graphDataWrap']}>
//       <div className={styles['graphDataContainer']}>
//         <div className={styles['leftPanel']}>
//           <h2 className={styles['headerTitle']}>Graph Data Visualization</h2>
//           {graphData.length > 0 ? (
//             <LineGraph
//               averagedData={graphData}
//               countNumber={details.countNumber}
//               wNumber={details.wNumber}
//               dwNumber={details.dwNumber}
//               dieNumber={details.dieNumber}
//               onDetailsChange={(key, value) => setDetails(prev => ({ ...prev, [key]: value }))}
//               onBrushChange={() => { }}
//               initialStartTime={startTime}
//               initialEndTime={endTime}
//             />
//           ) : (
//             <p>Line graph 데이터를 불러오는 중...</p>
//           )}
//           {boxPlotData.length > 0 ? (
//             boxPlotData.map((data, index) => <BoxGraph key={index} boxplotStats={data} />)
//           ) : (
//             <p>Box plot graph 데이터를 불러오는 중...</p>
//           )}
//         </div>
//         <div className={styles['rightPanel']}>
//           <DataListUI />
//           <TextInputBox
//             // className={styles['textBox']}
//             value={userInput}
//             onTextChange={setUserInput}
//             onSave={handleSaveData}
//             showSaveButton={true}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ViewDataPage;

// ```
// ```
// // client\src\pages\ViewDataPage.js

// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import LineGraph from '../tempgraphmodule/LineGraph';
// import BoxGraph from '../tempgraphmodule/BoxGraph';
// import DataListUI from '../tempgraphmodule/DataListUI';
// import TextInputBox from '../tempgraphmodule/TextInputBox';
// import { fetchDataDetails, updateData } from '../../../api';
// import styles from './GraphData.module.css'

// function ViewDataPage() {
//   const location = useLocation();
//   const { selectedItems } = location.state || {};
//   const [graphData, setGraphData] = useState([]);
//   const [boxPlotData, setBoxPlotData] = useState([]);
//   const [userInput, setUserInput] = useState('');
//   const [startTime, setstartTime] = useState('');
//   const [endTime, setendTime] = useState('');
//   const [details, setDetails] = useState({
//     countNumber: '',
//     wNumber: '',
//     dwNumber: '',
//     dieNumber: '',
//   });

//   useEffect(() => {
//     const fetchDetails = async () => {
//       if (selectedItems && selectedItems.length > 0) {
//         const detailsPromises = selectedItems.map(id => fetchDataDetails(id));
//         const results = await Promise.all(detailsPromises);
//         // MongoDB 스키마에 따라 수정된 데이터 접근 로직
//         const allGraphData = results.flatMap(detail => detail.temperatureData || []);
//         const allBoxPlotData = results.map(detail => detail.boxplotStats).filter(data => data);
//         // 사용자 입력 데이터 처리를 위해 첫 번째 선택된 항목의 userInput을 사용
//         const firstUserInput = results[0]?.userInput || '';
//         const firstItemDetails = results[0]?.numbering || {};
//         const { countNumber, wNumber, dwNumber, dieNumber } = firstItemDetails;
//         const setInitialStartTime = results[0]?.startTime || '';
//         const setInitialEndTime = results[0]?.endTime || '';

//         // 상태에 Die_Number, DW_Number, W_Number 저장
//         setDetails({ countNumber, wNumber, dwNumber, dieNumber });
//         setGraphData(allGraphData);
//         setBoxPlotData(allBoxPlotData);
//         setUserInput(firstUserInput);
//         setstartTime(setInitialStartTime);
//         setendTime(setInitialEndTime);
//       }
//     };

//     fetchDetails();
//   }, [selectedItems]);

//   // textBox Update logic
//   const handleSaveData = async () => {
//     if (selectedItems && selectedItems.length > 0) {
//       const itemId = selectedItems[0];
//       try {
//         // 수정된 userInput을 서버에 업데이트
//         await updateData(itemId, { userInput });
//         alert('데이터가 성공적으로 업데이트 되었습니다.');
//       } catch (error) {
//         console.error('데이터 업데이트 실패:', error);
//         alert('데이터 업데이트에 실패했습니다.');
//       }
//     }
//   };

//   return (
//     <div className={styles['graphDataWrap']}>
//       <div className={styles['graphDataContainer']}>
//         <div className={styles['leftPanel']}>
//           <h2 className={styles['headerTitle']}>Graph Data Visualization</h2>
//           {graphData.length > 0 ? (
//             <LineGraph
//               averagedData={graphData}
//               countNumber={details.countNumber}
//               wNumber={details.wNumber}
//               dwNumber={details.dwNumber}
//               dieNumber={details.dieNumber}
//               onDetailsChange={(key, value) => setDetails(prev => ({ ...prev, [key]: value }))}
//               onBrushChange={() => { }}
//               initialStartTime={startTime}
//               initialEndTime={endTime}
//             />
//           ) : (
//             <p>Line graph 데이터를 불러오는 중...</p>
//           )}
//           {boxPlotData.length > 0 ? (
//             boxPlotData.map((data, index) => <BoxGraph key={index} boxplotStats={data} />)
//           ) : (
//             <p>Box plot graph 데이터를 불러오는 중...</p>
//           )}
//         </div>
//         <div className={styles['rightPanel']}>
//           <DataListUI />
//           <TextInputBox
//             // className={styles['textBox']}
//             value={userInput}
//             onTextChange={setUserInput}
//             onSave={handleSaveData}
//             showSaveButton={true}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ViewDataPage;

// ```
// ```
// // client/src/components/tempgraph/tempgraphmodule/DataListUI.js

// import React, { useEffect, useState, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// // 가상 스크롤링을 위해 react-window 사용
// import { FixedSizeList as List } from 'react-window';
// import { fetchDataList, deleteData, fetchDataDetails } from '../../../api';
// import DataUploadComponent from './DataUploadComponent';
// import styles from './DataListUI.module.css';

// function DataListUI() {
//   const [dataList, setDataList] = useState([]);
//   const [filteredDataList, setFilteredDataList] = useState([]);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isHandleSaveCsvChecked, setIsHandleSaveCsvChecked] = useState(true);
//   const csvSaveModeText = isHandleSaveCsvChecked ? "개별" : "복수";
//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadDataList = async () => {
//       try {
//         const response = await fetchDataList();
//         if (response && Array.isArray(response)) {
//           setDataList(response);
//           setFilteredDataList(response);
//         }
//       } catch (error) {
//         console.error("데이터 로딩 중 오류 발생:", error);
//         alert('데이터를 로드하는데 실패했습니다.');
//       }
//     };
//     loadDataList();
//   }, []);

//   useEffect(() => {
//     // searchTerm이 변경될 때마다 실행되며, dataList를 기반으로 필터링
//     const filtered = dataList.filter(dataItem =>
//       `${dataItem.filedate}-${dataItem.numbering?.countNumber ?? ''}_${dataItem.numbering?.wNumber ?? ''}_${dataItem.numbering?.dwNumber ?? ''}_${dataItem.numbering?.dieNumber ?? ''}`
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase())
//     );
//     setFilteredDataList(filtered); // 필터링된 결과를 저장
//     // setDisplayCount(10); // 검색 후 보여줄 아이템 수를 초기화
//   }, [searchTerm, dataList]);

//   // useCallback을 사용하여 함수가 필요할 때만 재생성되도록 함
//   const handleCheckboxChange = useCallback((itemId) => {
//     setSelectedItems(prev => {
//       const newSelectedItems = prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId];
//       return newSelectedItems;
//     });
//   }, []);

//   const handleLoadSelectedData = useCallback(() => {
//     navigate('/view-data', { state: { selectedItems } });
//     setSelectedItems([]); // 추가: 불러오기 후 선택된 아이템 상태 초기화
//   }, [navigate, selectedItems]);

//   const handleRemoveSelectedData = async () => {
//     try {
//       await Promise.all(selectedItems.map(itemId => deleteData(itemId)));
//       const updatedDataList = dataList.filter(item => !selectedItems.includes(item._id));
//       setDataList(updatedDataList);
//       setFilteredDataList(updatedDataList);
//       setSelectedItems([]);
//     } catch (error) {
//       console.error("데이터 삭제 중 오류 발생:", error);
//       alert('데이터 삭제에 실패했습니다.');
//     }
//   };

//   const handleSelectAllChange = useCallback((e) => {
//     setSelectedItems(e.target.checked ? filteredDataList.map(item => item._id) : []);
//   }, [filteredDataList]);

//   // DB CSV data save
//   const handleSaveCsv = useCallback(async () => {
//     if (isHandleSaveCsvChecked) {
//       const selectedDataDetails = await Promise.all(selectedItems.map(id => fetchDataDetails(id)));

//       selectedDataDetails.forEach((item) => {
//         // CSV 헤더
//         const csvHeader = 'date,time,temperature\n';

//         // 각 항목의 temperatureData를 CSV 형식의 문자열로 변환
//         const csvRows = item.temperatureData.map(tempData => {
//           const { date, time, temperature } = tempData;
//           return `"${date}","${time}","${temperature}"`;
//         }).join("\n");

//         // 파일명 생성 로직 수정: 각 항목에 대한 고유 파일명 생성
//         const { filedate, numbering: { countNumber, wNumber, dwNumber, dieNumber } } = item;
//         // 파일명을 생성하는 부분을 forEach 루프 내부에 넣어 각 항목별로 고유한 이름을 가지도록 함
//         const csvFileName = `${filedate}-${countNumber}_${wNumber}_${dwNumber}_${dieNumber}`.replace(/\/|:|\s/g, '_'); // 파일명에 사용 불가능한 문자는 '_'로 대체

//         // CSV 헤더와 모든 행을 결합하여 최종 CSV 내용을 생성
//         const csvContent = `data:text/csv;charset=utf-8,${csvHeader}${csvRows}`;
//         const encodedUri = encodeURI(csvContent);

//         // 임시 링크를 생성하여 프로그램적으로 클릭 이벤트를 발생시켜 파일 다운로드를 트리거
//         const link = document.createElement('a');
//         link.setAttribute('href', encodedUri);
//         link.setAttribute('download', `${csvFileName}.csv`); // 수정된 파일명 사용
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//       });

//     } else {
//       // 선택된 항목의 상세 정보를 비동기적으로 가져옵니다.
//       const selectedDataDetails = await Promise.all(selectedItems.map(id => fetchDataDetails(id)));
//       // CSV 헤더
//       const csvHeader = 'filedate,countNumber,wNumber,dwNumber,dieNumber,min,median,max,startTime,endTime\n';
//       // 각 항목을 CSV 형식의 문자열로 변환
//       const csvRows = selectedDataDetails.map(item => {
//         const { filedate, numbering: { countNumber, wNumber, dwNumber, dieNumber }, boxplotStats: { min, median, max }, startTime, endTime } = item;
//         return `"${filedate}","${countNumber}","${wNumber}","${dwNumber}","${dieNumber}","${min}","${median}","${max}","${startTime}","${endTime}"`;
//       });
//       // CSV 헤더와 모든 행을 결합하여 최종 CSV 내용을 생성
//       const csvContent = `data:text/csv;charset=utf-8,${csvHeader}${csvRows.join("\n")}`;
//       // encodeURI를 사용하여 CSV 내용에 대한 URI를 생성
//       const encodedUri = encodeURI(csvContent);
//       // 임시 링크를 생성하여 프로그램적으로 클릭 이벤트를 발생시켜 파일 다운로드를 트리거
//       const link = document.createElement('a');
//       link.setAttribute('href', encodedUri);
//       link.setAttribute('download', 'selected_data.csv'); // 다운로드될 파일명 설정
//       document.body.appendChild(link); // 링크를 문서에 추가
//       link.click(); // 링크 클릭 이벤트 강제 실행
//       document.body.removeChild(link); // 사용 후 링크 제거
//     }
//   }, [isHandleSaveCsvChecked, selectedItems]);

//   // 가상 리스트를 통해 대규모 데이터 렌더링 최적화
//   const Row = useCallback(({ index, style }) => {
//     const { _id, filedate, numbering } = filteredDataList[index];
//     const { countNumber, wNumber, dwNumber, dieNumber } = numbering || {};
//     return (
//       <div style={style} key={_id} className={styles['dataItem']}>
//         <label htmlFor={`checkbox-${_id}`} className={styles['dataItemLabel']}>
//           <input
//             type="checkbox"
//             id={`checkbox-${_id}`}
//             checked={selectedItems.includes(_id)}
//             onChange={() => handleCheckboxChange(_id)}
//           />
//           {`${filedate}-${countNumber ?? 'N/A'}_${wNumber ?? 'N/A'}_${dwNumber ?? 'N/A'}_${dieNumber ?? 'N/A'}`}
//         </label>
//       </div>
//     );
//   }, [selectedItems, handleCheckboxChange, filteredDataList]);

//   // 검색 결과 및 선택된 아이템 개수 표시
//   const displayCounts = (
//     <div className={styles['dataCountsWrap']}>
//       <div className={styles['dataCountsContainer']}>
//         <div className={styles['dataCounts']}>
//           <span>총: {filteredDataList.length}</span>
//         </div>
//         <div className={styles['dataSelectCount']}>
//           <span>선택: {selectedItems.length}</span>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className={styles['DataListUIWrap']}>
//       <div className={styles['searchWrap']}>
//         <span className={styles['searchText']}>Search</span>
//         <input
//           type="text"
//           placeholder="데이터 검색..."
//           className={styles['searchContainer']}
//           value={searchTerm}
//           onChange={e => setSearchTerm(e.target.value)}
//         />
//       </div>
//       <DataUploadComponent />
//       {displayCounts}
//       <div className={styles['selectAllCheckbox']}>
//         <div className={styles['selectAllLabel']}>
//           <label className={styles['checkboxLabel']}>
//             <input
//               type="checkbox"
//               checked={selectedItems.length === filteredDataList.length && filteredDataList.length > 0}
//               onChange={handleSelectAllChange}
//             /> 전체 선택
//           </label>
//         </div>
//         <div className={styles['selectAllLabel']}>
//           <label className={styles['checkboxLabel']}>
//             <input
//               type="checkbox"
//               checked={isHandleSaveCsvChecked}
//               onChange={e => setIsHandleSaveCsvChecked(e.target.checked)}
//             />
//             <label>{`저장 유형: ${csvSaveModeText}`}</label>
//           </label>
//         </div>
//       </div>
//       <div className={styles['DataListContainer']}>
//         <List className={` ${styles['scroll']} ${styles['scroll-css']}`}
//           height={400} // 적절한 높이 설정
//           itemCount={filteredDataList.length}
//           itemSize={30} // 아이템의 높이
//           width={'100%'} // 컨테이너의 너비
//         >
//           {Row}
//         </List>
//       </div>
//       <div className={styles['buttonWrap']}>
//         <div className={styles['buttonContainer']}>
//           {selectedItems.length > 0 && (
//             <button onClick={handleRemoveSelectedData} className={styles['removeButton']}>제거</button>
//           )}
//         </div>
//         <div className={styles['userButton']}>
//           <div>
//             <button onClick={handleLoadSelectedData} className={styles['loadDataButton']}>불러오기</button>
//           </div>
//           <div>
//             <button onClick={handleSaveCsv} className={styles['saveCsvButton']}>CSV 데이터 저장</button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DataListUI;

// ```
// ```
// // src/components/CustomApexChart.js

// import React from 'react';
// import ReactApexChart from 'react-apexcharts';

// const CustomApexChart = ({ options, series }) => {
// return <ReactApexChart options={options} series={series} type="boxPlot" width={320} height={320} />;
// };

// export default CustomApexChart;
// ```
// ```
// // src/components/BoxGraph.js

// import React from 'react';
// import CustomApexChart from './CustomApexChart'; // 차트 컴포넌트
// import StatisticsTable from './StatisticsTable'; // 통계 테이블 컴포넌트
// import styles from './BoxGraph.module.css';

// const BoxGraph = ({ boxplotStats }) => {
//   const chartOptions = {
//     chart: { type: 'boxPlot', height: 350 },
//     title: { text: 'Temperature Box Plot', align: 'left' },
//     xaxis: { categories: ['Temperature'] },
//     yaxis: { labels: { formatter: (val) => val.toFixed(0) }, title: { text: 'Temperature (°C)' } },
//     plotOptions: { boxPlot: { colors: { upper: '#5C4742', lower: '#A5978B' } } }
//   };

//   const chartSeries = [{
//     name: 'Temperature',
//     data: [{
//       x: 'Temperature Distribution',
//       y: [boxplotStats.min, boxplotStats.q1, boxplotStats.median, boxplotStats.q3, boxplotStats.max, ...boxplotStats.outliers]
//     }]
//   }];

//   return (
//     <div className={styles['graphDataWrap']}>
//       <div className={styles['graphDataSVG']}>
//         <CustomApexChart options={chartOptions} series={chartSeries} />
//       </div>
//       <div className={styles['graphDataTable']}>
//         <StatisticsTable stats={boxplotStats} />
//       </div>
//     </div>
//   );
// };

// export default BoxGraph;

// ```
// ```
// // src\components\LineGraph.js

// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Tooltip, Brush, ReferenceLine,
// } from 'recharts';
// import { useLineGraphData } from './hooks/useLineGraphData';
// import { calculateMedian } from '../../../api';
// // import useCalculateMedian from './hooks/useCalculateMedian';

// import styles from './LineGraph.module.css'

// const LineGraph = React.memo(({
//   averagedData,
//   onDetailsChange,
//   countNumber,
//   dieNumber,
//   wNumber,
//   dwNumber,
//   onBrushChange,
//   initialStartTime,
//   initialEndTime,
//   setBoxplotStats
// }) => {
//   const { startTime, endTime, handleBrushChange } = useLineGraphData(averagedData, initialStartTime, initialEndTime, onBrushChange, setBoxplotStats);
//   const [chartSize, setChartSize] = useState({ width: 600, height: 300 });
//   const [medianValue, setMedianValue] = useState(0);

//   // 그래프 반응형 로직
//   useEffect(() => {
//     const handleResize = () => {
//       // 창 너비가 1145px 이하일 때는 window.innerWidth * 0.9, 그렇지 않으면 1000을 width로 사용
//       const maxWidth = 1145;
//       const calculatedWidth = window.innerWidth <= maxWidth ? window.innerWidth * 0.9 : Math.min(window.innerWidth * 0.6, 1000);
  
//       setChartSize({
//         // 최대 너비를 1000으로 제한하되, 창 너비가 1145px 이하일 경우는 90%를 적용
//         width: Math.min(calculatedWidth, 1000),
//         height: 400
//       });
//     };
  
//     window.addEventListener('resize', handleResize);
//     // 컴포넌트 마운트 시에도 크기 조정
//     handleResize();

//     // 이벤트 리스너 제거를 통한 메모리 누수 방지
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   // useCallback을 사용하여 함수 재생성 방지
//   const temperatureFormatter = useCallback((value) => `${value.toFixed(2)}°C`, []);

//   // useCalculateMedian 커스텀 훅을 사용하여 중앙값 계산 최적화
//   useEffect(() => {
//     const fetchMedian = async () => {
//       const temperatures = averagedData.map(item => item.temperature);
//       const median = await calculateMedian(temperatures); // Call the API to calculate median
//       setMedianValue(median);
//     };

//     fetchMedian();
//   }, [averagedData]);

//   return (
//     <>
//       <div className={styles['lineGrahpWrap']}>
//         <div className={styles['textWrap']}>
//           <div className={styles['textContainer']}>
//             <div className={styles['NumberWrap']}>
//               <div className={styles['ExWrap']}>
//                 <span className={styles['ExNumber']}>C_Number</span>
//                 <input
//                   type="text"
//                   placeholder="0000"
//                   className={styles['ExInfo']}
//                   value={countNumber || ''}
//                   onChange={(e) => onDetailsChange('countNumber', e.target.value)}
//                 />
//               </div>
//               <div className={styles['ExWrap']}>
//                 <span className={styles['ExNumber']}>W_Number</span>
//                 <input
//                   type="text"
//                   placeholder="0000"
//                   className={styles['ExInfo']}
//                   value={wNumber || ''}
//                   onChange={(e) => onDetailsChange('wNumber', e.target.value)}
//                 />
//               </div>
//               <div className={styles['ExWrap']}>
//                 <span className={styles['ExNumber']}>DW_Number</span>
//                 <input
//                   type="text"
//                   placeholder="0000"
//                   className={styles['ExInfo']}
//                   value={dwNumber || ''}
//                   onChange={(e) => onDetailsChange('dwNumber', e.target.value)}
//                 />
//               </div>
//               <div className={styles['ExWrap']}>
//                 <span className={styles['ExNumber']}>Die_Number</span>
//                 <input
//                   type="text"
//                   placeholder="0000"
//                   className={styles['ExInfo']}
//                   value={dieNumber || ''}
//                   onChange={(e) => onDetailsChange('dieNumber', e.target.value)}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className={styles['timeInputWrap']}>
//           <div className={styles['timeInputContainer']}>
//             <div className={styles['startTimeBox']}>
//               <span className={styles['startTimeTitle']}>Start Time</span>
//               <input
//                 className={styles['startTimeInput']}
//                 type="time"
//                 value={startTime || ''}
//                 readOnly
//               />
//             </div>
//             <div className={styles['endTimeBox']}>
//               <span className={styles['endTimeTitle']}>End Time</span>
//               <input
//                 className={styles['endTimeInput']}
//                 type="time"
//                 value={endTime || ''}
//                 readOnly
//               />
//             </div>
//           </div>
//         </div>
//         <LineChart className={styles['lineChart']}
//           width={chartSize.width}
//           height={chartSize.height}
//           data={averagedData}
//           margin={{
//             top: 20, right: 45, left: -10, bottom: 10,
//           }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <Tooltip formatter={temperatureFormatter} />
//           <XAxis dataKey="time"
//           />
//           <YAxis domain={['auto', 'auto']}
//           />
//           <Legend />
//           <Line
//             type="monotone"
//             dataKey="temperature"
//             stroke="#8884d8"
//             dot={false}
//             activeDot={{ r: 4 }}
//           />
//           <Brush
//             dataKey="Time"
//             height={30}
//             stroke="#8884d8"
//             onChange={handleBrushChange}
//           />
//           <ReferenceLine y={medianValue} label="Median" stroke="red" strokeDasharray="3 3" />
//         </LineChart>
//       </div>
//     </>
//   );
// });

// export default LineGraph;

// ```
// ```
// // src\components\FileUploadButton.js

// import React, { useState } from 'react';
// import styles from './FileUploadButton.module.css'

// function FileUploadButton({ onFileSelect }) {
//   const [selectedFile, setSelectedFile] = useState(null);

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     setSelectedFile(file);
//     onFileSelect(file); // 부모 컴포넌트로 파일 데이터 전달
//   };

//   return (
//     <div className={styles["fileUploadWrap"]}>
//       <div className={styles["fileUploadContainer"]}>
//         <div className={styles["fileUploadButton"]}>
//           <label htmlFor="file">
//             <div className={styles["fileUpload"]}>파일 업로드하기</div>
//           </label>
//           <input className={styles['fileUpload-btn']} type="file" id='file' onChange={handleFileChange} accept=".csv" />
//         </div>
//         <div className={styles["fileUploadName"]}>
//           {selectedFile && <p className={styles['fileName']}>File name: {selectedFile.name}</p>}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default FileUploadButton;

// ```
// ```
// // src/components/DataUploadComponent.js

// import React, { useState } from 'react';
// import { uploadCsvFile } from '../../../api';
// import styles from './DataUploadComponent.module.css';

// function DataUploadComponent() {
//   const [selectedFiles, setSelectedFiles] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState([]);
//   const [errorMessage, setErrorMessage] = useState('');

//   const handleFileChange = (event) => {
//     setSuccessMessage([]);
//     setErrorMessage('');
//     setSelectedFiles(event.target.files);
//   };

//   const handleUpload = async () => {
//     if (!selectedFiles || selectedFiles.length === 0) {
//       setErrorMessage('선택X');
//       return;
//     }
//     setIsLoading(true);
//     try {
//       const response = await uploadCsvFile(Array.from(selectedFiles));
//       setIsLoading(false);
//       setSuccessMessage(response.map((result, index) => ({
//         fileName: selectedFiles[index].name,
//         status: result.success ? '실패' : '성공',
//       })));
//     } catch (error) {
//       setIsLoading(false);
//       setErrorMessage('실패');
//       console.error('Error uploading file:', error);
//     }
//   };

//   return (
//     <div className={styles['DataUploadWrap']}>
//       <div className={styles['DataUploadContainer']}>
//         <div className={styles['DataUpload-wrap']}>
//           <label htmlFor="files">
//             <div className={styles["DataUploadSelect"]}>파일 업로드하기</div>
//           </label>
//           <input className={styles['DataUpload-sct']} type="file" id='files' multiple onChange={handleFileChange} accept=".csv" />
//         </div>
//         <button className={styles['DataUploadbutton']} onClick={handleUpload} disabled={isLoading}>
//           {isLoading ? '업로드 중...' : '업로드'}
//         </button>
//       </div>
//       <div className={styles['DataUploadResultWrap']}>
//         <div className={styles['DataUploadResultContainer']}>
//           <div className={styles['DataUploadResult-set']}>
//             {selectedFiles && (
//               <ul className={styles['fileNameList']}>
//                 {Array.from(selectedFiles).map((file, index) => (
//                   <li key={index}>{file.name}</li>
//                 ))}
//               </ul>
//             )}
//             <div className={styles['DataUploadResult']}>
//               {successMessage.map((result, index) => (
//                 <div key={index} className={result.status === '성공' ? styles['DataUploadSuccess'] : styles['DataUploadError']}>
//                   {`${result.status}`}
//                 </div>
//               ))}
//             </div>
//             {errorMessage && <div className={styles['DataUploadError']}>{errorMessage}</div>}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DataUploadComponent;
// ```
// ```
// // src/components/StatisticsTable.js
// import React from 'react';
// import styles from './BoxGraph.module.css';

// // 숫자 형식을 포맷하는 함수
// const formatNumber = (num) => isNaN(parseFloat(num)) ? 'N/A' : parseFloat(num).toFixed(2);

// const StatisticsTable = ({ stats }) => {
//     return (
//         <table className={styles['boxTable']}>
//             <tbody>
//                 <tr>
//                     <td>최대값</td>
//                     <td>{formatNumber(stats.min)}</td>
//                 </tr>
//                 <tr>
//                     <td>Q3 (75번째 백분위수)</td>
//                     <td>{formatNumber(stats.q1)}</td>
//                 </tr>
//                 <tr>
//                     <td>중앙값</td>
//                     <td>{formatNumber(stats.median)}</td>
//                 </tr>
//                 <tr>
//                     <td>Q1 (25번째 백분위수)</td>
//                     <td>{formatNumber(stats.q3)}</td>
//                 </tr>
//                 <tr>
//                     <td>최소값</td>
//                     <td>{formatNumber(stats.max)}</td>
//                 </tr>
//             </tbody>
//         </table>
//     );
// };

// export default StatisticsTable;
// ```
// ```
// // src/components/SaveCsvDataButton.js

// import React from 'react';
// import styles from './SaveCsvDataButton.module.css'
// import { saveData } from '../../../api';

// function SaveCsvDataButton({ data, fileName, onSaveSuccess, startTime, endTime }) {
//   const downloadCsv = (data, fileName) => {
//     // numbering 정보가 있는 경우 해당 값을 사용하고, 없는 경우 기본값 사용
//     const { countNumber = 'N/A', wNumber = 'N/A', dwNumber = 'N/A', dieNumber = 'N/A' } = data.numbering || {};
//     const graphData = data.graphData;

//     // 파일명에서 날짜 추출
//     const dateMatch = fileName.match(/\d{4}-\d{2}-\d{2}/);
//     const dateFromFileName = dateMatch ? dateMatch[0] : new Date().toISOString().split('T')[0];

//     const finalFileName = `${dateFromFileName}-${countNumber}_${wNumber}_${dwNumber}_${dieNumber}.csv`;
//     // console.log("finalFileName :", finalFileName);
//     let csvContent = "data:text/csv;charset=utf-8,date,time,temperature\n";

//     // graphData가 정의되지 않았을 경우를 처리
//     (graphData || []).forEach(row => {
//       const { date, time, temperature } = row;
//       csvContent += `${date},${time},${temperature}\n`;
//     });

//     // CSV 파일 다운로드 로직
//     const encodedUri = encodeURI(csvContent);
//     const link = document.createElement('a');
//     link.setAttribute('href', encodedUri);
//     link.setAttribute('download', finalFileName);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // 다운로드 핸들 로직
//   const handleSaveData = async () => {
//     try {
//       const dateMatch = fileName.match(/\d{4}-\d{2}-\d{2}/);
//       const filedate = dateMatch ? dateMatch[0] : new Date().toISOString().split('T')[0]; // 파일명에서 날짜 추출
//       const { userInput } = data;

//       await saveData({ ...data, filedate, userInput, startTime, endTime });
//       onSaveSuccess();
//     } catch (error) {
//       alert('Error saving data.');
//     }
//     downloadCsv(data, fileName);
//   };

//   return (
//     <button className={styles['DownloadBtn']} onClick={handleSaveData}>Download CSV</button>
//   );
// }

// export default SaveCsvDataButton;

// ```
// ```
// // client\src\components\Loader.js

// import React from 'react';
// import styles from './Loader.module.css'

// function Loader() {
//   return <div className={styles['loader']}></div>;
// }

// export default Loader;

// ```
// ```
// // client\src\components\tempgraph\tempgraphmodule\useCalculateMedian.js

// const useCalculateMedian = (data) => {
//     if (!data || data.length === 0) return 0;
  
//     const sortedData = [...data].sort((a, b) => a - b);
//     const midIndex = Math.floor(sortedData.length / 2);
  
//     if (sortedData.length % 2 === 0) {
//       // 짝수 개의 요소가 있을 경우, 가운데 두 수의 평균 반환
//       return (sortedData[midIndex - 1] + sortedData[midIndex]) / 2;
//     } else {
//       // 홀수 개의 요소가 있을 경우, 가운데 수 반환
//       return sortedData[midIndex];
//     }
//   };
  
//   export default useCalculateMedian;
  
// ```
// ```
// // src\components\UploadDataButton.js

// import React, { useState } from 'react';
// import styles from './UploadDataButton.module.css'
// import { uploadFile } from '../../../api';
// import Loader from './Loader';

// function UploadDataButton({ selectedFile, onUploadSuccess, isEnabled }) {
//   const [isLoading, setIsLoading] = useState(false);

//   const handleUpload = async () => {

//     if (!selectedFile) {
//       alert('Please select a file first.');
//       return;
//     }

//     setIsLoading(true); // 업로드 시작 시 로딩 상태를 true로 설정

//     try {
//       // API를 호출하여 파일 업로드
//       const response = await uploadFile(selectedFile);
//       setIsLoading(false); // 업로드 성공 또는 실패 시 로딩 상태를 false로 설정
//       if (response) {
//         const { averagedData, boxplotStats } = response;
//         const startTime = averagedData[0]?.time || '';
//         const endTime = averagedData[averagedData.length - 1]?.time || '';
//         onUploadSuccess(averagedData, boxplotStats, selectedFile.name, startTime, endTime);
//         // alert('File uploaded successfully!');
//       } else {
//         // 서버 응답이 없거나 업로드 실패 시
//         alert('Failed to upload file.');
//       }
//     } catch (error) {
//       setIsLoading(false); // 오류 발생 시 로딩 상태를 false로 설정
//       console.error('Error uploading file:', error);
//       alert('Error uploading file.');
//     }
//   };

//   return (
//     <>
//       {isLoading ? (
//         <Loader /> // 로딩 중인 경우 로딩 인디케이터(스피너 등)를 표시
//       ) : (
//         <button className={styles['UploadDataButton']} onClick={handleUpload} disabled={!isEnabled || isLoading}>
//           그래프 생성
//         </button>
//       )}
//     </>
//   );
// }

// export default UploadDataButton;

// ```
// ```
// // src/components/TextInputBox.js

// import React from 'react';
// import styles from './TextInputBox.module.css';

// function TextInputBox({ value, onTextChange, onSave, showSaveButton }) {
//   const handleChange = (event) => {
//     onTextChange(event.target.value);
//   };

//   return (
//     <div className={styles['textBoxUIWrap']}>
//       <div className={styles['textBoxUIContainer']}>
//         <div className={styles['textBoxUITitle']}>
//           <h3 className={styles['title']}>상세 정보 입력</h3>
//           {showSaveButton && (
//             <button
//               className={styles['resaveDataButton']}
//               onClick={onSave}
//               style={{ marginTop: '10px' }}>
//               저장
//             </button>
//           )}
//         </div>
//         <textarea
//           className={styles['textBoxTextarea']}
//           type="text"
//           value={value}
//           rows="10"
//           onChange={handleChange} />
//       </div>

//     </div>
//   );
// }

// export default TextInputBox;

// ```
// ```
// // src\App.js

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Banner from './components/Banner';
// import LineBarPage from './components/line_box/pages/LineBarPage';
// import GraphDataPage from './components/tempgraph/pages/GraphDataPage';
// import ViewDataPage from './components/tempgraph/pages/ViewDataPage';
// import Card from './components/3D/Card'
// import Footer from './components/Footer';
// import './App.css';

// function App() {
//   const profileImage = process.env.PUBLIC_URL + "/images/jeonghyeon.jpg";
//   return (
//     <Router>
//       <Banner />
//       <Routes>
//         <Route path="/"  />
//         <Route path="/line-bar" element={<LineBarPage />} />
//         <Route path="/graph-data" element={<GraphDataPage />} />
//         <Route path="/view-data" element={<ViewDataPage />} />
//         <Route path="/Card" element={<Card selectedImage={profileImage} />} />
//       </Routes>
//       <Footer />
//     </Router>
//   );
// }

// export default App;

// ```
// ```
// // client/src/components/Footer.js

// import React from 'react';
// import styles from './Footer.module.css';

// const Footer = () => {

//   return (
//     <footer>
//       <div className={styles['footerText']}>Copyright © HOIHOU All Rights Reserved.</div>
//     </footer>
//   );
// };

// export default Footer;

// ```
// ```
// // client/src/components/Banner.js

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import styles from './Banner.module.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTemperatureHigh } from '@fortawesome/free-solid-svg-icons';
// import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons';
// // import { faFacebookSquare, faInstagramSquare } from '@fortawesome/free-brands-svg-icons';



// function Banner() {
//     let navigate = useNavigate();

//     // 홈으로 이동
//     const navigateTo = (path) => {
//         navigate(path);
//     };

//     return (
//         <div className={styles['bannerWrap']}>
//             <div className={styles['bannerContainer']}>
//                 <div className={styles['banner']}>
//                     <div onClick={() => navigateTo('/')} style={{ cursor: 'pointer' }}>
//                         <div className={styles['banner-logo']}>
//                             <img src={`${process.env.PUBLIC_URL}/images/logo.png`} alt="logo" />
//                             {/* <div className={styles['banner-title']}>T/B</div> */}
//                         </div>
//                     </div>
//                     <ul className={styles['banner-menu']}>
//                         <li onClick={() => navigateTo('/line-bar')} style={{ cursor: 'pointer' }}>
//                             <FontAwesomeIcon icon={faTemperatureHigh} />
//                             Line/Bar
//                         </li>
//                         <li onClick={() => navigateTo('/graph-data')} style={{ cursor: 'pointer' }}>
//                             <FontAwesomeIcon icon={faTemperatureHigh} />
//                             온도 그래프
//                         </li>
//                         <li onClick={() => navigateTo('/graph-data')} style={{ cursor: 'pointer' }}>
//                             <FontAwesomeIcon icon={faTemperatureHigh} />
//                             준비중
//                         </li>
//                         <li onClick={() => navigateTo('/graph-data')} style={{ cursor: 'pointer' }}>
//                             <FontAwesomeIcon icon={faTemperatureHigh} />
//                             준비중
//                         </li>
//                         {/* 추가적인 메뉴 항목에 대한 경로 설정이 필요하면 여기에 구현 */}
//                     </ul>

//                     <ul className={styles['banner-icons']}>
//                         <li><FontAwesomeIcon icon={faFacebookSquare} /></li>
//                         <li onClick={() => navigateTo('/Card')} style={{ cursor: 'pointer' }}>
//                             <img className={styles['developer-icon']} src={`${process.env.PUBLIC_URL}/images/Beatlefeed.png`} alt="logo" />
//                             {/* <FontAwesomeIcon icon={faInstagramSquare} /> */}
//                         </li>
//                     </ul>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Banner;
// ```