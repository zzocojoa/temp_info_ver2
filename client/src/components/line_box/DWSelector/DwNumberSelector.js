// client\src\components\line_box\DWSelector\DwNumberSelector.js

import React, { useState } from 'react';
import styles from './DwNumberSelector.module.css';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

    const filteredDwNumbers = dwNumbers.filter(dwNumber =>
        dwNumber.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles['DwNumberSelectorWrap']}>
            <div className={styles['DwNumberSelectorContainer']}>
                <div className={styles['searchWrap']}>
                    <span className={styles['searchText']}><FontAwesomeIcon icon={faSearch} /></span>
                    <input
                        type="text"
                        placeholder="Search DW..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className={styles['searchContainer']}
                    />
                </div>
            </div>
            <div className={styles['DwNumberButtonWrap']}>
                <div className={styles['DwNumberButtonContainer']}>
                    {filteredDwNumbers.map((dwNumber, index) => (
                        <button
                            className={`${styles['DwNumberButton']} ${selectedDwNumbers.includes(dwNumber) ? styles['selectedDwNumberButton'] : ''}`}
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
