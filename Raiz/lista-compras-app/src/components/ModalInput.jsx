// src/components/ModalInput.jsx
import React, { useState, useEffect, useRef } from 'react';
import styles from './ModalInput.module.css';

const ModalInput = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  titulo, 
  placeholder = "Digite aqui...",
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
  valorInicial = '',      
  inputMode = 'text'     
}) => {

  const [valor, setValor] = useState(valorInicial);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {

      setValor(valorInicial);
      
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select(); 
      }, 100);
    }
  }, [isOpen, valorInicial]);
  
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (valor.trim()) {
      onConfirm(valor);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>{titulo}</h2>
        <form onSubmit={handleFormSubmit}>
          <div className={styles.inputArea}>
            <input
              ref={inputRef}
              type="text"
              inputMode={inputMode}
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder={placeholder}
              className={styles.modalInputField}
            />
          </div>
          <div className={styles.modalActions}>
            <button 
              type="button"
              onClick={onCancel}
              className={`${styles.modalButton} ${styles.cancel}`}
            >
              {textoCancelar}
            </button>
            <button 
              type="submit" 
              className={`${styles.modalButton} ${styles.confirm}`}
              disabled={!valor.trim()}
            >
              {textoConfirmar}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalInput;