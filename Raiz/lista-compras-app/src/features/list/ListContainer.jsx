// src/components/ListContainer.jsx
import React from 'react';
import Lista from './Lista';
import styles from './ListContainer.module.css';

const ListContainer = ({ 
  listas, 
  onRemoveLista, 
  onNomeChange, 
  onToggleEssencial, 
  onTotalChange 
}) => {
  return (
    <main className={styles.listasMainContainer}>
      {listas.length === 0 ? (
        <p className={styles.nenhumaListaMsg}>
          Nenhuma lista criada ainda. Clique em "+ Adicionar Nova Lista" para começar.
        </p>
      ) : listas.map((lista) => (
        <Lista
          key={lista.id} id={lista.id} nomeInicial={lista.nome} essencialInicial={lista.essencial}
          onRemoveLista={() => onRemoveLista(lista.id)}
          onNomeChange={onNomeChange} 
          onToggleEssencial={onToggleEssencial}
          onTotalChange={onTotalChange}
        />
      ))}
    </main>
  );
};

export default ListContainer;