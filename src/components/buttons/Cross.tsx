import React from 'react';
import styles from './Cross.module.css';

interface CrossProps {
  width?: string;
  height?: string;
  onClickCallback: () => void;
}
const Cross: React.FC<CrossProps> = ({ width = '20px', height = '20px', onClickCallback }) => {
  return (
    <div
      className={styles.crossButton}
      aria-label="Close"
      role="button"
      style={{ width: width, height: height }}
      onClick={() => onClickCallback()}
    ></div>
  );
};

export default Cross;
