// ```
// // client/src/components/DataListUI.js

// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { fetchDataList, deleteData, fetchDataDetails } from '../api';
// import styles from './DataListUI.module.css';

// function DataListUI() {
//   const [dataList, setDataList] = useState([]);
//   const [filteredDataList, setFilteredDataList] = useState([]);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [displayCount, setDisplayCount] = useState(10);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isHandleSaveCsvChecked, setIsHandleSaveCsvChecked] = useState(true);
//   const csvSaveModeText = isHandleSaveCsvChecked ? "개별" : "복수";
//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadDataList = async () => {
//       const response = await fetchDataList();
//       if (response && Array.isArray(response)) { // 응답 확인 및 배열인지 확인
//         setDataList(response);
//         setFilteredDataList(response); // 초기에는 모든 데이터를 보여줌
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
//     setDisplayCount(10); // 검색 후 보여줄 아이템 수를 초기화
//   }, [searchTerm, dataList]);

//   const handleCheckboxChange = (itemId) => {
//     setSelectedItems(prev => {
//       const newSelectedItems = prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId];
//       return newSelectedItems;
//     });
//   };

//   const handleScrollDown = () => {
//     setDisplayCount(prev => prev + 10);
//   };

//   const handleLoadSelectedData = () => {
//     navigate('/view-data', { state: { selectedItems } });
//   };

//   const handleRemoveSelectedData = async () => {
//     for (let itemId of selectedItems) {
//       try {
//         await deleteData(itemId);
//       } catch (error) {
//         console.error("Error removing data:", error);
//       }
//     }
//     const updatedDataList = dataList.filter(item => !selectedItems.includes(item._id));
//     setDataList(updatedDataList); // 전체 리스트 업데이트
//     setFilteredDataList(updatedDataList); // 필터링된 리스트도 동일하게 업데이트
//     setSelectedItems([]); // 선택된 항목 초기화
//   };

//   const handleSelectAllChange = (e) => {
//     if (e.target.checked) {
//       // 모든 데이터 항목의 ID를 selectedItems 배열에 추가
//       setSelectedItems(filteredDataList.map(item => item._id));
//     } else {
//       // selectedItems 배열을 비움
//       setSelectedItems([]);
//     }
//   };

//   // DB CSV data save
//   const handleSaveCsv = async () => {
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
//       const csvHeader = 'filedate,countNumber,wNumber,dwNumber,dieNumber,median, startTime, endTime\n';

//       // 각 항목을 CSV 형식의 문자열로 변환
//       const csvRows = selectedDataDetails.map(item => {
//         const { filedate, numbering: { countNumber, wNumber, dwNumber, dieNumber }, boxplotStats: { median }, startTime, endTime } = item;
//         return `"${filedate}","${countNumber}","${wNumber}","${dwNumber}","${dieNumber}","${median}","${startTime}","${endTime}"`;
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
//   };

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
//       <div className={styles['selectAllCheckbox']}>
//         <div className={styles['selectAllLabel']}>
//           <input
//             type="checkbox"
//             checked={selectedItems.length === filteredDataList.length && filteredDataList.length > 0}
//             onChange={handleSelectAllChange}
//           />전체 선택
//         </div>
//         <div className={styles['selectAllLabel']}>
//           <input
//             type="checkbox"
//             checked={isHandleSaveCsvChecked}
//             onChange={e => setIsHandleSaveCsvChecked(e.target.checked)}
//           />
//           <label>{`저장 유형 선택: ${csvSaveModeText}`}</label>
//         </div>
//       </div>
//       <div className={`${styles['DataListContainer']} ${styles['scroll']} ${styles['scroll-css']}`}>
//         {filteredDataList.slice(0, displayCount).map((dataItem, index) => (
//           <div key={index} className={styles['dataItem']}>
//             <label htmlFor={`checkbox-${dataItem._id}`} className={styles['dataItemLabel']}>
//               <input
//                 type="checkbox"
//                 id={`checkbox-${dataItem._id}`}
//                 checked={selectedItems.includes(dataItem._id)}
//                 onChange={() => handleCheckboxChange(dataItem._id)}
//               />
//               {`${dataItem.filedate}-${dataItem.numbering?.countNumber ?? 'N/A'}_${dataItem.numbering?.wNumber ?? 'N/A'}_${dataItem.numbering?.dwNumber ?? 'N/A'}_${dataItem.numbering?.dieNumber ?? 'N/A'}`}
//             </label>
//           </div>
//         ))}
//       </div>
//       <div className={styles['buttonWrap']}>
//         <div className={styles['buttonContainer']}>
//           {displayCount < dataList.length && (
//             <button onClick={handleScrollDown} className={styles['loadMoreButton']}>더 보기</button>
//           )}
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
// // src\components\BoxGraph.js

// import React, { useState, useEffect, useMemo } from 'react';
// import ReactApexChart from 'react-apexcharts';
// import { sendFilteredData } from '../api';
// import styles from './BoxGraph.module.css';

// function BoxGraph({ boxplotStats, selectedRange, averagedData, initialStartTime, initialEndTime }) {
//   const [currentBoxplotStats, setCurrentBoxplotStats] = useState({
//     ...boxplotStats,
//     min: boxplotStats?.min || 0,
//     q1: boxplotStats?.q1 || 0,
//     median: boxplotStats?.median || 0,
//     q3: boxplotStats?.q3 || 0,
//     max: boxplotStats?.max || 0,
//     outliers: boxplotStats?.outliers || []
//   });
//   const [startTime, setStartTime] = useState(initialStartTime || '');
//   const [endTime, setEndTime] = useState(initialEndTime || '');

//   useEffect(() => {
//     setCurrentBoxplotStats(boxplotStats || {
//       min: 0,
//       q1: 0,
//       median: 0,
//       q3: 0,
//       max: 0,
//       outliers: []
//     });
//   }, [boxplotStats]);

//   useEffect(() => {
//     if (!selectedRange || (selectedRange.start === 0 && selectedRange.end === 0)) {
//       setStartTime(initialStartTime);
//       setEndTime(initialEndTime);
//     } else if (averagedData && averagedData.length > 0) {
//       const filteredData = averagedData.slice(selectedRange.start, selectedRange.end + 1);
//       setStartTime(filteredData[0]?.time || initialStartTime);
//       setEndTime(filteredData[filteredData.length - 1]?.time || initialEndTime);

//       sendFilteredData(filteredData)
//         .then(response => {
//           if (response && response.boxplotStats) {
//             setCurrentBoxplotStats(response.boxplotStats);
//           }
//         })
//         .catch(error => {
//           console.error('Failed to send filtered data:', error);
//         });
//     }
//   }, [initialStartTime, initialEndTime, averagedData, selectedRange]);

//   const options = {
//     chart: { type: 'boxPlot', height: 350 },
//     title: { text: 'Box Plot', align: 'left' },
//     xaxis: { categories: ['Box Plot'] },
//     yaxis: { labels: { formatter: (val) => val.toFixed(0) } },
//     plotOptions: {
//       boxPlot: { colors: { upper: '#5C4742', lower: '#A5978B' } }
//     }
//   };

//   const series = useMemo(() => [{
//     name: 'temperature',
//     type: 'boxPlot',
//     data: [{
//       x: 'Temperature',
//       y: [
//         currentBoxplotStats.min,
//         currentBoxplotStats.q1,
//         currentBoxplotStats.median,
//         currentBoxplotStats.q3,
//         currentBoxplotStats.max,
//         ...currentBoxplotStats.outliers
//       ]
//     }]
//   }], [currentBoxplotStats]);


//   const formatNumber = (num) => isNaN(parseFloat(num)) ? 'N/A' : parseFloat(num).toFixed(2);

