// src/components/Footer.jsx
import React from 'react';
import styles from './Footer.module.css';

const Footer = ({ valorTotal, tetoGastos, onEditTeto, tetoStatusClass }) => {
  return (
    <footer className={styles.appFooter}>
      <div className={styles.footerItem} title="Valor total dos itens marcados como 'comprado' em todas as listas.">
        Valor total da compra: <span className={styles.valorDestaque}>R$ {valorTotal}</span>
      </div>
      <div 
        className={`${styles.footerItem} ${styles.editable} ${tetoStatusClass ? styles[tetoStatusClass] : ''}`}
        onClick={onEditTeto} 
        title="Clique para editar seu teto de gastos"
      >
        Teto de gastos: <span className={`${styles.valorDestaque} ${tetoStatusClass ? styles.valorDestaqueEstado : ''}`}>R$ {tetoGastos}</span>
      </div>
    </footer>
  );
};

export default Footer;