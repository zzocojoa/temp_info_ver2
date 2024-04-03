// client/src/components/Banner.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Banner.module.css';
import { faSignal, faMagnifyingGlassChart, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Banner() {
    let navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const navigateTo = (path) => {
        navigate(path);
    };

    const toggleSidebar = () => {
        console.log('Toggling sidebar. Current state is:', isOpen); // For debugging
        setIsOpen(!isOpen);
    };
    
    const getSpanClassName = (baseClass, positionClass) => {
        let classes = [styles[baseClass], styles[positionClass]];
        if (isOpen) classes.push(styles['menuSpanActive']);
        return classes.join(' ');
    };

    return (
        <div className={styles.bannerWrap}>
            <input type="checkbox" id="menuicon" className={styles.menuIcon} onChange={toggleSidebar} checked={isOpen} />
            <label htmlFor="menuicon" className={styles.menuLabel}>
                <span className={getSpanClassName('menuSpan', 'menuSpanFirst')}></span>
                <span className={`${getSpanClassName('menuSpan', 'menuSpanMiddle')} ${isOpen ? styles.hidden : ''}`}></span>
                <span className={getSpanClassName('menuSpan', 'menuSpanLast')}></span>
            </label>
            <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles['bannerContainer']}>
                    <div className={styles['banner']}>
                        <div onClick={() => navigateTo('/')} style={{ cursor: 'pointer' }}>
                            <div className={styles['banner-logo']}>
                            {/* {isOpen && <img src="./images/logo.png" alt="logo" />} */}
                            </div>
                        </div>
                        <ul className={styles['banner-menu']}>
                            <li className={styles['banner-title']} onClick={() => navigateTo('/graph-data')} style={{ cursor: 'pointer' }}>
                                <div className={styles['icon-img']} style={{ color: 'orange' }}>
                                    <FontAwesomeIcon icon={faSignal} />
                                </div>
                                {/* Debugging line below */}
                                {isOpen ? <div>Temp.Graph</div> : <div style={{ display: 'none' }}>Temp.Graph</div>}
                            </li>
                            <li className={styles['banner-title']} onClick={() => navigateTo('/line-bar')} style={{ cursor: 'pointer' }}>
                                <div className={styles['icon-img']}>
                                    <FontAwesomeIcon icon={faChartLine} />
                                </div>
                                {isOpen ? <div>Line/Bar</div> : <div style={{ display: 'none' }}>Line/Bar</div>}
                            </li>
                            <li className={styles['banner-title']} onClick={() => navigateTo('/Analysis-page')} style={{ cursor: 'pointer' }}>
                                <div className={styles['icon-img']}>
                                    <FontAwesomeIcon icon={faMagnifyingGlassChart} />
                                </div>
                                {isOpen ? <div>Analysis</div> : <div style={{ display: 'none' }}>Analysis</div>}
                            </li>
                            <li className={styles['banner-title']} onClick={() => navigateTo('/graph-data')} style={{ cursor: 'pointer' }}>
                                <div className={styles['icon-img']}>
                                    {/* Placeholder for future icon */}
                                </div>
                                {isOpen ? <div>준비중...</div> : <div style={{ display: 'none' }}>준비중...</div>}
                            </li>
                        </ul>
                        <ul className={styles['banner-icons']}>
                            <li>
                            {isOpen && <a href='https://github.com/zzocojoa/temp_info_ver2' aria-label="GitHub" target='_blank' rel="noreferrer noopener">
                                    <FontAwesomeIcon icon={faGithub} />
                                </a>}
                            </li>
                            <li onClick={() => navigateTo('/Card')} style={{ cursor: 'pointer' }}>
                                {/* <img className={styles['developer-icon']} src="./images/hoihou-icon-1.png" alt="hoihou-icon-1" /> */}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Banner;
