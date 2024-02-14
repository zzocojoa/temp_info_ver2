// client\src\components\Banner.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Banner.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTemperatureHigh } from '@fortawesome/free-solid-svg-icons';
import { faFacebookSquare, faInstagramSquare } from '@fortawesome/free-brands-svg-icons';


function Banner() {
    let navigate = useNavigate();
    
    const main = () => {
        navigate('/');
    };

    const goToGraphData = () => {
        navigate('/graph-data');
    };


    return (
        <div className={styles.banner}>
            <div onClick={main} style={{ cursor: 'pointer' }}>
                <div className={styles['banner-logo']}>
                    <img src={`${process.env.PUBLIC_URL}/images/logo.png`} alt="logo" />
                </div>
            </div>

            <ul className={styles['banner-menu']}>
                <li onClick={goToGraphData} style={{ cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faTemperatureHigh} />
                    온도 그래프
                </li>
                <li onClick={goToGraphData} style={{ cursor: 'pointer' }}>
                    온도 그래프
                </li>
                <li onClick={goToGraphData} style={{ cursor: 'pointer' }}>
                    온도 그래프
                </li>
                <li onClick={goToGraphData} style={{ cursor: 'pointer' }}>
                    온도 그래프
                </li>
            </ul>

            <ul className={styles['banner-icons']}>
                <li><FontAwesomeIcon icon={faFacebookSquare} /></li>
                <li><FontAwesomeIcon icon={faInstagramSquare} /></li>
            </ul>
        </div>
    );
}

export default Banner;