//   return (
//     <div className={styles.graphDataWrap}>
//       <div className={styles.graphDataSVG}>
//         <ReactApexChart options={options} series={series} type="boxPlot" height={350} />
//       </div>
//       <div className={styles.graphDataTable}>
//         <table className={styles.table}>
//           <thead>
//             <tr><th className={styles.th}>최대값</th><td className={styles.td}>{formatNumber(currentBoxplotStats.max)}</td></tr>
//             <tr><th className={styles.th}>Q3 (75번째 백분위수)</th><td className={styles.td}>{formatNumber(currentBoxplotStats.q3)}</td></tr>
//             <tr><th className={styles.th}>중앙값</th><td className={styles.td}>{formatNumber(currentBoxplotStats.median)}</td></tr>
//             <tr><th className={styles.th}>Q1 (25번째 백분위수)</th><td className={styles.td}>{formatNumber(currentBoxplotStats.q1)}</td></tr>
//             <tr><th className={styles.th}>최소값</th><td className={styles.td}>{formatNumber(currentBoxplotStats.min)}</td></tr>
//           </thead>
//         </table>
//       </div>
//     </div>
//   );
// }

// export default BoxGraph;

// ```
// ```
// // client/src/components/Banner.js

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import styles from './Banner.module.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTemperatureHigh } from '@fortawesome/free-solid-svg-icons';
// import { faFacebookSquare, faInstagramSquare } from '@fortawesome/free-brands-svg-icons';


// function Banner() {
//     let navigate = useNavigate();
    
//     const main = () => {
//         navigate('/');
//     };

//     const goToGraphData = () => {
//         navigate('/graph-data');
//     };


//     return (
//         <div className={styles.banner}>
//             <div onClick={main} style={{ cursor: 'pointer' }}>
//                 <div className={styles['banner-logo']}>
//                     <img src={`${process.env.PUBLIC_URL}/images/logo.png`} alt="logo" />
//                 </div>
//             </div>

//             <ul className={styles['banner-menu']}>
//                 <li onClick={goToGraphData} style={{ cursor: 'pointer' }}>
//                     <FontAwesomeIcon icon={faTemperatureHigh} />
//                     온도 그래프
//                 </li>
//                 <li onClick={goToGraphData} style={{ cursor: 'pointer' }}>
//                     온도 그래프
//                 </li>
//                 <li onClick={goToGraphData} style={{ cursor: 'pointer' }}>
//                     온도 그래프
//                 </li>
//                 <li onClick={goToGraphData} style={{ cursor: 'pointer' }}>
//                     온도 그래프
//                 </li>
//             </ul>

//             <ul className={styles['banner-icons']}>
//                 <li><FontAwesomeIcon icon={faFacebookSquare} /></li>
//                 <li><FontAwesomeIcon icon={faInstagramSquare} /></li>
//             </ul>
//         </div>
//     );
// }

// export default Banner;

// ```
// ```
// // src\components\LineGraph.js

// import React, { useState, useEffect } from 'react';
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Tooltip, Brush, ReferenceLine,
// } from 'recharts';
// import { sendFilteredData } from '../api';
// import styles from './LineGraph.module.css'

// function LineGraph({
//   averagedData, onDetailsChange,
//   countNumber, dieNumber, wNumber, dwNumber,
//   onBrushChange, initialStartTime, initialEndTime, setBoxplotStats
// }) {
//   const [chartSize, setChartSize] = useState({ width: 600, height: 300 });
//   const [startTime, setStartTime] = useState(initialStartTime || '');
//   const [endTime, setEndTime] = useState(initialEndTime || '');

//   // 그래프 반응형 로직
//   useEffect(() => {
//     const handleResize = () => {
//       setChartSize({
//         // 최대 너비를 1000으로 제한
//         width: Math.min(window.innerWidth * 0.9, 1000),
//         height: 400
//       });
//     };

//     window.addEventListener('resize', handleResize);
//     handleResize(); // 컴포넌트 마운트 시에도 크기 조정

//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   useEffect(() => {
//     setStartTime(initialStartTime);
//     setEndTime(initialEndTime);
//   }, [initialStartTime, initialEndTime]);

//   const handleBrushChange = async (e) => {
//     if (!e) {
//       const startIndex = 0;
//       const endIndex = averagedData.length - 1;
//       onBrushChange(startIndex, endIndex);
//       return;
//     }

//     const { startIndex, endIndex } = e;
//     onBrushChange(startIndex, endIndex);

//     if (averagedData[startIndex]?.time && averagedData[endIndex]?.time) {
//       const newStartTime = averagedData[startIndex].time;
//       const newEndTime = averagedData[endIndex].time;

