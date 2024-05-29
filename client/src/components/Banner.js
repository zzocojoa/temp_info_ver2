// client/src/components/Banner.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Banner.module.css';
import { faSignal, faMagnifyingGlassChart, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function Banner({ isOpen, setIsOpen }) {
    let navigate = useNavigate();

    const navigateTo = (path) => {
        navigate(path);
    };

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const getSpanClassName = (baseClass, positionClass) => {
        let classes = [styles[baseClass], styles[positionClass]];
        if (isOpen) classes.push(styles['menuSpanActive']);
        return classes.join(' ');
    };

    return (
        <div className={styles.bannerWrap}>
            <div className={styles.bannerHeader}>
                <div className={styles.bannercheckbox}>
                    <input type="checkbox" id="menuicon" className={styles.menuIcon} onChange={toggleSidebar} checked={isOpen} />
                    <div className={styles['bannerlogoWrap']}>
                        <label htmlFor="menuicon" className={styles.menuLabel}>
                            <span className={getSpanClassName('menuSpan', 'menuSpanFirst')}></span>
                            <span className={`${getSpanClassName('menuSpan', 'menuSpanMiddle')} ${isOpen ? styles.hidden : ''}`}></span>
                            <span className={getSpanClassName('menuSpan', 'menuSpanLast')}></span>
                        </label>
                    </div>
                </div>
                <a href="http://www.aldmc.co.kr/kor/main/main.html" className={styles['banner-logo']} style={{ cursor: 'pointer' }} aria-label="aldmc" target='_blank' rel="noreferrer noopener">
                    {isOpen && <img src="./images/logo.png" alt="logo" />}
                </a>
            </div>
            <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles['bannerContainer']}>
                    <div className={styles['banner']}>
                        <ul className={styles['banner-menu']}>
                            <li className={styles['banner-title']} onClick={() => navigateTo('/graph-data')} style={{ cursor: 'pointer' }}>
                                <div className={styles['icon-img']} style={{ color: 'orange' }}>
                                    <FontAwesomeIcon icon={faSignal} />
                                </div>
                                {isOpen ? <div className={styles['banner-title-name']}>T.Graph</div> : null}
                            </li>
                            <li className={styles['banner-title']} onClick={() => navigateTo('/line-bar')} style={{ cursor: 'pointer' }}>
                                <div className={styles['icon-img']}>
                                    <FontAwesomeIcon icon={faChartLine} />
                                </div>
                                {isOpen ? <div className={styles['banner-title-name']}>Line/Bar</div> : null}
                            </li>
                            <li className={styles['banner-title']} onClick={() => navigateTo('/Analysis-page')} style={{ cursor: 'pointer' }}>
                                <div className={styles['icon-img']}>
                                    <FontAwesomeIcon icon={faMagnifyingGlassChart} />
                                </div>
                                {isOpen ? <div className={styles['banner-title-name']}>Analysis</div> : null}
                            </li>
                            <li className={styles['banner-title']} onClick={() => navigateTo('/graph-data')} style={{ cursor: 'pointer' }}>
                                <div className={styles['icon-img']}>
                                    <FontAwesomeIcon icon={faMagnifyingGlassChart} />
                                </div>
                                {isOpen ? <div className={styles['banner-title-name']}>준비중...</div> : null}
                            </li>
                            <li className={styles['banner-title']} style={{ cursor: 'pointer' }}>
                                <a className={styles['icon-img']} href='https://github.com/zzocojoa/temp_info_ver2' aria-label="GitHub" target='_blank' rel="noreferrer noopener">
                                    <FontAwesomeIcon icon={faGithub} />
                                </a>
                            </li>
                        </ul>
                        <ul className={styles['banner-icons']}>

                            <li onClick={() => navigateTo('/Card')} style={{ cursor: 'pointer' }}>
                                <img className={styles['developer-icon']} src="./images/hoihou-icon-1.png" alt="hoihou-icon-1" />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Banner;
