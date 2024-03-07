// src/components/TextInputBox.js

import React from 'react';
import styles from './TextInputBox.module.css';

function TextInputBox({ value, onTextChange, onSave, showSaveButton }) {
  const handleChange = (event) => {
    onTextChange(event.target.value);
  };

  return (
    <div className={styles['textBoxUIWrap']}>
      <div className={styles['textBoxUIContainer']}>
        <div className={styles['textBoxUITitle']}>
          <h3 className={styles['title']}>상세 정보 입력</h3>
          {showSaveButton && (
            <button
              className={styles['resaveDataButton']}
              onClick={onSave}
              style={{ marginTop: '10px' }}>
              저장
            </button>
          )}
        </div>
        <textarea
          className={styles['textBoxTextarea']}
          type="text"
          value={value}
          rows="10"
          onChange={handleChange} />
      </div>

    </div>
  );
}

export default TextInputBox;
