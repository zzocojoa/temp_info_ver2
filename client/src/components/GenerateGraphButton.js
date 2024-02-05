// src\components\GenerateGraphButton.js

import React from 'react';

function GenerateGraphButton({ isEnabled, onGenerateGraph }) {
  
  return (
    <button onClick={onGenerateGraph} disabled={!isEnabled}>
      Generate Graph
    </button>
  );
}

export default GenerateGraphButton;
