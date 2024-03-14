// client/src/components/Banner.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Banner.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTemperatureHigh } from '@fortawesome/free-solid-svg-icons';
import { faFacebookSquare } from '@fortawesome/free-brands-svg-icons';
// import { faFacebookSquare, faInstagramSquare } from '@fortawesome/free-brands-svg-icons';



function Banner() {
    let navigate = useNavigate();

    // 홈으로 이동
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
                            {/* <div className={styles['banner-title']}>T/B</div> */}
                        </div>
                    </div>
                    <ul className={styles['banner-menu']}>
                        <li onClick={() => navigateTo('/graph-data')} style={{ cursor: 'pointer' }}>
                            <FontAwesomeIcon icon={faTemperatureHigh} />
                            Temp.Graph
                        </li>
                        <li onClick={() => navigateTo('/line-bar')} style={{ cursor: 'pointer' }}>
                            <FontAwesomeIcon icon={faTemperatureHigh} />
                            Line/Bar
                        </li>
                        <li onClick={() => navigateTo('/cluster-data')} style={{ cursor: 'pointer' }}>
                            <FontAwesomeIcon icon={faTemperatureHigh} />
                            Cluster
                        </li>
                        <li onClick={() => navigateTo('/graph-data')} style={{ cursor: 'pointer' }}>
                            <FontAwesomeIcon icon={faTemperatureHigh} />
                            준비중
                        </li>
                        {/* 추가적인 메뉴 항목에 대한 경로 설정이 필요하면 여기에 구현 */}
                    </ul>

                    <ul className={styles['banner-icons']}>
                        <li><FontAwesomeIcon icon={faFacebookSquare} /></li>
                        <li onClick={() => navigateTo('/Card')} style={{ cursor: 'pointer' }}>
                            <img className={styles['developer-icon']} src={`${process.env.PUBLIC_URL}/images/hoihou-icon-1.png`} alt="logo" />
                            {/* <FontAwesomeIcon icon={faInstagramSquare} /> */}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Banner;