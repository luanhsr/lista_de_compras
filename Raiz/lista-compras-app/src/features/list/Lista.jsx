// src/components/Lista.jsx
import React, { useState, useEffect } from 'react';
import Produto from '../produto/Produto';
import ModalConfirmacao from '../modal-confirmacao/ModalConfirmacao';
import styles from './Lista.module.css';

const TrashIcon = () => <span style={{ cursor: 'pointer' }}>🗑️</span>;
const PlusIcon = () => <span style={{fontSize: '1.2em'}}>+</span>;

const Lista = ({ id: idLista, nomeInicial, essencialInicial, onRemoveLista, onNomeChange, onToggleEssencial, onTotalChange }) => {
  const [nomeListaState, setNomeListaState] = useState(nomeInicial);
  const [essencialState, setEssencialState] = useState(essencialInicial);
  const [isExpanded, setIsExpanded] = useState(false);
  const [produtos, setProdutos] = useState([]); 
  const [nextProdutoId, setNextProdutoId] = useState(1);
  const [valorTotalLista, setValorTotalLista] = useState("R$ 0,00");

  const [modalListaConfirmacaoProps, setModalListaConfirmacaoProps] = useState(null); 
  const [modalProdutoConfirmacaoProps, setModalProdutoConfirmacaoProps] = useState(null); 

  const [highlightClass, setHighlightClass] = useState('');

  useEffect(() => {
    setHighlightClass(styles.highlightAnimation);
    const timer = setTimeout(() => {
      setHighlightClass('');
    }, 5000); 

    return () => clearTimeout(timer);
  }, []); 


  const handleProdutoDataChangeNoLista = (idReactProduto, dadosProdutoAtualizado) => {
    setProdutos(prevProdutos =>
      prevProdutos.map(p =>
        p.idReact === idReactProduto
          ? { ...p, 
              precoTotal: dadosProdutoAtualizado.precoTotal, 
              comprado: dadosProdutoAtualizado.comprado
            }
          : p
      )
    );
  };
  
  useEffect(() => {
    setEssencialState(essencialInicial);

    const totalDaListaNumerico = produtos
      .filter(p => p.comprado) 
      .reduce((sum, p) => sum + (p.precoTotal || 0), 0);
      
    setValorTotalLista(totalDaListaNumerico.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
    
    if (onTotalChange) {
      onTotalChange(idLista, totalDaListaNumerico);
    }
    
  }, [produtos, essencialInicial, idLista, onTotalChange]);


  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAddProduto = () => {
    const qtdPadrao = 1;
    const precoUnitarioPadrao = 0;
    const precoTotalPadrao = qtdPadrao * precoUnitarioPadrao;

    const novoProdutoData = {
      idReact: `produto-${idLista}-${nextProdutoId}`, 
      nomeInicial: `Novo Produto ${nextProdutoId}`,
      qtdInicial: qtdPadrao,
      precoUnitarioInicial: precoUnitarioPadrao,
      marcaNomeInicial: "",
      marcaQualidadeInicial: "nao_sei",
      compradoInicial: false,
      comprado: false, 
      precoTotal: precoTotalPadrao,
    };
    setProdutos(prevProdutos => [...prevProdutos, novoProdutoData]);
    setNextProdutoId(prevId => prevId + 1);
    if (!isExpanded) setIsExpanded(true);
  };
  
  const handleNomeListaChange = (e) => {
    const novoNome = e.target.value;
    setNomeListaState(novoNome);
    onNomeChange(idLista, novoNome);
  };
  
  const handleAlterarEssencial = () => {
    onToggleEssencial(idLista);
  };

  const tentarExcluirLista = () => {
    setModalListaConfirmacaoProps({
      mensagem: `Deseja realmente excluir a Lista "${nomeListaState}"? Todos os produtos nela serão removidos.`,
      tipo: 'delete',
      onConfirm: () => {
        onRemoveLista(); 
        setModalListaConfirmacaoProps(null);
      },
      onCancel: () => {
        setModalListaConfirmacaoProps(null);
      }
    });
  };

  const handleAttemptDeleteProduto = (idProdutoParaDeletar, nomeProdutoParaDeletar) => {
    setModalProdutoConfirmacaoProps({
      mensagem: `Deseja realmente excluir o produto "${nomeProdutoParaDeletar || 'este produto'}"?`,
      tipo: 'delete',
      onConfirm: () => handleConfirmDeleteProduto(idProdutoParaDeletar),
      onCancel: () => setModalProdutoConfirmacaoProps(null) 
    });
  };

  const handleConfirmDeleteProduto = (idProdutoParaDeletar) => {
    setProdutos(prevProdutos => prevProdutos.filter(p => p.idReact !== idProdutoParaDeletar));
    setModalProdutoConfirmacaoProps(null); 
  };


  return (
    <>
      <section 
        className={`${styles.listaSection} ${essencialState ? styles.essencialBg : styles.superfluaBg}`}
      >
         <header className={styles.listaHeader}>
          <div className={styles.identificacaoLista} onClick={handleAlterarEssencial} title={essencialState ? "Lista Essencial (clique para alterar)" : "Lista Supérflua (clique para alterar)"}>
            <span className={styles.essencialIcon}>{essencialState ? '🚨' : '😥'}</span>
            <input
              type="text"
              value={nomeListaState}
              onChange={handleNomeListaChange}
              onClick={(e) => { e.stopPropagation(); }}
              className={styles.listaNomeInput}
              title={`Clique para editar o nome da lista: ${nomeListaState}`}
            />
          </div>
          <div className={styles.controlesLista}>
            <span className={styles.valorTotalDisplay} title="Valor total dos itens comprados nesta lista">
              Total: {valorTotalLista}
            </span>
            <button onClick={tentarExcluirLista} className={`${styles.controleButton} ${styles.deleteListaButton}`} title="Excluir Lista">
              <TrashIcon />
            </button>
            <button 
              onClick={handleToggleExpand} 
              className={`${styles.controleButton} ${styles.expandButton} ${highlightClass}`} 
              title={isExpanded ? "Colapsar Lista" : "Expandir Lista"}
            >
              {isExpanded ? '▲' : '▼'}
            </button>
          </div>
        </header>

        {isExpanded && (
          <div className={styles.listaBody}>
            <div className={styles.addProdutoArea}>
              <button onClick={handleAddProduto} className={styles.addProdutoButtonLista} title="Adicionar novo produto a esta lista">
                <PlusIcon /> Adicionar Produto
              </button>
            </div>
            <div className={styles.produtosContainer}>
              {produtos.length === 0 ? (
                <p className={styles.semProdutosMsg}>Nenhum produto adicionado a esta lista ainda.</p>
              ) : (
                produtos.map(produto => ( 
                  <Produto
                    key={produto.idReact}
                    idReact={produto.idReact} 
                    nomeInicial={produto.nomeInicial} 
                    qtdInicial={produto.qtdInicial}
                    precoUnitarioInicial={produto.precoUnitarioInicial}
                    marcaNomeInicial={produto.marcaNomeInicial}
                    marcaQualidadeInicial={produto.marcaQualidadeInicial}
                    compradoInicial={produto.comprado}
                    onProdutoDataChange={handleProdutoDataChangeNoLista}
                    onAttemptDelete={handleAttemptDeleteProduto} 
                  />
                ))
              )}
            </div>
          </div>
        )}
      </section>

      {modalListaConfirmacaoProps && (
        <ModalConfirmacao
          mensagem={modalListaConfirmacaoProps.mensagem}
          onConfirm={modalListaConfirmacaoProps.onConfirm}
          onCancel={modalListaConfirmacaoProps.onCancel}
          tipo={modalListaConfirmacaoProps.tipo}
        />
      )}

      {modalProdutoConfirmacaoProps && (
        <ModalConfirmacao
          mensagem={modalProdutoConfirmacaoProps.mensagem}
          onConfirm={modalProdutoConfirmacaoProps.onConfirm}
          onCancel={modalProdutoConfirmacaoProps.onCancel}
          tipo={modalProdutoConfirmacaoProps.tipo}
        />
      )}
    </>
  );
};

export default Lista;