// client\src\components\line_box\DWSelector\DwNumberSelector.js

import React from 'react';
import styles from './DwNumberSelector.module.css'

const DwNumberSelector = ({ dwNumbers, selectedDwNumbers, setSelectedDwNumbers }) => {
    const toggleDwNumber = (dwNumber) => {
        if (selectedDwNumbers.includes(dwNumber)) {
            setSelectedDwNumbers(selectedDwNumbers.filter(num => num !== dwNumber));
        } else {
            setSelectedDwNumbers([...selectedDwNumbers, dwNumber]);
        }
    };

    return (
        <div className={styles['DwNumberSelectorWrap']}>
            <div className={styles['DwNumberSelectorContainer']}>
                <div className={styles['DwNumberSelector']}>
                    {dwNumbers.map((dwNumber, index) => (
                        <button
                            className={styles['DwNumberButton']}
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