//       setStartTime(newStartTime);
//       setEndTime(newEndTime);

//       const filteredData = averagedData.slice(startIndex, endIndex + 1);

//       try {
//         const { boxplotStats } = await sendFilteredData(filteredData); // await 사용하여 비동기 처리
//         setBoxplotStats(boxplotStats); // 상태 업데이트
//       } catch (error) {
//         console.error('필터링된 데이터를 처리하는 중 오류 발생:', error);
//       }
//     } else {
//       console.log('선택된 데이터 범위에 유효한 Time 속성이 없습니다.');
//     }
//   };

//   const temperatureFormatter = (value) => `${value.toFixed(2)}°C`;

//   // 중앙값 계산 함수
//   const calculateMedian = (data) => {
//     const temps = data.map(item => item.temperature).sort((a, b) => a - b);
//     const mid = Math.floor(temps.length / 2);
//     return temps.length % 2 !== 0 ? temps[mid] : (temps[mid - 1] + temps[mid]) / 2;
//   };

//   const medianValue = calculateMedian(averagedData);

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
//           // label={{ value: '시간', position: 'insideBottomRight', offset: -20 }}
//           />
//           <YAxis domain={['auto', 'auto']}
//           // label={{ value: '온도', angle: -90, position: 'insideLeft' }}
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
// }

// export default LineGraph;

// ```
// ```
// // src/components/SaveCsvDataButton.js

// import React from 'react';
// import styles from './SaveCsvDataButton.module.css'
// import { saveData } from '../api';

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
// // client/src/components/Footer.js

// import React from 'react';
// // import { useNavigate } from 'react-router-dom';
// import styles from './Footer.module.css';

// const Footer = () => {
//   // let navigate = useNavigate();
    
//   //   const main = () => {
//   //       navigate('/');
//   //   };

//   //   const goToGraphData = () => {
//   //       navigate('/graph-data');
//   //   };

//   return (
//     <footer>
//       <div className={styles['footerText']}>Copyright © HOIHOU All Rights Reserved.</div>
//     </footer>
//   );
// };

// export default Footer;

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
// // src/pages/GraphDataPage.js

// import React, { useState, useEffect } from 'react';
// import FileUploadButton from '../components/FileUploadButton';
// import UploadDataButton from '../components/UploadDataButton';
// import SaveCsvDataButton from '../components/SaveCsvDataButton';
// import LineGraph from '../components/LineGraph';
// import BoxGraph from '../components/BoxGraph';
// import DataListUI from '../components/DataListUI';
// import TextInputBox from '../components/TextInputBox';
// import styles from './GraphData.module.css';

// function GraphDataPage() {
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

//   const handleFileSelect = (file) => {
//     setUploadedFile(file);
//     setGraphData([]);
//     setBoxPlotData(null);
//     setUserInput('');
//     setIsGraphGenerated(false);
//   };
//   const handleUploadSuccess = async (
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
//     console.log("uploadedFileName: ", uploadedFileName)
//   };

//   useEffect(() => {
//     // props로 받은 initialStartTime과 initialEndTime을 사용하여 초기 시간 설정
//     setStartTime(initialStartTime);
//     setEndTime(initialEndTime);
//   }, [initialStartTime, initialEndTime]);

//   const handleSaveDataSuccess = () => {
//     // alert('Data saved successfully!');
//     // setIsDataSaved(true);
//   };

//   const handleBrushChange = (startIndex, endIndex) => {
//     // 시간 UI 상태로 저장
//     const newStartTime = graphData[startIndex]?.time || '';
//     const newEndTime = graphData[endIndex]?.time || '';
//     setStartTime(newStartTime);
//     setEndTime(newEndTime);
//     // 선택된 데이터 범위를 상태로 저장
//     setSelectedRange({ start: startIndex, end: endIndex });
//   };

//   return (
//     <div className={styles['graphDataWrap']}>
//       <div className={styles['graphDataContainer']}>
//         <div className={styles['leftPanel']}>
//           <h2 className={styles['headerTitle']}>Graph Data Visualization</h2>
//           <FileUploadButton className={styles['fileUploadButton']} onFileSelect={handleFileSelect} />
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
//                   />
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
// }
// export default GraphDataPage;

