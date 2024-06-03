// ```
// // client\src\components\tempgraph\pages\GraphDataPage.js

// import React, { useState, useEffect, useCallback } from 'react';
// import FileUploadButton from '../tempgraphmodule/FileUploadButton';
// import UploadDataButton from '../tempgraphmodule/UploadDataButton';
// import SaveCsvDataButton from '../tempgraphmodule/SaveCsvDataButton';
// import LineGraph from '../tempgraphmodule/LineGraph';
// import BoxGraph from '../tempgraphmodule/BoxGraph';
// import DataListUI from '../tempgraphmodule/DataListUI';
// import TextInputBox from '../tempgraphmodule/TextInputBox';
// import ThresholdOutlierEliminationLogic from '../tempgraphmodule/ThresholdOutlierEliminationlogic';
// import styles from './GraphData.module.css';
// import Papa from 'papaparse'; // Import PapaParse

// const GraphDataPage = React.memo(() => {
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [graphData, setGraphData] = useState([]);
//   const [selectedRange, setSelectedRange] = useState({ start: 0, end: 0 });
//   const [startTime, setStartTime] = useState('');
//   const [endTime, setEndTime] = useState('');
//   const [initialStartTime, setInitialStartTime] = useState('');
//   const [initialEndTime, setInitialEndTime] = useState('');
//   const [boxPlotData, setBoxPlotData] = useState(null);
//   const [uploadedFileName, setUploadedFileName] = useState('');
//   const [userInput, setUserInput] = useState('');
//   const [details, setDetails] = useState({
//     countNumber: '',
//     wNumber: '',
//     dwNumber: '',
//     dieNumber: '',
//   });

//   // 그래프 생성 여부를 추적하는 상태 추가
//   const [isGraphGenerated, setIsGraphGenerated] = useState(false);

//   const handleFileSelect = useCallback((file) => {
//     setUploadedFile(file);
//     setGraphData([]);
//     setBoxPlotData(null);
//     setUserInput('');
//     setIsGraphGenerated(false);
//   }, []);

//   const handleUploadSuccess = useCallback((
//     averagedData, boxplotStats,
//     uploadedFileName, startTime, endTime,
//     uploadedStartTime, uploadedEndTime
//   ) => {
//     setGraphData(averagedData);
//     setBoxPlotData(boxplotStats);
//     setUploadedFileName(uploadedFileName);
//     setIsGraphGenerated(true);
//     setInitialStartTime(startTime);
//     setInitialEndTime(endTime);
//     setStartTime(uploadedStartTime);
//     setEndTime(uploadedEndTime);
//   }, []);

//   useEffect(() => {
//     // props로 받은 initialStartTime과 initialEndTime을 사용하여 초기 시간 설정
//     setStartTime(initialStartTime);
//     setEndTime(initialEndTime);
//   }, [initialStartTime, initialEndTime]);

//   const handleSaveDataSuccess = useCallback(() => {
//     // 데이터 저장 성공 처리 로직
//   }, []);

//   const handleBrushChange = useCallback((startIndex, endIndex) => {
//     // 시간 UI 상태로 저장
//     const newStartTime = graphData[startIndex]?.time || '';
//     const newEndTime = graphData[endIndex]?.time || '';
//     setStartTime(newStartTime);
//     setEndTime(newEndTime);
//     // 선택된 데이터 범위를 상태로 저장
//     setSelectedRange({ start: startIndex, end: endIndex });
//   }, [graphData]);

//   const processFile = (file) => {
//     const reader = new FileReader();
//     reader.onload = (event) => {
//       const csvData = event.target.result;
//       // CSV 데이터를 JSON으로 파싱하는 로직 추가
//       const parsedData = Papa.parse(csvData, {
//         header: true,
//         dynamicTyping: true,
//         skipEmptyLines: true,
//       }).data;

//       const worker = new Worker(new URL('../../../workers/averageDataWorker.js', import.meta.url));
//       const chunkSize = 1000; // 청크 크기 설정
//       worker.postMessage({ data: parsedData, chunkSize });

//       worker.onmessage = (event) => {
//         const averagedData = event.data;
//         setGraphData(averagedData);
//         setIsGraphGenerated(true);
//         // 필요한 추가 처리 로직 추가
//       };
//     };
//     reader.readAsText(file);
//   };

//   return (
//     <div className={styles['graphDataWrap']}>
//       <div className={styles['graphDataContainer']}>
//         <div className={styles['leftPanel']}>
//           <h2 className={styles['headerTitle']}>Graph Data Visualization</h2>
//           <FileUploadButton className={styles['fileUploadButton']} onFileSelect={(file) => {handleFileSelect(file); processFile(file);}} />
//           <ThresholdOutlierEliminationLogic onResults={handleUploadSuccess} />
//           <div className={styles['graphGenerated']}>
//             <UploadDataButton className={styles['uploadDataButton']} selectedFile={uploadedFile} onUploadSuccess={handleUploadSuccess} isEnabled={!!uploadedFile} />
//             {isGraphGenerated && (
//               <>
//                 <SaveCsvDataButton
//                   data={{
//                     graphData: selectedRange.start !== 0 || selectedRange.end !== 0 ?
//                       graphData.slice(selectedRange.start, selectedRange.end + 1) :
//                       graphData,
//                     boxPlotData,
//                     numbering: details,
//                     userInput
//                   }}
//                   fileName={uploadedFileName}
//                   onSaveSuccess={handleSaveDataSuccess}
//                   selectedRange={selectedRange}
//                   startTime={startTime}
//                   endTime={endTime}
//                 />
//                 <LineGraph
//                   averagedData={graphData}
//                   countNumber={details.countNumber}
//                   wNumber={details.wNumber}
//                   dwNumber={details.dwNumber}
//                   dieNumber={details.dieNumber}
//                   onDetailsChange={(key, value) => setDetails({ ...details, [key]: value })}
//                   onBrushChange={handleBrushChange}
//                   initialStartTime={initialStartTime}
//                   initialEndTime={initialEndTime}
//                   setBoxplotStats={setBoxPlotData}
//                 />
//                 <BoxGraph
//                   initialStartTime={initialStartTime}
//                   initialEndTime={initialEndTime}
//                   averagedData={graphData}
//                   boxplotStats={boxPlotData}
//                   selectedRange={selectedRange}
//                   onBrushChange={handleBrushChange}
//                 />
//               </>
//             )}
//           </div>
//         </div>
//         <div className={styles['rightPanel']}>
//           <DataListUI />
//           {isGraphGenerated && (
//             <TextInputBox
//               value={userInput}
//               onTextChange={setUserInput}
//               showSaveButton={false}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// });

// export default GraphDataPage;

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
// // src/hooks/useLineGraphData.js

// import { useState, useEffect, useCallback } from 'react';
// import { sendFilteredData } from '../../../../api';

// export const useLineGraphData = (averagedData, initialStartTime, initialEndTime, onBrushChange, setBoxplotStats) => {
//     const [startTime, setStartTime] = useState(initialStartTime || '');
//     const [endTime, setEndTime] = useState(initialEndTime || '');

//     useEffect(() => {
//         setStartTime(initialStartTime);
//         setEndTime(initialEndTime);
//     }, [initialStartTime, initialEndTime]);

//     const handleBrushChange = useCallback(async (e) => {
//         if (!e) {
//             // 데이터 전체 범위 사용 시, 초기 지정된 시간 범위를 유지
//             setStartTime(initialStartTime);
//             setEndTime(initialEndTime);
//             onBrushChange(0, averagedData.length - 1);
//             return;
//         }

//         const { startIndex, endIndex } = e;
//         onBrushChange(startIndex, endIndex);

//         const newStartTime = averagedData[startIndex]?.time;
//         const newEndTime = averagedData[endIndex]?.time;
//         if (newStartTime && newEndTime) {
//             // 사용자가 선택한 시간 범위를 상태에 저장
//             setStartTime(newStartTime);
//             setEndTime(newEndTime);

//             const filteredData = averagedData.slice(startIndex, endIndex + 1);
//             if (filteredData.length > 0) {
//                 try {
//                     const response = await sendFilteredData(filteredData);
//                     setBoxplotStats(response.boxplotStats); // 백엔드로부터 받은 데이터 상태 업데이트
//                 } catch (error) {
//                     console.error('Error fetching filtered data:', error);
//                 }
//             }
//         }
//     }, [averagedData, onBrushChange, setBoxplotStats, initialStartTime, initialEndTime]);

//     return { startTime, endTime, handleBrushChange };
// };
// ```
// ```
// // client/src/components/tempgraph/tempgraphmodule/BoxGraph.js

// import React from 'react';
// import CustomApexChart from './CustomApexChart'; // 차트 컴포넌트
// import StatisticsTable from './StatisticsTable'; // 통계 테이블 컴포넌트
// import styles from './BoxGraph.module.css';

// const BoxGraph = ({ boxplotStats }) => {

//   if (!boxplotStats || typeof boxplotStats.min === 'undefined' || typeof boxplotStats.q1 === 'undefined' || typeof boxplotStats.median === 'undefined' || typeof boxplotStats.q3 === 'undefined' || typeof boxplotStats.max === 'undefined') {
//     return <div>No data available</div>;
//   }

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
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isHandleSaveCsvChecked, setIsHandleSaveCsvChecked] = useState(true);
//   const csvSaveModeText = isHandleSaveCsvChecked ? "개별" : "복수";
//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadDataList = async () => {
//       try {
//         const response = await fetchDataList();
//         setDataList(response || []);
//       } catch (error) {
//         console.error("데이터 로딩 중 오류 발생:", error);
//         alert('데이터를 로드하는데 실패했습니다.');
//       }
//     };
//     loadDataList();
//   }, []);

//   const filteredDataList = searchTerm
//     ? dataList.filter(dataItem =>
//         `${dataItem.filedate}-${dataItem.numbering.countNumber}_${dataItem.numbering.wNumber}_${dataItem.numbering.dwNumber}_${dataItem.numbering.dieNumber}`
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase())
//       )
//     : dataList;

//   const handleCheckboxChange = useCallback((itemId) => {
//     setSelectedItems(prev => prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]);
//   }, []);

//   const handleLoadSelectedData = useCallback(() => {
//     navigate('/view-data', { state: { selectedItems } });
//     setSelectedItems([]);
//   }, [navigate, selectedItems]);

//   const handleRemoveSelectedData = async () => {
//     try {
//       await Promise.all(selectedItems.map(itemId => deleteData(itemId)));
//       setDataList(prev => prev.filter(item => !selectedItems.includes(item._id)));
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
//         <List className={`${styles['scroll']} ${styles['scroll-css']}`}
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
// // client/src/components/tempgraph/tempgraphmodule/CustomApexChart.js

// import React from 'react';
// import ReactApexChart from 'react-apexcharts';

// const CustomApexChart = ({ options, series }) => {
// return <ReactApexChart options={options} series={series} type="boxPlot" width={320} height={320} />;
// };

// export default CustomApexChart;
// ```
// ```
// // client/src/components/tempgraph/tempgraphmodule/FileUploadButton.js

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
// // client/src/components/tempgraph/tempgraphmodule/DataUploadComponent.js

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
// // client/src/components/tempgraph/tempgraphmodule/Loader.js

// import React from 'react';
// import styles from './Loader.module.css'

// function Loader() {
//   return <div className={styles['loader']}></div>;
// }

// export default Loader;

// ```
// ```
// // client\src\components\tempgraph\tempgraphmodule\LineGraph.js

// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import Plotly from 'plotly.js-dist-min';
// import { useLineGraphData } from './hooks/useLineGraphData';
// import { calculateMedian } from '../../../api';
// import styles from './LineGraph.module.css';

// const LineGraph = React.memo(({
//   averagedData,
//   onDetailsChange,
//   countNumber,
//   dieNumber,
//   wNumber,
//   dwNumber,
//   initialStartTime,
//   initialEndTime,
//   setBoxplotStats
// }) => {
//   const { startTime, endTime } = useLineGraphData(averagedData, initialStartTime, initialEndTime, setBoxplotStats);
//   const [chartSize, setChartSize] = useState({ width: 600 });
//   const [medianValue, setMedianValue] = useState(0);
//   const plotRef = useRef(null);

//   useEffect(() => {
//     const handleResize = () => {
//       const maxWidth = 1145;
//       const calculatedWidth = window.innerWidth <= maxWidth ? window.innerWidth * 0.9 : Math.min(window.innerWidth * 0.6, 950);

//       setChartSize({
//         width: Math.min(calculatedWidth, 950)
//       });
//     };

//     window.addEventListener('resize', handleResize);
//     handleResize();

//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const fetchMedian = useCallback(async (averagedData) => {
//     const temperatures = averagedData.map(item => item.temperature);
//     try {
//       const median = await calculateMedian(temperatures);
//       setMedianValue(median.median);
//     } catch (error) {
//       console.error('Error calculating median:', error);
//     }
//   }, []);

//   useEffect(() => {
//     if (averagedData.length > 0) {
//       fetchMedian(averagedData);
//     }
//   }, [averagedData, fetchMedian]);

//   useEffect(() => {
//     if (averagedData.length > 0) {
//       const times = averagedData.map(item => item.time);
//       const temperatures = averagedData.map(item => item.temperature);

//       const data = [
//         {
//           x: times,
//           y: temperatures,
//           type: 'scatter',
//           mode: 'lines',
//           name: 'Temperature',
//         },
//         {
//           x: times,
//           y: Array(times.length).fill(medianValue),
//           type: 'scatter',
//           mode: 'lines',
//           name: 'Median',
//           line: { dash: 'dash', color: 'red' },
//         },
//       ];

//       const layout = {
//         title: 'Temperature Over Time',
//         xaxis: {
//           title: 'Time',
//         },
//         yaxis: {
//           title: 'Temperature (°C)',
//         },
//         width: chartSize.width,
//         height: '100%',
//         showlegend: false,
//         paper_bgcolor: '#e2d1c7', // 전체 차트 배경색
//         plot_bgcolor: '#e2d1c7', // 플롯 영역 배경색
//         margin: {
//           l: 60,
//           r: 20,
//           t: 40,
//           b: 80
//         },
//         shapes: [
//           {
//             type: 'rect',
//             xref: 'x',
//             yref: 'paper',
//             x0: startTime,
//             x1: endTime,
//             y0: 0,
//             y1: 1,
//             fillcolor: '#d3d3d3',
//             opacity: 0.5,
//             line: {
//               width: 0,
//             },
//           },
//         ],
//       };

//       Plotly.newPlot(plotRef.current, data, layout);
//     } 
//   }, [averagedData, medianValue, startTime, endTime, chartSize]);

//   return (
//     <div className={styles['lineGrahpWrap']}>
//       <div className={styles['textWrap']}>
//         <div className={styles['textContainer']}>
//           <div className={styles['NumberWrap']}>
//             <div className={styles['ExWrap']}>
//               <span className={styles['ExNumber']}>C_Number</span>
//               <input
//                 pattern='\d+'
//                 type="text"
//                 placeholder="0000"
//                 className={styles['ExInfo']}
//                 value={countNumber || ''}
//                 onChange={(e) => onDetailsChange('countNumber', e.target.value)}
//               />
//             </div>
//             <div className={styles['ExWrap']}>
//               <span className={styles['ExNumber']}>W_Number</span>
//               <input
//                 pattern='\d+'
//                 type="text"
//                 placeholder="0000"
//                 className={styles['ExInfo']}
//                 value={wNumber || ''}
//                 onChange={(e) => onDetailsChange('wNumber', e.target.value)}
//               />
//             </div>
//             <div className={styles['ExWrap']}>
//               <span className={styles['ExNumber']}>DW_Number</span>
//               <input
//                 pattern='\d+'
//                 type="text"
//                 placeholder="0000"
//                 className={styles['ExInfo']}
//                 value={dwNumber || ''}
//                 onChange={(e) => onDetailsChange('dwNumber', e.target.value)}
//               />
//             </div>
//             <div className={styles['ExWrap']}>
//               <span className={styles['ExNumber']}>Die_Number</span>
//               <input
//                 pattern='\d+'
//                 type="text"
//                 placeholder="0000"
//                 className={styles['ExInfo']}
//                 value={dieNumber || ''}
//                 onChange={(e) => onDetailsChange('dieNumber', e.target.value)}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className={styles['timeInputWrap']}>
//         <div className={styles['timeInputContainer']}>
//           <div className={styles['startTimeBox']}>
//             <span className={styles['startTimeTitle']}>Start Time</span>
//             <input
//               className={styles['startTimeInput']}
//               type="time"
//               value={startTime || ''}
//               readOnly
//             />
//           </div>
//           <div className={styles['endTimeBox']}>
//             <span className={styles['endTimeTitle']}>End Time</span>
//             <input
//               className={styles['endTimeInput']}
//               type="time"
//               value={endTime || ''}
//               readOnly
//             />
//           </div>
//         </div>
//       </div>
//       <div ref={plotRef} className={styles['plotly-chart']}></div>
//     </div>
//   );
// });

// export default LineGraph;

// ```
// ```
// // client/src/components/tempgraph/tempgraphmodule/StatisticsTable.js

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
// // client\src\components\tempgraph\tempgraphmodule\SaveCsvDataButton.js

// import React from 'react';
// import styles from './SaveCsvDataButton.module.css'
// import { saveData } from '../../../api';

// function SaveCsvDataButton({ data, fileName, onSaveSuccess, startTime, endTime }) {
//   const downloadCsv = (data, fileName) => {
//     const { countNumber = 'N/A', wNumber = 'N/A', dwNumber = 'N/A', dieNumber = 'N/A' } = data.numbering || {};
//     const graphData = data.graphData;

//     const dateMatch = fileName.match(/\d{4}-\d{2}-\d{2}/);
//     const dateFromFileName = dateMatch ? dateMatch[0] : new Date().toISOString().split('T')[0];

//     const finalFileName = `${dateFromFileName}-${countNumber}_${wNumber}_${dwNumber}_${dieNumber}.csv`;

//     let csvContent = "date,time,temperature\n";
//     graphData.forEach(row => {
//       const { date, time, temperature } = row;
//       csvContent += `${date},${time},${temperature}\n`;
//     });

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     if (navigator.msSaveBlob) {
//       // For Internet Explorer and Edge
//       navigator.msSaveBlob(blob, finalFileName);
//     } else {
//       const link = document.createElement('a');
//       if (link.download !== undefined) {
//         const url = URL.createObjectURL(blob);
//         link.setAttribute('href', url);
//         link.setAttribute('download', finalFileName);
//         link.style.visibility = 'hidden';
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//         URL.revokeObjectURL(url);  // Object URL 해제
//       }
//     }
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
// // client\src\components\tempgraph\tempgraphmodule\ThresholdOutlierEliminationlogic.js

// import React, { useState } from 'react';
// // import { Threshold, downloadFilteredData as downloadFilteredDataAPI } from '../../../api';
// import { Threshold, downloadFilteredData as downloadFilteredDataAPI, API_BASE_URL } from '../../../api';

// const ThresholdOutlierEliminationLogic = () => {
//   const [files, setFiles] = useState([]);
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadSuccess, setUploadSuccess] = useState(false);
//   const [uploadId, setUploadId] = useState('');

//   const handleFileChange = (e) => {
//     setFiles([...e.target.files]);
//     setIsUploading(false);
//     setUploadSuccess(false);
//     setUploadId('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (files.length === 0) return;

//     setIsUploading(true);
//     try {
//       const result = await Threshold(files);
//       if (result.uploadId) {
//         setUploadId(result.uploadId);
//         setUploadSuccess(true);
//       } else {
//         console.error('Upload was successful, but no upload ID was returned.');
//         setUploadSuccess(false);
//       }
//     } catch (error) {
//       console.error('Error uploading files:', error);
//       setUploadSuccess(false);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const downloadFilteredData = async () => {
//     if (!uploadId) {
//       console.error('다운로드를 위한 업로드 ID가 없습니다.');
//       return;
//     }

//     try {
//       const url = `${API_BASE_URL}/download-filtered-data?uploadId=${encodeURIComponent(uploadId)}`;
//       const response = await fetch(url);

//       // 성공적인 응답인지 확인
//       if (!response.ok) {
//         throw new Error(`서버에서 오류 응답: ${response.status}`);
//       }

//       // response.blob()을 호출하기 전에 response가 유효한지 확인
//       if (response) {
//         const blob = await response.blob();
//         const downloadUrl = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = downloadUrl;
//         a.download = 'filtered_data.zip'; // 다운로드 받을 파일명
//         document.body.appendChild(a);
//         a.click();
//         document.body.removeChild(a);
//         window.URL.revokeObjectURL(downloadUrl);
//       } else {
//         throw new Error('응답이 유효하지 않습니다.');
//       }
//     } catch (error) {
//       console.error('필터링된 데이터를 다운로드하는데 실패했습니다:', error);
//     }
//   };


//   return (
//     <div>
//       <form onSubmit={handleSubmit}>
//         <input type="file" multiple onChange={handleFileChange} />
//         <button type="submit" disabled={isUploading}>Upload</button>
//       </form>
//       {isUploading && <p>Uploading and processing...</p>}
//       {uploadSuccess && (
//         <>
//           <p>업로드 및 처리가 완료되었습니다! 이제 필터링된 데이터를 다운로드할 수 있습니다.</p>
//           <button onClick={downloadFilteredData} disabled={!uploadSuccess || !uploadId}>
//             Download Filtered Data as CSV
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// export default ThresholdOutlierEliminationLogic;

// ```
// ```
// // client/src/components/tempgraph/tempgraphmodule/TextInputBox.js

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
// // client/src/components/Banner.js

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import styles from './Banner.module.css';
// import { faSignal, faMagnifyingGlassChart, faChartLine } from '@fortawesome/free-solid-svg-icons';
// import { faGithub } from '@fortawesome/free-brands-svg-icons';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// function Banner({ isOpen, setIsOpen }) {
//     let navigate = useNavigate();

//     const navigateTo = (path) => {
//         navigate(path);
//     };

//     const toggleSidebar = () => {
//         setIsOpen(!isOpen);
//     };

//     const getSpanClassName = (baseClass, positionClass) => {
//         let classes = [styles[baseClass], styles[positionClass]];
//         if (isOpen) classes.push(styles['menuSpanActive']);
//         return classes.join(' ');
//     };

//     return (
//         <div className={styles.bannerWrap}>
//             <div className={styles.bannerHeader}>
//                 <div className={styles.bannercheckbox}>
//                     <input type="checkbox" id="menuicon" className={styles.menuIcon} onChange={toggleSidebar} checked={isOpen} />
//                     <div className={styles['bannerlogoWrap']}>
//                         <label htmlFor="menuicon" className={styles.menuLabel}>
//                             <span className={getSpanClassName('menuSpan', 'menuSpanFirst')}></span>
//                             <span className={`${getSpanClassName('menuSpan', 'menuSpanMiddle')} ${isOpen ? styles.hidden : ''}`}></span>
//                             <span className={getSpanClassName('menuSpan', 'menuSpanLast')}></span>
//                         </label>
//                     </div>
//                 </div>
//                 <a href="http://www.aldmc.co.kr/kor/main/main.html" className={styles['banner-logo']} style={{ cursor: 'pointer' }} aria-label="aldmc" target='_blank' rel="noreferrer noopener">
//                     {isOpen && <img src="./images/logo.png" alt="logo" />}
//                 </a>
//             </div>
//             <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
//                 <div className={styles['bannerContainer']}>
//                     <div className={styles['banner']}>
//                         <ul className={styles['banner-menu']}>
//                             <li className={styles['banner-title']} onClick={() => navigateTo('/graph-data')} style={{ cursor: 'pointer' }}>
//                                 <div className={styles['icon-img']} style={{ color: 'orange' }}>
//                                     <FontAwesomeIcon icon={faSignal} />
//                                 </div>
//                                 {isOpen ? <div className={styles['banner-title-name']}>T.Graph</div> : null}
//                             </li>
//                             <li className={styles['banner-title']} onClick={() => navigateTo('/line-bar')} style={{ cursor: 'pointer' }}>
//                                 <div className={styles['icon-img']}>
//                                     <FontAwesomeIcon icon={faChartLine} />
//                                 </div>
//                                 {isOpen ? <div className={styles['banner-title-name']}>Line/Bar</div> : null}
//                             </li>
//                             <li className={styles['banner-title']} onClick={() => navigateTo('/Analysis-page')} style={{ cursor: 'pointer' }}>
//                                 <div className={styles['icon-img']}>
//                                     <FontAwesomeIcon icon={faMagnifyingGlassChart} />
//                                 </div>
//                                 {isOpen ? <div className={styles['banner-title-name']}>Analysis</div> : null}
//                             </li>
//                             <li className={styles['banner-title']} onClick={() => navigateTo('/graph-data')} style={{ cursor: 'pointer' }}>
//                                 <div className={styles['icon-img']}>
//                                     <FontAwesomeIcon icon={faMagnifyingGlassChart} />
//                                 </div>
//                                 {isOpen ? <div className={styles['banner-title-name']}>준비중...</div> : null}
//                             </li>
//                             <li className={styles['banner-title']} style={{ cursor: 'pointer' }}>
//                                 <a className={styles['icon-img']} href='https://github.com/zzocojoa/temp_info_ver2' aria-label="GitHub" target='_blank' rel="noreferrer noopener">
//                                     <FontAwesomeIcon icon={faGithub} />
//                                 </a>
//                             </li>
//                         </ul>
//                         <ul className={styles['banner-icons']}>

