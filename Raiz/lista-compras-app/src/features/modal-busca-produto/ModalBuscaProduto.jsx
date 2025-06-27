// src/features/modal-busca-produto/ModalBuscaProduto.jsx
import React from 'react';
import styles from './ModalBuscaProduto.module.css';

// Componente visual do modal de busca de produtos.
const ModalBuscaProduto = ({ isOpen, onClose }) => {

  // Dados de exemplo para a lista (serão substituídos pela busca real)
  const mockProdutos = [
    { id: 1, nome: 'Arroz Integral', qtd: '1kg', preco: 15.50, marca: 'Tio João', qualidade: 'boa' },
    { id: 2, nome: 'Leite Desnatado', qtd: '6 un', preco: 4.99, marca: 'Piracanjuba', qualidade: 'boa' },
    { id: 3, nome: 'Refrigerante Cola', qtd: '2L', preco: 8.00, marca: 'Marca Ruim', qualidade: 'ruim' },
    { id: 4, nome: 'Feijão Carioca', qtd: '1kg', preco: 9.80, marca: 'Camil', qualidade: 'nao_sei' },
    { id: 5, nome: 'Café em Pó', qtd: '500g', preco: 22.75, marca: '3 Corações', qualidade: 'boa' },
  ].sort((a, b) => a.nome.localeCompare(b.nome)); // Ordenando em ordem alfabética

  // Função genérica para as ações temporárias
  const handleAction = (e) => {
    e.preventDefault(); // Previne o comportamento padrão (ex: marcar o checkbox)
    alert('Função será adicionada em breve');
  };

  const getQualidadeClass = (qualidade) => {
    if (qualidade === 'boa') return styles.qualidadeBoa;
    if (qualidade === 'ruim') return styles.qualidadeRuim;
    return styles.qualidadeNaoSei;
  };
  
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Produtos Salvos</h2>
        
        <div className={styles.searchContainer}>
          <input 
            type="text" 
            placeholder="Digite o nome ou marca do produto desejado"
            className={styles.searchInput}
          />
        </div>

        <div className={styles.productListContainer}>
          {mockProdutos.map(produto => (
            <div key={produto.id} className={styles.produtoItem}>
              <div className={styles.produtoCheckbox}>
                <input type="checkbox" onClick={handleAction}/>
              </div>
              <div className={styles.produtoInfo}>
                <div className={styles.produtoNome}>{produto.nome}</div>
                <div className={styles.produtoDetalhes}>
                  <span><strong>QTD Ultima Compra:</strong> {produto.qtd}</span>
                  <span><strong>R$ Ultima Compra:</strong> {produto.preco.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</span>
                  <span><strong>Marca:</strong> {produto.marca || 'N/A'}</span>
                  <span>
                    <strong>Qualidade:</strong> <span className={`${styles.qualidadeTag} ${getQualidadeClass(produto.qualidade)}`}>{produto.qualidade.replace('_', ' ')}</span>
                  </span>
                </div>
              </div>
              <div className={styles.produtoAcoes}>
                <button className={styles.actionButton} title="Editar Produto" onClick={handleAction}>✏️</button>
                <button className={`${styles.actionButton} ${styles.deleteButton}`} title="Excluir Produto" onClick={handleAction}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.footerActions}>
            <button className={styles.adicionarButton} onClick={handleAction}>
                Adicionar na Lista
            </button>
        </div>

      </div>
    </div>
  );
};

export default ModalBuscaProduto;