// ```
// ```
// // src\components\UploadDataButton.js

// import React, { useState } from 'react';
// import styles from './UploadDataButton.module.css'
// import { uploadFile } from '../api';
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
// import React from 'react';
// import styles from './Loader.module.css'

// function Loader() {
//   return <div className={styles['loader']}></div>;
// }

// export default Loader;

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
// // server/config/db.js

// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     await mongoose.connect('mongodb://127.0.0.1:27017/temp_dataset', { useNewUrlParser: true, useUnifiedTopology: true });
//     console.log('MongoDB 연결됨');
//   } catch (err) {
//     console.error('MongoDB 연결 오류:', err);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;

// ```
// ```
// // client\src\api.js

// const API_BASE_URL = 'http://localhost:5000/api';

// // 파일 업로드 API
// export async function uploadFile(file) {
//   const formData = new FormData();
//   formData.append('file', file);
//   try {
//     const response = await fetch(`${API_BASE_URL}/upload`, {
//       method: 'POST',
//       body: formData,
//     });
//     const { data: averagedData, boxplotStats, temperatureValues } = await response.json();
//     console.log("boxplotStats: ", boxplotStats)
//     return { averagedData, boxplotStats, temperatureValues }; // 업로드 결과 반환
//   } catch (error) {
//     console.error('Error uploading file:', error);
//   }
// }

// // filteredData를 서버로 전송하는 함수(bolplot dynamic data)
// export async function sendFilteredData(filteredData) {
//   // console.log("filteredData: ", filteredData);

//   try {
//     const response = await fetch(`${API_BASE_URL}/process-filtered-data`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ filteredData }),
//     });
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
//   try {
//     const response = await fetch(`${API_BASE_URL}/save`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(data),
//     });
//     if (!response.ok) {
//       throw new Error('Failed to save data');
//     }
//     return await response.json(); // 저장 성공 결과 반환
//   } catch (error) {
//     console.error('Error saving data:', error);
//     throw error; // 에러를 다시 던져 컴포넌트에서 처리할 수 있게 함
//   }
// }

// export async function updateData(id, updatedData) {
//   try {
//     const response = await fetch(`${API_BASE_URL}/data/${id}`, {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(updatedData),
//     });
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
//   try {
//     const response = await fetch(`${API_BASE_URL}/data-list`);
//     if (response.ok) {
//       const dataList = await response.json();
//       return dataList;
//     } else {
//       console.error('Failed to fetch data list');
//     }
//   } catch (error) {
//     console.error('Error fetching data list:', error);
//   }
// }

// // 특정 데이터 조회
// export async function fetchDataDetails(dataId) {
//   try {
//     const response = await fetch(`${API_BASE_URL}/data/${dataId}`);
//     return response.json(); // 조회된 데이터의 상세 정보 반환
//   } catch (error) {
//     console.error('Error fetching data details:', error);
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

// ```
// ```
// // client\src\pages\ViewDataPage.js

// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import LineGraph from '../components/LineGraph';
// import BoxGraph from '../components/BoxGraph';
// import DataListUI from '../components/DataListUI';
// import TextInputBox from '../components/TextInputBox';
// import { fetchDataDetails, updateData } from '../api';
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
// // server/utils/averageData.js

// const moment = require('moment');

// const calculateAveragedData = (filteredData) => {
//     let groupedData = new Map();
//     filteredData.forEach(item => {
//         const roundedTime = moment(item.time, 'HH:mm:ss').startOf('minute').seconds(
//             Math.floor(moment(item.time, 'HH:mm:ss').seconds() / 15) * 15
//         ).format('HH:mm:ss');

//         const dateTimeKey = `${item.date} ${roundedTime}`;
//         if (!groupedData.has(dateTimeKey)) {
//             groupedData.set(dateTimeKey, { sum: 0, count: 0, date: item.date, time: roundedTime });
//         }
//         let entry = groupedData.get(dateTimeKey);
//         entry.sum += item.temperature;
//         entry.count += 1;
//     });

//     return Array.from(groupedData.values()).map(entry => ({
//         date: entry.date,
//         time: entry.time,
//         temperature: entry.sum / entry.count
//     }));
// };

// module.exports = calculateAveragedData;

// ```
// ```
// // server\routes\fileRoutes.js

// const path = require('path');
// const express = require('express');
// const multer = require('multer');
// const fs = require('fs').promises;
// const router = express.Router();
// const Papa = require('papaparse');
// const FileMetadata = require('../models/FileMetadata');
// const processData = require('../utils/refining');
// const calculateQuartiles = require('../utils/quartileCalculations');

// // 파일 업로드 미들웨어 설정
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'uploads/'),
//   filename: (req, file, cb) => cb(null, file.originalname)
// });

// const upload = multer({ storage: storage });

// // 파일 업로드 처리
// router.post('/upload', upload.single('file'), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }

//   const filePath = req.file.path;
//   let allData = [];

//   try {
//     const fileContent = await fs.readFile(filePath, 'utf8');
//     Papa.parse(fileContent, {
//       header: true,
//       dynamicTyping: true,
//       skipEmptyLines: true,
//       step: (row) => {
//         const { '[Date]': date, '[Time]': time, '[Temperature]': temperature } = row.data;
//         allData.push({ date, time, temperature });
//       }
      
//     });
//     const { averagedData, boxplotStats } = processData(allData);

//     res.json({ success: true, message: 'File processed successfully', data: averagedData, boxplotStats });
//   } catch (error) {
//     console.error('Error processing file:', error);
//     res.status(500).send('Error processing file');
//   } finally {
//     try {
//       await fs.unlink(filePath);
//     } catch (error) {
//       console.error('Error deleting file:', error);
//     }
//   }
// });

// // boxplot dynamic data
// router.post('/process-filtered-data', async (req, res) => {
//   const { filteredData } = req.body;
//   console.log("filteredData: ", filteredData)
//   try {
//     const { boxplotStats } = processData(filteredData);

//     res.json({ success: true, message: 'Filtered data processed successfully', boxplotStats });
//   } catch (error) {
//     console.error('Error processing filtered data:', error);
//     res.status(500).send('Error processing filtered data');
//   }
// });


// // 데이터 저장 처리
// router.post('/save', async (req, res) => {
//   const { fileName, graphData, boxPlotData, numbering, filedate, userInput, startTime, endTime } = req.body;
//   try {
//     const newFileMetadata = new FileMetadata({
//       fileName,
//       temperatureData: graphData,
//       boxplotStats: boxPlotData,
//       numbering: numbering,
//       filedate,
//       userInput,
//       startTime, 
//       endTime,
//     });
//     await newFileMetadata.save();

//     res.json({ message: 'Data saved successfully', data: newFileMetadata });
//   } catch (error) {
//     console.error('Error saving data:', error);
//     res.status(500).send('Error saving data');
//   }
// });

// // 특정 데이터 항목의 상세 정보 업데이트
// router.patch('/data/:id', async (req, res) => {
//   const { id } = req.params;
//   const { userInput } = req.body; // 요청 본문에서 수정된 userInput 값을 받기
  
//   try {
//     // findByIdAndUpdate 메서드를 사용하여 해당 ID의 문서를 찾고, userInput 필드를 업데이트
//     const updatedItem = await FileMetadata.findByIdAndUpdate(id, { $set: { userInput: userInput } }, { new: true });
    
//     if (!updatedItem) {
//       return res.status(404).send('Data not found');
//     }

//     res.json({ message: 'Data updated successfully', data: updatedItem });
//   } catch (error) {
//     console.error('Error updating data:', error);
//     res.status(500).send('Error updating data');
//   }
// });

// // 데이터 리스트 조회 
// router.get('/data-list', async (req, res) => {
//   try {
//     const dataList = await FileMetadata.find({}); // 모든 데이터 리스트 조회console.log
//     res.json(dataList); // 클라이언트에 데이터 리스트 응답
//   } catch (error) {
//     console.error('Error fetching data list:', error); // 에러 로깅
//     res.status(500).send('Error fetching data list');
//   }
// });

// // 특정 데이터 항목의 상세 정보 조회
// router.get('/data/:id', async (req, res) => {
//   const { id } = req.params;
//   const { userInput } = req.body;
//   try {
//     const dataItem = await FileMetadata.findByIdAndUpdate(id, { $set: { userInput } }, { new: true });
//     if (!dataItem) {
//       return res.status(404).send('Data not found');
//     }

//     res.json(dataItem);
//   } catch (error) {
//     console.error('Error fetching data item:', error);
//     res.status(500).send('Server error');
//   }
// });

// // 특정 데이터 항목의 상세 정보 삭제
// router.delete('/data/:id', async (req, res) => {
//   try {
//     const id = req.params.id;
//     const deletedItem = await FileMetadata.findByIdAndDelete(id); // 데이터 삭제

//     if (!deletedItem) {
//       return res.status(404).send({ message: 'Data not found' });
//     }

//     res.send({ message: 'Data successfully removed' }); // 성공 메시지 반환
//   } catch (error) {
//     console.error('Error removing data:', error);
//     res.status(500).send('Internal server error');
//   }
// });

// // CSV 변환을 위한 함수
// const objectToCsv = (data) => {
//   const csvRows = data.map(item => {
//     const { userInput, numbering, boxplotStats } = item;
//     return `"${userInput}","${numbering.wNumber}","${numbering.dwNumber}","${numbering.dieNumber}","${boxplotStats.median}"`;
//   });
//   return `userInput,wNumber,dwNumber,dieNumber,median\n${csvRows.join("\n")}`;
// };

// // 선택된 데이터를 CSV로 변환하여 반환하는 엔드포인트
// router.post('/export-csv', async (req, res) => {
//   const { ids } = req.body; // 클라이언트에서 전송한 데이터 ID 배열

//   try {
//     const data = await FileMetadata.find({ '_id': { $in: ids } });
//     if (!data.length) {
//       return res.status(404).send('Data not found');
//     }
//     const csvData = objectToCsv(data);
//     res.header('Content-Type', 'text/csv');
//     res.attachment('exported_data.csv');
//     return res.send(csvData);
//   } catch (error) {
//     console.error('Error exporting to CSV:', error);
//     return res.status(500).send('Internal Server Error');
//   }
// });

// module.exports = router;

// ```
// ```
// // server/models/FileMetadata.js

// const mongoose = require('mongoose');

// const fileMetadataSchema = new mongoose.Schema({
//     fileName: String,
//     uploadDate: { type: Date, default: Date.now },
//     temperatureData: [{
//         date: String,
//         time: String,
//         temperature: Number
//     }],
//     boxplotStats: {
//         min: Number,
//         q1: Number,
//         median: Number,
//         q3: Number,
//         max: Number,
//         outliers: [Number]
//     },
//     numbering: {
//         countNumber: String,
//         wNumber: String,
//         dwNumber: String,
//         dieNumber: String,
//     },
//     filedate: String,
//     userInput: String,
//     startTime: String, 
//     endTime: String,
// });

// const FileMetadata = mongoose.model('FileMetadata', fileMetadataSchema);

// module.exports = FileMetadata;

// ```
// ```
// // server\utils\quartile.js

// const quartile = (arr, q) => {
//     const sorted = arr.slice().sort((a, b) => a - b);
//     const pos = (sorted.length - 1) * q;
//     const base = Math.floor(pos);
//     const rest = pos - base;
//     if (sorted[base + 1] !== undefined) {
//         return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
//     } else {
//         return sorted[base];
//     }
// };

// module.exports = quartile;

// ```
// ```
// // server/utils/preprocessData.js

// function preprocessData(data) {
//     let dateCounts = {};
//     let temperatures = [];

//     // 데이터 전처리
//     for (const item of data) {
//         const date = item['date'];
//         const time = item['time'];
//         const temperature = parseFloat(item['temperature']);

//         if (!isNaN(temperature)) {
//             dateCounts[date] = (dateCounts[date] || 0) + 1;
//             temperatures.push({ date, time, temperature });
//         }
//     }
//     // console.log("temperatures: ", temperatures);