//                             <li onClick={() => navigateTo('/Card')} style={{ cursor: 'pointer' }}>
//                                 <img className={styles['developer-icon']} src="./images/hoihou-icon-1.png" alt="hoihou-icon-1" />
//                             </li>
//                         </ul>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Banner;

// ```
// ```
// // client/src/components/tempgraph/tempgraphmodule/UploadDataButton.js

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

//     setIsLoading(true);

//     try {
//       // API를 호출하여 파일 업로드
//       const response = await uploadFile(selectedFile);
//       setIsLoading(false); // 업로드 성공 또는 실패 시 로딩 상태를 false로 설정
//       if (response) {
//         const { averagedData, boxplotStats } = response;
//         const startTime = averagedData[0]?.time || '';
//         const endTime = averagedData[averagedData.length - 1]?.time || '';
//         onUploadSuccess(averagedData, boxplotStats, selectedFile.name, startTime, endTime);
//       } else {
//         alert('Failed to upload file.');
//       }
//     } catch (error) {
//       setIsLoading(false);
//       console.error('Error uploading file:', error);
//       alert('Error uploading file.');
//     }
//   };

//   return (
//     <>
//       {isLoading ? (
//         <Loader />
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
// /* eslint-disable no-restricted-globals */
// /* eslint-disable no-undef */

// // client/src/workers/averageDataWorker.js
// self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js');

// self.onmessage = function(event) {
//     const { data, chunkSize } = event.data;

//     let groupedData = new Map();

//     const processChunk = (chunk) => {
//         chunk.forEach(item => {
//             const roundedTime = moment(item.time, 'HH:mm:ss').startOf('minute').seconds(
//                 moment(item.time, 'HH:mm:ss').seconds()
//             ).format('HH:mm:ss');

//             // const roundedSeconds = Math.floor(moment(item.time, 'HH:mm:ss').seconds() / 15) * 15;
//             // const roundedTime = moment(item.time, 'HH:mm:ss').startOf('minute').seconds(roundedSeconds).format('HH:mm:ss');

//             const dateTimeKey = `${item.date} ${roundedTime}`;
//             if (!groupedData.has(dateTimeKey)) {
//                 groupedData.set(dateTimeKey, { sum: 0, count: 0, date: item.date, time: roundedTime });
//             }
//             let entry = groupedData.get(dateTimeKey);
//             entry.sum += item.temperature;
//             entry.count += 1;
//         });
//     };

//     for (let i = 0; i < data.length; i += chunkSize) {
//         processChunk(data.slice(i, i + chunkSize));
//     }

//     const averagedData = Array.from(groupedData.values()).map(entry => ({
//         date: entry.date,
//         time: entry.time,
//         temperature: entry.sum / entry.count
//     }));

//     self.postMessage(averagedData);
// };

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
// // client\src\App.js

// import React, { useState } from 'react';
// import { HashRouter as Router, Routes, Route } from 'react-router-dom';
// import Banner from './components/Banner';
// import GraphDataPage from './components/tempgraph/pages/GraphDataPage';
// import ViewDataPage from './components/tempgraph/pages/ViewDataPage';
// import LineBarPage from './components/line_box/pages/LineBarPage';
// import AnalysisPage from './components/clustercomponents/pages/analysisPage';
// import ClusteredDataVisualization from './components/clustercomponents/ClusteredData';
// import DieTemperatureProfileChart from './components/clustercomponents/DieTempProfile';
// import Card from './components/3D/Card';
// import Footer from './components/Footer';
// import styles from './App.css';

