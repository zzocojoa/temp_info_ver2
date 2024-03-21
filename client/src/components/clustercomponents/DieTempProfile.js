import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { fetchDieTemperatureProfile, searchDwNumber } from '../../api';
import styles from './DieTempProfile.module.css';

const DieTemperatureProfileChart = () => {
  const [data, setData] = useState([]);
  const [dwNumber, setDwNumber] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const loadSuggestions = async () => {
      const dwNumbers = await searchDwNumber(dwNumber);
      const uniqueDwNumbers = [...new Set(dwNumbers.map(item => item))];
      setSuggestions(uniqueDwNumbers);
      setShowSuggestions(true);
    };
    if (dwNumber) loadSuggestions();
  }, [dwNumber]);

  const loadData = async () => {
    if (!dwNumber) return;
    console.log("생성 버튼 클릭 시 dwNumber: ", dwNumber);
    const dieTemperatureProfile = await fetchDieTemperatureProfile(dwNumber);
    dieTemperatureProfile.forEach((item, index) => {
      console.log(`dieNumber ${item.dieNumber} - Min: ${item.min}, Median: ${item.median}, Max: ${item.max}`);
    });
    setData(dieTemperatureProfile);
  };

  const handleSuggestionClick = (suggestion) => {
    setDwNumber(suggestion); // 사용자가 선택한 값으로 dwNumber 상태 업데이트
    setTimeout(() => setShowSuggestions(false), 100); // 드롭다운 리스트를 숨김
  };

  // 입력 필드의 onBlur 이벤트 핸들러
  const handleBlur = () => {
    // onBlur 이벤트가 너무 빠르게 발생하여 onClick 이벤트를 방해하지 않도록 setTimeout 사용
    setTimeout(() => setShowSuggestions(false), 100);
  };

  return (
    <div className={styles['DieTempProfileWrap']}>
      <div className={styles['DieTempProfileContainer']}>
        <div className={styles['searchBoxWrap']}>
          <div className={styles['searchBoxContainer']}>
            <div className={styles['searchBox']}>
              <input
                id="dwNumberInput"
                className={styles['searchText']}
                type="text"
                placeholder="DW Number..."
                value={dwNumber}
                onChange={(e) => setDwNumber(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={handleBlur}
              />
              <label htmlFor="dwNumberInput" className={styles['searchTextLabel']}>DW Number</label>
              {showSuggestions && suggestions.length > 0 && (
                <ul className={`${styles['suggestions']} ${styles['scroll']} ${styles['scroll-css']}`}>
                  {suggestions.map((suggestion, index) => (
                    <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
              <button onClick={loadData}>생성</button>
            </div>
          </div>
        </div>
        <div className={styles['DieTempProfileBox']}>
          <ResponsiveContainer width="100%" height="100%" aspect={2.5}>
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="dieNumber" allowDecimals={false} />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="min" stroke="#8884d8" />
              <Line type="monotone" dataKey="median" stroke="#82ca9d" />
              <Line type="monotone" dataKey="max" stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DieTemperatureProfileChart;
