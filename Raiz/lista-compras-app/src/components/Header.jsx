// src/components/Header.jsx
import React from 'react';
import styles from './Header.module.css';

// Componente Header adaptado para incluir os botões de ação e o ícone de perfil.
function Header({ onProfileClick, onAddListClick, onCarregarListasClick }) {
  return (
    <header className={styles.appHeader}>
      <div className={styles.profileIconContainer} onClick={onProfileClick} title="Configurações de Perfil">
        <div className={styles.profileIconBackground}>
            <span role="img" aria-label="profile" className={styles.profileIcon}>👤</span>
        </div>
      </div>
      
      <div className={styles.buttonContainer}>
        <button className={styles.actionButton} onClick={onAddListClick}>
          ➕ <span className={styles.buttonText}>Adicionar Nova Lista</span>
        </button>
        <button className={`${styles.actionButton} ${styles.secondaryButton}`} onClick={onCarregarListasClick} title="Carregar listas salvas">
          🗄️ <span className={styles.buttonText}>Carregar Listas salvas</span>
        </button>
      </div>
    </header>
  );
}

export default Header;