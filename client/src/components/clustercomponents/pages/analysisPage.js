// client\src\components\clustercomponents\pages\AnalysisPage.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AnalysisPage.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNodes, faChartLine } from '@fortawesome/free-solid-svg-icons';


const AnalysisPage = () => {
    const navigate = useNavigate();

    const goToClusteredDataPage = () => {
        navigate('/cluster-data');
    };

    const cluster_img = process.env.PUBLIC_URL + "/images/cluster.png";

    return (
        <div className={styles['analysisWrap']}>
            <div className={styles['analysisContainer']}>
                <div className={styles['analysisBox']}>
                    <div className={styles['front']}>
                        <i><FontAwesomeIcon icon={faCircleNodes} /></i>
                        <div className={styles['analysisTitle']}>
                            <p>Cluster</p>
                        </div>
                    </div>
                    <figure className={styles['back']}>
                        <img src={cluster_img} alt="cluster_img" className={styles['analysisData']} onClick={goToClusteredDataPage}></img>
                    </figure>
                </div>
                <div className={styles['analysisBox']}>
                    <div className={styles['front']}>
                        <i><FontAwesomeIcon icon={faChartLine} /></i>
                    </div>
                    <figure className={styles['back']}>
                        <img src={cluster_img} alt="cluster_img" className={styles['analysisData']} onClick={goToClusteredDataPage}></img>
                    </figure>
                </div>
                <div className={styles['analysisBox']}>
                    <div className={styles['front']}>
                        <i><FontAwesomeIcon icon={faChartLine} /></i>
                    </div>
                    <figure className={styles['back']}>
                        <img src={cluster_img} alt="cluster_img" className={styles['analysisData']} onClick={goToClusteredDataPage}></img>
                    </figure>
                </div>
                <div className={styles['analysisBox']}>
                    <div className={styles['front']}>
                        <i><FontAwesomeIcon icon={faChartLine} /></i>
                    </div>
                    <figure className={styles['back']}>
                        <img src={cluster_img} alt="cluster_img" className={styles['analysisData']} onClick={goToClusteredDataPage}></img>
                    </figure>
                </div>
            </div>
        </div>
    );
};

export default AnalysisPage;
