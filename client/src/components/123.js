// ```
// // src/components/CustomTimePicker.js

// import React from 'react';

// const CustomTimePicker = ({ label, value, onChange }) => {
//   // 30분 간격으로 시간 옵션을 생성하는 함수
//   const generateTimeOptions = () => {
//     const times = [];
//     for(let i = 0; i < 24; i++) {
//       for(let j = 0; j < 2; j++) {
//         const hour = i.toString().padStart(2, '0');
//         const minute = (j === 0) ? '00' : '30';
//         times.push(`${hour}:${minute}`);
//       }
//     }
//     return times;
//   };

//   return (
//     <label>
//       <p>{label}</p>
//       <select value={value} onChange={onChange} className="custom-timepicker">
//         {generateTimeOptions().map(time => (
//           <option key={time} value={time}>{time}</option>
//         ))}
//       </select>
//     </label>
//   );
// };

// export default CustomTimePicker;
// ```
// ```
// // src\components\BoxGraph.js

// import React, { useEffect, useRef } from 'react';
// import * as d3 from 'd3';
// import styles from './BoxGraph.module.css'; // 가정한 CSS 모듈 경로

// function BoxGraph({ boxplotStats }) {
//   const svgRef = useRef();

//   useEffect(() => {
//     if (!boxplotStats) return;
//     const svg = d3.select(svgRef.current);
//     const margin = { top: 10, right: 30, bottom: 30, left: 40 };
//     const width = 460 - margin.left - margin.right;
//     const height = 400 - margin.top - margin.bottom;

//     svg.selectAll("*").remove();
//     const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

//     const y = d3.scaleLinear().domain([boxplotStats.min, boxplotStats.max]).range([height, 0]);
//     g.append("g").call(d3.axisLeft(y));

//     g.append("line")
//       .attr("x1", width / 2)
//       .attr("x2", width / 2)
//       .attr("y1", y(boxplotStats.min))
//       .attr("y2", y(boxplotStats.max))
//       .attr("stroke", "black");

//     g.append("rect")
//       .attr("x", width / 2 - 50)
//       .attr("y", y(boxplotStats.q3))
//       .attr("height", y(boxplotStats.q1) - y(boxplotStats.q3))
//       .attr("width", 100)
//       .attr("stroke", "black")
//       .style("fill", "#69b3a2");

//     g.append("line")
//       .attr("x1", width / 2 - 50)
//       .attr("x2", width / 2 + 50)
//       .attr("y1", y(boxplotStats.median))
//       .attr("y2", y(boxplotStats.median))
//       .attr("stroke", "black");

//     g.selectAll(".whisker")
//       .data([boxplotStats.min, boxplotStats.max])
//       .enter()
//       .append("line")
//       .attr("x1", width / 2 - 25)
//       .attr("x2", width / 2 + 25)
//       .attr("y1", d => y(d))
//       .attr("y2", d => y(d))
//       .attr("stroke", "black");

//     if (Array.isArray(boxplotStats.outliers)) {
//       g.selectAll(".outlier")
//         .data(boxplotStats.outliers)
//         .enter()
//         .append("circle")
//         .attr("class", "outlier")
//         .attr("cx", width / 2)
//         .attr("cy", d => y(d))
//         .attr("r", 5)
//         .style("fill", "red");
//     }
//   }, [boxplotStats]);

//   // 숫자 포맷팅 함수
//   const formatNumber = (num) => num ? num.toFixed(2) : 'N/A';

//   return (
//     <div className={styles['graphDataWrap']}>
//       <div className={styles['graphDataSVG']}>
//         <svg ref={svgRef} width={460} height={400}></svg>
//       </div>
//       <div className={styles['graphDataTable']}>
//         {boxplotStats && (
//           <table className={styles.table}>
//             <thead>
//               <tr>
//                 <th className={styles.th}>최소값</th>
//                 <td className={styles.td}>{formatNumber(boxplotStats.min)}</td>
//               </tr>
//               <tr>
//                 <th className={styles.th}>Q1 (25번째 백분위수)</th>
//                 <td className={styles.td}>{formatNumber(boxplotStats.q1)}</td>
//               </tr>
//               <tr>
//                 <th className={styles.th}>중앙값</th>
//                 <td className={styles.td}>{formatNumber(boxplotStats.median)}</td>
//               </tr>
//               <tr>
//                 <th className={styles.th}>Q3 (75번째 백분위수)</th>
//                 <td className={styles.td}>{formatNumber(boxplotStats.q3)}</td>
//               </tr>
//               <tr>
//                 <th className={styles.th}>최대값</th>
//                 <td className={styles.td}>{formatNumber(boxplotStats.max)}</td>
//               </tr>
//             </thead>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }

// export default BoxGraph;
// ```
// ```
// // client\src\components\Banner.js

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
// // client\src\components\Footer.js

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import styles from './Footer.module.css';

// const Footer = () => {
//   let navigate = useNavigate();
    
//     const main = () => {
//         navigate('/');
//     };

//     const goToGraphData = () => {
//         navigate('/graph-data');
//     };

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
// // client/src/components/DataListUI.js

// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { fetchDataList, deleteData } from '../api';
// import styles from './DataListUI.module.css';

// function DataListUI() {
//   const [dataList, setDataList] = useState([]);
//   const [filteredDataList, setFilteredDataList] = useState([]);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [displayCount, setDisplayCount] = useState(10);
//   const [searchTerm, setSearchTerm] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const loadDataList = async () => {
//       const data = await fetchDataList();
//       // console.log("Initial data loaded:", data);
//       setDataList(data);
//       setFilteredDataList(data); // 초기에는 모든 데이터를 보여줌
//     };
//     loadDataList();
//   }, []);

//   useEffect(() => {
//     // searchTerm이 변경될 때마다 실행되며, dataList를 기반으로 필터링
//     const filtered = dataList.filter(dataItem =>
//       `${dataItem.filedate}_${dataItem.numbering?.wNumber ?? ''}_${dataItem.numbering?.dwNumber ?? ''}_${dataItem.numbering?.dieNumber ?? ''}`
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase())
//     );
//     // console.log("Filtered data:", filtered);
//     setFilteredDataList(filtered); // 필터링된 결과를 저장
//     setDisplayCount(10); // 검색 후 보여줄 아이템 수를 초기화
//   }, [searchTerm, dataList]);

//   const handleCheckboxChange = (itemId) => {
//     setSelectedItems(prev => prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]);
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
//       <div className={`${styles['DataListContainer']} ${styles['scroll']} ${styles['scroll-css']}`}
//         >
//         {filteredDataList.slice(0, displayCount).map((dataItem, index) => (
//           <div key={index} className={styles.dataItem}>
//             <label htmlFor={`checkbox-${dataItem._id}`} className={styles.dataItemLabel}>
//               <input
//                 type="checkbox"
//                 id={`checkbox-${dataItem._id}`}
//                 checked={selectedItems.includes(dataItem._id)}
//                 onChange={() => handleCheckboxChange(dataItem._id)}
//               />
//               {`${dataItem.filedate}_${dataItem.numbering?.wNumber ?? 'N/A'}_${dataItem.numbering?.dwNumber ?? 'N/A'}_${dataItem.numbering?.dieNumber ?? 'N/A'}`}
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
//         <div>
//           <button onClick={handleLoadSelectedData} className={styles['loadDataButton']}>불러오기</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DataListUI;

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
// // src/components/SaveCsvDataButton.js

// import React from 'react';
// import styles from './SaveCsvDataButton.module.css'
// import { saveData } from '../api';

// function SaveCsvDataButton({ data, fileName, onSaveSuccess, selectedRange }) {
//   const downloadCsv = (data, fileName) => {
//     // numbering 정보가 있는 경우 해당 값을 사용하고, 없는 경우 기본값 사용
//     const { wNumber = 'N/A', dwNumber = 'N/A', dieNumber = 'N/A' } = data.numbering || {};
//     const graphData = data.graphData;

//     // 파일명에서 날짜 추출
//     const dateMatch = fileName.match(/\d{4}-\d{2}-\d{2}/);
//     const dateFromFileName = dateMatch ? dateMatch[0] : new Date().toISOString().split('T')[0];

//     const finalFileName = `${dateFromFileName}_${wNumber}_${dwNumber}_${dieNumber}.csv`;
//     console.log("finalFileName :", finalFileName);
//     let csvContent = "data:text/csv;charset=utf-8,Date,Time,Temperature\n";

//     // graphData가 정의되지 않았을 경우를 처리
//     (graphData || []).forEach(row => {
//       const { Date, Time, Temperature } = row;
//       csvContent += `${Date},${Time},${Temperature}\n`;
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

//   const handleSaveData = async () => {
//     try {
//       const dateMatch = fileName.match(/\d{4}-\d{2}-\d{2}/);
//       const filedate = dateMatch ? dateMatch[0] : new Date().toISOString().split('T')[0]; // 파일명에서 날짜 추출
//       const { userInput } = data;

//       await saveData({ ...data, filedate, userInput });
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
// // src\components\LineGraph.js

// import React, { useState, useEffect } from 'react';
// import {
//   LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, Tooltip, Brush, ReferenceLine,
// } from 'recharts';
// import styles from './LineGraph.module.css'

// function LineGraph({ averagedData, wNumber, dwNumber, dieNumber, onDetailsChange, onBrushChange }) {
//   const [chartSize, setChartSize] = useState({ width: 600, height: 300 });

//   // 그래프 반응형 로직
//   useEffect(() => {
//     const handleResize = () => {
//       setChartSize({
//         width: Math.min(window.innerWidth * 0.9, 1000), // 최대 너비를 1000으로 제한
//         height: 400
//       });
//     };

//     window.addEventListener('resize', handleResize);
//     handleResize(); // 컴포넌트 마운트 시에도 크기 조정

//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const handleBrush = (e) => {
//     if (e && e.startIndex !== undefined && e.endIndex !== undefined) {
//       onBrushChange(e.startIndex, e.endIndex);
//     }
//   };

//   const temperatureFormatter = (value) => `${value.toFixed(2)}°C`;

//   // 중앙값 계산 함수
//   const calculateMedian = (data) => {
//     const temps = data.map(item => item.Temperature).sort((a, b) => a - b);
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
//                 <span className={styles['ExNumber']}>W_Number</span>
//                 <input
//                   type="text"
//                   placeholder="0000"
//                   className={styles['ExInfo']}
//                   value={wNumber}
//                   onChange={(e) => onDetailsChange('wNumber', e.target.value)}
//                 />
//               </div>
//               <div className={styles['ExWrap']}>
//                 <span className={styles['ExNumber']}>DW_Number</span>
//                 <input
//                   type="text"
//                   placeholder="0000"
//                   className={styles['ExInfo']}
//                   value={dwNumber}
//                   onChange={(e) => onDetailsChange('dwNumber', e.target.value)}
//                 />
//               </div>
//               <div className={styles['ExWrap']}>
//                 <span className={styles['ExNumber']}>Die_Number</span>
//                 <input
//                   type="text"
//                   placeholder="0000"
//                   className={styles['ExInfo']}
//                   value={dieNumber}
//                   onChange={(e) => onDetailsChange('dieNumber', e.target.value)}
//                 />
//               </div>
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
//           <XAxis dataKey="Time"
//           // label={{ value: '시간', position: 'insideBottomRight', offset: -20 }}
//           />
//           <YAxis domain={['auto', 'auto']}
//           // label={{ value: '온도', angle: -90, position: 'insideLeft' }}
//           />
//           <Legend />
//           <Line
//             type="monotone"
//             dataKey="Temperature"
//             stroke="#8884d8"
//             dot={false}
//             activeDot={{ r: 4 }}
//           />
//           <Brush
//             dataKey="Time"
//             height={30}
//             stroke="#8884d8"
//             onChange={handleBrush}
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
//   const [selectedRange, setSelectedRange] = useState({ start: 0, end: 0 });
//   const [userInput, setUserInput] = useState('');
//   const [details, setDetails] = useState({
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

//         // MongoDB에서 조회된 데이터를 기반으로 상태 업데이트
//         const firstItemDetails = results[0]?.numbering || {};
//         const { wNumber, dwNumber, dieNumber } = firstItemDetails;

//         // 상태에 Die_Number, DW_Number, W_Number 저장
//         setDetails({ wNumber, dwNumber, dieNumber });

//         setGraphData(allGraphData);
//         setBoxPlotData(allBoxPlotData);
//         setUserInput(firstUserInput);
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

//   const handleBrushChange = (startIndex, endIndex) => {
//     setSelectedRange({ start: startIndex, end: endIndex });

//   };

//   return (
//     <div className={styles['graphDataWrap']}>
//       <div className={styles['graphDataContainer']}>
//         <div className={styles['leftPanel']}>
//           <h2 className={styles['headerTitle']}>Graph Data Visualization</h2>
//           {graphData.length > 0 ? (
//             <LineGraph
//               averagedData={graphData}
//               wNumber={details.wNumber}
//               dwNumber={details.dwNumber}
//               dieNumber={details.dieNumber}
//               onDetailsChange={(key, value) => setDetails(prev => ({ ...prev, [key]: value }))}
//               onBrushChange={handleBrushChange}
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
// // src/pages/GraphDataPage.js

// import React, { useState } from 'react';
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
//   const [boxPlotData, setBoxPlotData] = useState(null);
//   const [uploadedFileName, setUploadedFileName] = useState('');
//   const [userInput, setUserInput] = useState('');
//   const [details, setDetails] = useState({
//     wNumber: '',
//     dwNumber: '',
//     dieNumber: '',
//   });

//   // 그래프 생성 여부를 추적하는 상태 추가
//   const [isGraphGenerated, setIsGraphGenerated] = useState(false);

//   // const [isDataSaved, setIsDataSaved] = useState(false);
//   // details 상태가 업데이트될 때마다 실행될 useEffect 훅
//   // useEffect(() => {
//   //   console.log("Current details state:", details);
//   // }, [details]);

//   const handleFileSelect = (file) => {
//     setUploadedFile(file);
//     setGraphData([]);
//     setBoxPlotData(null);
//     setUserInput('');
//     // setIsDataSaved(false);
//   };
//   const handleUploadSuccess = async (averagedData, boxplotStats, uploadedFileName) => {
//     setGraphData(averagedData);
//     setBoxPlotData(boxplotStats);
//     setUploadedFileName(uploadedFileName);
//     setIsGraphGenerated(true);
//     // setIsDataSaved(false);
//     console.log("uploadedFileName: ", uploadedFileName)
//   };
//   const handleSaveDataSuccess = () => {
//     // alert('Data saved successfully!');
//     // setIsDataSaved(true);
//   };
//   const handleBrushChange = (startIndex, endIndex) => {
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
//                 />
//                 <LineGraph
//                   averagedData={graphData}
//                   wNumber={details.wNumber}
//                   dwNumber={details.dwNumber}
//                   dieNumber={details.dieNumber}
//                   onDetailsChange={(key, value) => setDetails({ ...details, [key]: value })}
//                   onBrushChange={handleBrushChange}
//                 />
//                 <BoxGraph boxplotStats={boxPlotData} />
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

// import React from 'react';
// import styles from './UploadDataButton.module.css'
// import { uploadFile } from '../api';

// function UploadDataButton({ selectedFile, onUploadSuccess, isEnabled }) {
//   const handleUpload = async () => {
    
//     if (!selectedFile) {
//       alert('Please select a file first.');
//       return;
//     }

//     try {
//       // API를 호출하여 파일 업로드
//       const response = await uploadFile(selectedFile);
//       if (response) {
//         const { averagedData, boxplotStats } = response;
//         // 파일 업로드 성공 시, handleUploadSuccess 콜백을 호출하고,
//         // 업로드된 파일의 데이터와 파일 이름을 인자로 전달
//         onUploadSuccess(averagedData, boxplotStats, selectedFile.name);
//         // alert('File uploaded successfully!');
//       } else {
//         // 서버 응답이 없거나 업로드 실패 시
//         alert('Failed to upload file.');
//       }
//     } catch (error) {
//       console.error('Error uploading file:', error);
//       alert('Error uploading file.');
//     }
//   };

//   return (
//     <button className={styles['UploadDataButton']} onClick={handleUpload} disabled={!isEnabled}>
//       그래프 생성
//     </button>
//   );
// }

// export default UploadDataButton;
// ```
// ```
// // server/models/FileMetadata.js

// const mongoose = require('mongoose');

// const fileMetadataSchema = new mongoose.Schema({
//     fileName: String,
//     uploadDate: { type: Date, default: Date.now },
//     temperatureData: [{
//         Date: String,
//         Time: String,
//         Temperature: Number
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
//         wNumber: String,
//         dwNumber: String,
//         dieNumber: String,
//     },
//     filedate: String,
//     userInput: String,
// });

// const FileMetadata = mongoose.model('FileMetadata', fileMetadataSchema);

// module.exports = FileMetadata;

// ```
// ```
// // src\App.js

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Banner from './components/Banner';
// import GraphDataPage from './pages/GraphDataPage';
// import ViewDataPage from './pages/ViewDataPage';
// import Footer from './components/Footer';
// import './App.css';

// function App() {
//   return (
//     <Router>
//       <Banner />
//       <Routes>
//         <Route path="/"  />
//         <Route path="/graph-data" element={<GraphDataPage />} />
//         <Route path="/view-data" element={<ViewDataPage />} />
//       </Routes>
//       <Footer />
//     </Router>
//   );
// }

// export default App;
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
//     const { data: averagedData, boxplotStats } = await response.json();
//     return { averagedData, boxplotStats }; // 업로드 결과 반환
//   } catch (error) {
//     console.error('Error uploading file:', error);
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
//   console.log("dataId :", dataId)
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
// // server\utils\refining.js

// const moment = require('moment');
// const quartile = require('./quartile');

