// src\components\SaveCsvDataButton.js

import React from 'react';

function SaveCsvDataButton({ data, onSaveSuccess }) {
  const handleSaveData = async () => {
    // API 요청을 통해 서버에 데이터 저장
    try {
      const response = await fetch('http://localhost:5000/api/save', {
        
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        onSaveSuccess();
        alert('Data saved successfully!');
      } else {
        alert('Failed to save data.');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data.');
    }
  };

  return (
    <button onClick={handleSaveData}>Save Data</button>
  );
}

export default SaveCsvDataButton;
