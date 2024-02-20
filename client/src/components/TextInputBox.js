// src/components/TextInputBox.js

import React, { useState } from 'react';

function TextInputBox({ label, onTextChange }) {
  const [text, setText] = useState('');

  const handleChange = (event) => {
    setText(event.target.value);
    onTextChange(event.target.value); // 상위 컴포넌트로 텍스트 데이터 전달
  };

  return (
    <div>
      <label>
        {label}
        <input type="text" value={text} onChange={handleChange} />
      </label>
    </div>
  );
}

export default TextInputBox;
