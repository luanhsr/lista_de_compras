// src/components/ModalConfirmacao.jsx
import React, { useState, useEffect } from 'react';
import styles from './ModalConfirmacao.module.css';

const ModalConfirmacao = ({ 
  mensagem, 
  onConfirm, 
  onCancel, 
  tipo = 'padrao',
  textoConfirmar = 'Sim',
  textoCancelar = 'Não'   
}) => {
  const [isConfirmDisabled, setIsConfirmDisabled] = useState(true);

  useEffect(() => {
    if (mensagem) {
      setIsConfirmDisabled(true); 
      const timer = setTimeout(() => {
        setIsConfirmDisabled(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [mensagem]);

  if (!mensagem) return null;
  const estiloBotaoCancelar = tipo === 'delete' ? styles.nao : styles.neutro;

  return (
    <div className={styles['modal-overlay']}>
      <div className={`${styles['modal-content']} ${styles[tipo]}`}>
        <p>{mensagem}</p>
        <div className={styles['modal-actions']}>
          <button 
            onClick={onConfirm} 
            className={`${styles['modal-button']} ${styles.sim}`}
            disabled={isConfirmDisabled}
          >
            {textoConfirmar} 
          </button>
          <button 
            onClick={onCancel} 
            className={`${styles['modal-button']} ${estiloBotaoCancelar}`}
          >
            
            {textoCancelar}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacao;