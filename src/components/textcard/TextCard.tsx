import React, { ReactNode } from 'react';
import styles from './styles.module.css';

interface FinanceCardProps {
  children: ReactNode;
}

const FinanceCard = ({ children }: FinanceCardProps) => {
  return (
    <div className={styles.Card}>
      {children}
    </div>
  );
};

export default FinanceCard;
