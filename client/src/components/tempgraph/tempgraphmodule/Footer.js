// client/src/components/Footer.js

import React from 'react';
// import { useNavigate } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  // let navigate = useNavigate();
    
  //   const main = () => {
  //       navigate('/');
  //   };

  //   const goToGraphData = () => {
  //       navigate('/graph-data');
  //   };

  return (
    <footer>
      <div className={styles['footerText']}>Copyright © HOIHOU All Rights Reserved.</div>
    </footer>
  );
};

export default Footer;
