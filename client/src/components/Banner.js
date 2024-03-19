// client/src/components/Banner.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Banner.module.css';
import { faSignal, faMagnifyingGlassChart, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Banner() {
    let navigate = useNavigate();

    const navigateTo = (path) => {
        navigate(path);
    };

    return (
        <div className={styles['bannerWrap']}>
            <div className={styles['bannerContainer']}>
                <div className={styles['banner']}>
                    <div onClick={() => navigateTo('/')} style={{ cursor: 'pointer' }}>
                        <div className={styles['banner-logo']}>
                            <img src={`${process.env.PUBLIC_URL}/images/logo.png`} alt="logo" />
                        </div>
                    </div>
                    <ul className={styles['banner-menu']}>
                        <li className={styles['banner-title']} onClick={() => navigateTo('/graph-data')} style={{ cursor: 'pointer' }}>
                            <div className={styles['icon-img']}>
                                <FontAwesomeIcon icon={faSignal} />
                            </div>
                            <div>Temp.Graph</div>
                        </li>
                        <li className={styles['banner-title']} onClick={() => navigateTo('/line-bar')} style={{ cursor: 'pointer' }}>
                            <div className={styles['icon-img']}>
                                <FontAwesomeIcon icon={faChartLine} />
                            </div>
                            <div>Line/Bar</div>
                        </li>
                        <li className={styles['banner-title']} onClick={() => navigateTo('/Analysis-page')} style={{ cursor: 'pointer' }}>
                            <div className={styles['icon-img']}>
                                <FontAwesomeIcon icon={faMagnifyingGlassChart} />
                            </div>
                            <div>Analysis</div>
                        </li>
                        <li className={styles['banner-title']} onClick={() => navigateTo('/graph-data')} style={{ cursor: 'pointer' }}>
                            <div className={styles['icon-img']}>
                                {/* <FontAwesomeIcon icon={faTemperatureHigh} /> */}
                            </div>
                            <div>준비중...</div>
                        </li>
                    </ul>
                    <ul className={styles['banner-icons']}>
                        <li>
                            <a href='https://github.com/zzocojoa/temp_info_ver2' aria-label="GitHub" target='_blank' rel="noreferrer noopener">
                                <FontAwesomeIcon icon={faGithub} />
                            </a>
                        </li>
                        <li onClick={() => navigateTo('/Card')} style={{ cursor: 'pointer' }}>
                            <img className={styles['developer-icon']} src={`${process.env.PUBLIC_URL}/images/hoihou-icon-1.png`} alt="logo" />
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Banner;