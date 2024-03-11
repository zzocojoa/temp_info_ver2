// client\src\components\line_box\DWSelector\DwNumberSelector.js

import React, { useState } from 'react';
import styles from './DwNumberSelector.module.css';

const DwNumberSelector = ({ dwNumbers, selectedDwNumbers, setSelectedDwNumbers }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const toggleDwNumber = (dwNumber) => {
        if (selectedDwNumbers.includes(dwNumber)) {
            setSelectedDwNumbers(selectedDwNumbers.filter(num => num !== dwNumber));
        } else {
            setSelectedDwNumbers([...selectedDwNumbers, dwNumber]);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // 검색 텍스트를 기반으로 dwNumbers 필터링
    const filteredDwNumbers = dwNumbers.filter(dwNumber => 
        dwNumber.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.DwNumberSelectorWrap}>
            <div className={styles.DwNumberSelectorContainer}>
                <input
                    type="text"
                    placeholder="Search DW Number..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className={styles.SearchInput}
                />
                <div className={styles.DwNumberSelector}>
                    {filteredDwNumbers.map((dwNumber, index) => (
                        <button
                            className={`${styles.DwNumberButton} ${selectedDwNumbers.includes(dwNumber) ? styles.selectedDwNumberButton : ''}`}
                            key={index}
                            onClick={() => toggleDwNumber(dwNumber)}
                            style={{ backgroundColor: selectedDwNumbers.includes(dwNumber) ? 'lightgreen' : '' }}
                        >
                            {dwNumber}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DwNumberSelector;