// function processData(data) {
//     let dateCounts = {};
//     let temperatures = [];

//     // 데이터 전처리 최적화: forEach 대신 for-loop 사용
//     for (const item of data) {
//         const date = item['date'];
//         const time = item['time'];
//         const temperature = parseFloat(item['temperature']);

//         if (!isNaN(temperature)) {
//             dateCounts[date] = (dateCounts[date] || 0) + 1;
//             temperatures.push({ date, time, temperature });
//         } else {
//             // console.log(`유효하지 않은 온도 값: ${rawTemperature}, 해당 행은 무시.`);
//         }
//     }

//     const mostDataDate = Object.keys(dateCounts).reduce((a, b) => dateCounts[a] > dateCounts[b] ? a : b);

//     // 해당 날짜의 데이터만 필터링
//     temperatures = temperatures.filter(item => item.date === mostDataDate);
//     const tempValues = temperatures.map(item => item.temperature);

//     const q1 = quartile(tempValues, 0.25);
//     const q3 = quartile(tempValues, 0.75);
//     const iqr = q3 - q1;
//     const lowerBound = q1 - 1.5 * iqr;
//     const upperBound = q3 + 1.5 * iqr;

//     // 필터링 및 데이터 변환
//     let filteredData = temperatures.filter(item => item.temperature >= lowerBound && item.temperature <= upperBound)
//         .map(item => ({
//             Date: item.date,
//             Time: moment(item.time, 'HH:mm:ss:SSS').format('HH:mm:ss'),
//             Temperature: item.temperature
//         }));
    
//     // 데이터 그룹화 및 평균 계산 최적화: 객체 대신 Map 사용
//     let groupedData = new Map();
//     filteredData.forEach(item => {
//         const roundedTime = moment(item.Time, 'HH:mm:ss').startOf('minute').seconds(
//             Math.floor(moment(item.Time, 'HH:mm:ss').seconds() / 15) * 15
//         ).format('HH:mm:ss');

//         const dateTimeKey = `${item.Date} ${roundedTime}`;
//         if (!groupedData.has(dateTimeKey)) {
//             groupedData.set(dateTimeKey, { sum: 0, count: 0, date: item.Date, time: roundedTime });
//         }
//         let entry = groupedData.get(dateTimeKey);
//         entry.sum += item.Temperature;
//         entry.count += 1;
//     });

//     const averagedData = Array.from(groupedData.values()).map(entry => ({
//         Date: entry.date,
//         Time: entry.time,
//         Temperature: entry.sum / entry.count
//     }));

//     // 여기부터 수정된 부분
//     const temperatureValues = Array.from(groupedData.values()).map(entry => entry.sum / entry.count);

//     const min = Math.min(...temperatureValues);
//     const max = Math.max(...temperatureValues);
//     const median = quartile(temperatureValues, 0.5);

//     const outliers = temperatureValues.filter(t => t < lowerBound || t > upperBound);

//     const boxplotStats = {
//         min,
//         q1,
//         median,
//         q3,
//         max,
//         outliers
//     };

//     // console.log("Refined Data:", boxplotStats);

//     return { averagedData, boxplotStats };
// }

// module.exports = processData;
// ```
// ```
// // server\utils\quartile.js

// const quartile = (arr, q) => {
//   const sorted = arr.slice().sort((a, b) => a - b);
//   const pos = (sorted.length - 1) * q;
//   const base = Math.floor(pos);
//   const rest = pos - base;
//   if (sorted[base + 1] !== undefined) {
//       return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
//   } else {
//       return sorted[base];
//   }
// };

// module.exports = quartile;
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

//   // 파일 경로
//   const filePath = req.file.path;
//   let allData = [];

//   try {
//     // 파일 읽기 및 파싱
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

//     // 데이터 정제 processData
//     const { averagedData, boxplotStats } = processData(allData);
//     // console.log(averagedData);

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

// // 데이터 저장 처리
// router.post('/save', async (req, res) => {
//   const { fileName, graphData, boxPlotData, numbering, filedate, userInput } = req.body;
//   // console.log("Received numbering:", filedate);
//   try {
//     const newFileMetadata = new FileMetadata({
//       fileName,
//       temperatureData: graphData,
//       boxplotStats: boxPlotData,
//       numbering: numbering,
//       filedate,
//       userInput,
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
//     const dataList = await FileMetadata.find({}); // 모든 데이터 리스트 조회
//     // console.log(dataList); // 콘솔에 조회된 데이터 리스트 출력
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
//     // console.log("dataItem :", dataItem)
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

// module.exports = router;
// ```