//     // dateCounts 객체가 비어있는 경우 처리
//     const mostDataDate = Object.keys(dateCounts).length > 0
//         ? Object.keys(dateCounts).reduce((a, b) => dateCounts[a] > dateCounts[b] ? a : b)
//         : null;

//     if (mostDataDate) {
//         temperatures = temperatures.filter(item => item.date === mostDataDate);
//     } else {
//         temperatures = []; // mostDataDate가 없는 경우, temperatures 배열을 비웁니다.
//     }

//     const tempValues = temperatures.map(item => item.temperature);

//     return { temperatures, tempValues };
// }

// module.exports = preprocessData;

// ```
// ```
// // server/utils/boxplotStats.js

// const quartile = require('./quartile');

// const calculateBoxplotStats = (averagedData) => {
//     const temperatureValues = averagedData.map(entry => entry.temperature).filter(t => !isNaN(t));
//     if (temperatureValues.length === 0) {
//       return { min: null, q1: null, median: null, q3: null, max: null, outliers: [] };
//     }
  
//     const q1 = quartile(temperatureValues, 0.25);
//     const median = quartile(temperatureValues, 0.5);
//     const q3 = quartile(temperatureValues, 0.75);
//     const iqr = q3 - q1;
//     const lowerBound = q1 - 1.5 * iqr;
//     const upperBound = q3 + 1.5 * iqr;
  
//     const min = Math.min(...temperatureValues);
//     const max = Math.max(...temperatureValues);
//     const outliers = temperatureValues.filter(t => t < lowerBound || t > upperBound);
  
//     return { min, q1, median, q3, max, outliers };
//   };

// module.exports = calculateBoxplotStats;

// ```
// ```
// // server\app.js

// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const morgan = require('morgan');
// const fileRoutes = require('./routes/fileRoutes');
// const fs = require('fs');
// const connectDB = require('./config/db');

// const app = express();
// const uploadDir = './uploads';

// // uploads 디렉토리 확인 및 생성
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }
// app.use(bodyParser.json({ limit: '50mb' }));
// // URL 인코딩 본문 파서의 크기 제한을 50MB로 설정
// app.use(bodyParser.urlencoded({ 
//   limit: '50mb',
//   extended: true 
// }));

// app.use(cors());
// app.use(express.json());
// app.use(morgan('dev'));
// connectDB();

// app.use('/api', fileRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// ```
// ```
// // server/utils/refining.js

// const moment = require('moment');
// const calculateQuartiles = require('./quartileCalculations');
// const calculateAveragedData = require('./averageData');
// const calculateBoxplotStats = require('./boxplotStats');
// const preprocessData = require('./preprocessData');

// function processData(data) {
//     // 데이터 전처리 로직 호출
//     const { temperatures, tempValues } = preprocessData(data);

//     // Quartile 관련 계산 로직 호출
//     const { q1, q3, lowerBound, upperBound } = calculateQuartiles(tempValues);

//     // 필터링 및 데이터 변환 로직 호출
//     let filteredData = temperatures.filter(item => item.temperature >= lowerBound && item.temperature <= upperBound)
//         .map(item => ({
//             date: item.date,
//             time: moment(item.time, 'HH:mm:ss:SSS').format('HH:mm:ss'),
//             temperature: item.temperature
//         }));

//     // AveragedData 계산 로직 호출
//     const averagedData = calculateAveragedData(filteredData);

//     // BoxplotStats 계산 로직 호출
//     const boxplotStats = calculateBoxplotStats(averagedData, q1, q3, lowerBound, upperBound);

//     console.log("averagedData: ", averagedData);
//     return { averagedData, boxplotStats };
// }

// module.exports = processData;

// ```
// ```
// // server/utils/quartileCalculations.js

// const quartile = require('./quartile');


// const calculateQuartiles = (tempValues) => {
//     const q1 = quartile(tempValues, 0.25);
//     const q3 = quartile(tempValues, 0.75);
//     const iqr = q3 - q1;
//     const lowerBound = q1 - 1.5 * iqr;
//     const upperBound = q3 + 1.5 * iqr;

//     return { q1, q3, iqr, lowerBound, upperBound };
// };

// module.exports = calculateQuartiles;

// ```