// function App() {
//   // const profileImage = process.env.PUBLIC_URL + "/images/jeonghyeon-1.jpg";
//   const profileImage = "./images/jeonghyeon-1.jpg";
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   return (
//     <Router>
//       <div className={styles['root-display']}>
//         <Banner isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
//         <div style={{ marginLeft: isSidebarOpen ? '200px' : '60px', transition: 'margin-left 0.3s ease' }}>
//       <Routes>
//         {/* <Route path="/"  /> */}
//         <Route path="/" element={<GraphDataPage />} />
//         <Route path="/graph-data" element={<GraphDataPage />} />
//         <Route path="/view-data" element={<ViewDataPage />} />
//         <Route path="/line-bar" element={<LineBarPage />} />
//         <Route path="/Analysis-page" element={<AnalysisPage />} />
//         <Route path="/cluster-data" element={<ClusteredDataVisualization />} />
//         <Route path="/dietemp-data" element={<DieTemperatureProfileChart />} />
//         <Route path="/card" element={<Card selectedImage={profileImage} />} />
//       </Routes>
//       </div>
//       </div>
//       <Footer />
//     </Router>
//   );
// }

// export default App;

// ```
// ```
// // client/src/api.js

// // const API_BASE_URL = 'http://localhost:5000/api';
// export const API_BASE_URL = 'http://localhost:5000/api';

// function createFetchRequest(method, body = null) {
//   const headers = new Headers();
//   headers.append('Content-Type', 'application/json');
//   headers.append('Cache-Control', 'no-cache');

//   const requestInit = {
//     method,
//     headers,
//     body: body ? JSON.stringify(body) : null,
//     cache: 'no-cache',
//   };

//   return requestInit;
// }

// // 파일 업로드 API
// export async function uploadFile(file) {
//   const formData = new FormData();
//   formData.append('file', file);

//   try {
//     const response = await fetch(`${API_BASE_URL}/upload`, {
//       method: 'POST',
//       body: formData,
//       cache: 'no-cache',
//     });
//     if (!response.ok) {
//       throw new Error('Server responded with an error');
//     }
//     const { data: averagedData, boxplotStats, temperatureValues } = await response.json();
//     console.log("boxplotStats: ", boxplotStats);
//     return { averagedData, boxplotStats, temperatureValues };
//   } catch (error) {
//     console.error('Error uploading file:', error);
//     throw error;
//   }
// }

// // 정제 파일 업로드 API (CSV 파일)
// export async function uploadCsvFile(files) {
//   const formData = new FormData();
//   // formData.append('file', file);
//   for (let i = 0; i < files.length; i++) {
//     formData.append('files', files[i]);
//   }

//   try {
//     const response = await fetch(`${API_BASE_URL}/upload-csv`, {
//       method: 'POST',
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }

//     const data = await response.json();
//     return data; // 성공적으로 업로드된 경우 서버 응답 반환
//   } catch (error) {
//     console.error('Error uploading CSV file:', error);
//     throw error; // 컴포넌트에서 처리할 수 있게 에러를 다시 던짐
//   }
// }

// // 이상치 필터링 및 중앙값 계산을 위한 API 함수
// export async function Threshold(files) {
//   const formData = new FormData();
//   for (let i = 0; i < files.length; i++) {
//     formData.append('files', files[i]);
//   }

//   try {
//     const response = await fetch(`${API_BASE_URL}/threshold-upload`, {
//       method: 'POST',
//       body: formData,
//       cache: 'no-cache',
//     });
//     if (!response.ok) {
//       throw new Error('Server responded with an error');
//     }
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error('Error in Threshold:', error);
//     throw error;
//   }
// }

// // 이상치 필터링 다운로드를 위한 API 함수
// export async function downloadFilteredData(uploadId) {
//   if (!uploadId) {
//     throw new Error('다운로드를 위한 업로드 ID가 제공되지 않았습니다.');
//   }

//   // 파일 다운로드를 위한 엔드포인트 URL 생성
//   const url = `${API_BASE_URL}/download-filtered-data?uploadId=${encodeURIComponent(uploadId)}`;

//   try {
//     const response = await fetch(url);
//     if (!response.ok) {
//       throw new Error(`서버에서 오류 응답: ${response.status}`);
//     }

//     // 서버로부터 받은 ZIP 파일을 Blob으로 변환
//     const blob = await response.blob();
//     // Blob 객체를 이용해 다운로드 URL 생성
//     const downloadUrl = window.URL.createObjectURL(blob);
//     // 생성된 URL로 다운로드 링크 생성
//     const a = document.createElement('a');
//     a.href = downloadUrl;
//     a.download = 'filtered_data.zip'; // ZIP 파일명 설정
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     window.URL.revokeObjectURL(downloadUrl);
//   } catch (error) {
//     console.error('Error downloading filtered data:', error);
//     throw error;
//   }
// }

// // filteredData를 서버로 전송하는 함수(bolplot dynamic data)
// export async function sendFilteredData(filteredData) {
//   const requestInit = createFetchRequest('POST', { filteredData });

//   try {
//     const response = await fetch(`${API_BASE_URL}/process-filtered-data`, requestInit);
//     if (!response.ok) {
//       throw new Error('Failed to send filtered data');
//     }
//     return await response.json(); // 서버 응답 반환
//   } catch (error) {
//     console.error('Error sending filtered data:', error);
//     throw error; // 컴포넌트에서 처리할 수 있게 에러를 다시 던짐
//   }
// }

// // 데이터 저장 API
// export async function saveData(data) {
//   const requestInit = createFetchRequest('POST', data);
//   try {
//     const response = await fetch(`${API_BASE_URL}/save`, requestInit);
//     if (!response.ok) {
//       throw new Error('Failed to save data');
//     }
//     return await response.json();
//   } catch (error) {
//     console.error('Error saving data:', error);
//     throw error;
//   }
// }

// export async function updateData(id, updatedData) {
//   const requestInit = createFetchRequest('PATCH', updatedData);
//   try {
//     const response = await fetch(`${API_BASE_URL}/data/${id}`, requestInit);
//     if (!response.ok) {
//       throw new Error('Data update failed');
//     }
//     return await response.json();
//   } catch (error) {
//     console.error('Error updating data:', error);
//     throw error;
//   }
// }

// // 데이터 리스트 조회
// export async function fetchDataList() {
//   const requestInit = createFetchRequest('GET');
//   try {
//     const response = await fetch(`${API_BASE_URL}/data-list`, requestInit);
//     if (!response.ok) {
//       throw new Error('Failed to fetch data list');
//     }
//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching data list:', error);
//     throw error;
//   }
// }

// // 특정 데이터 조회
// export async function fetchDataDetails(dataId) {
//   const requestInit = createFetchRequest('GET');
//   try {
//     const response = await fetch(`${API_BASE_URL}/data/${dataId}`, requestInit);
//     if (!response.ok) {
//       throw new Error('Failed to fetch data details');
//     }
//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching data details:', error);
//     throw error;
//   }
// }

// // 데이터 삭제
// export async function deleteData(dataId) {
//   const response = await fetch(`${API_BASE_URL}/data/${dataId}`, {
//     method: 'DELETE',
//   });
//   if (!response.ok) {
//     throw new Error('Network response was not ok');
//   }
//   return await response.json();
// }

// // 중앙값 계산 API 함수
// export async function calculateMedian(data) {
//   const requestInit = createFetchRequest('POST', { data });
//   try {
//     const response = await fetch(`${API_BASE_URL}/calculate-median`, requestInit);
//     if (!response.ok) {
//       throw new Error('Failed to calculate median');
//     }
//     return await response.json();
//   } catch (error) {
//     console.error('Error calculating median:', error);
//     throw error;
//   }
// }

// // 필터링된 데이터 처리 및 중앙값 계산 API 함수
// export async function sendFilteredLinegraphData(data, startTime, endTime) {
//   const requestInit = createFetchRequest('POST', { data, startTime, endTime });
//   try {
//     const response = await fetch(`${API_BASE_URL}/filtered-linegraph-data`, requestInit);
//     if (!response.ok) {
//       throw new Error('Failed to process filtered data');
//     }
//     return await response.json();
//   } catch (error) {
//     console.error('Error sending filtered data:', error);
//     throw error;
//   }
// }

// // 클러스터링된 데이터를 가져오는 API 함수
// export async function fetchClusteredData(dwNumber, k) {
//   const requestInit = createFetchRequest('POST', { dwNumber, k });
//   try {
//     const response = await fetch(`${API_BASE_URL}/clustered-data`, requestInit);
//     if (!response.ok) {
//       throw new Error('Failed to fetch clustered data');
//     }
//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching clustered data:', error);
//     throw error;
//   }
// }

// // DW 번호 검색 API 함수
// export async function searchDwNumber(query) {
//   try {
//     const response = await fetch(`${API_BASE_URL}/search-dw?q=${encodeURIComponent(query)}`);
//     if (!response.ok) {
//       throw new Error('Failed to fetch DW number suggestions');
//     }
//     return await response.json();
//   } catch (error) {
//     console.error('Error searching DW numbers:', error);
//     throw error;
//   }
// }

// // 다이별 온도 프로필 데이터 제공
// export async function fetchDieTemperatureProfile() {
//   try {
//     const response = await fetch(`${API_BASE_URL}/die-temperature-profile`);
//     if (!response.ok) {
//       throw new Error('Failed to fetch die temperature profile');
//     }
//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching die temperature profile:', error);
//     throw error;
//   }
// }

// ```
// ```
// // client\src\index.js

// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';
// import './index.css';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// ```