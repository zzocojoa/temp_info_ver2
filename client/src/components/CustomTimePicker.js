// src/components/CustomTimePicker.js

import React from 'react';

const CustomTimePicker = ({ label, value, onChange }) => {
  // 30분 간격으로 시간 옵션을 생성하는 함수
  const generateTimeOptions = () => {
    const times = [];
    for(let i = 0; i < 24; i++) {
      for(let j = 0; j < 2; j++) {
        const hour = i.toString().padStart(2, '0');
        const minute = (j === 0) ? '00' : '30';
        times.push(`${hour}:${minute}`);
      }
    }
    return times;
  };

  return (
    <label>
      <p>{label}</p>
      <select value={value} onChange={onChange} className="custom-timepicker">
        {generateTimeOptions().map(time => (
          <option key={time} value={time}>{time}</option>
        ))}
      </select>
    </label>
  );
};

export default CustomTimePicker;
