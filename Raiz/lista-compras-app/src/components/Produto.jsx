// src/components/Produto.jsx
import React, { useState, useEffect } from 'react';
import ModalConfirmacao from './ModalConfirmacao'; // Importação já existente, agora usada para salvar
import styles from './Produto.module.css';

const TrashIcon = () => <span style={{ cursor: 'pointer' }}>🗑️</span>;
// << NOVO ÍCONE >>
const SaveIcon = () => <span style={{ cursor: 'pointer' }}>💾</span>;


const Produto = ({
  idReact,
  nomeInicial = "Produto Exemplo",
  qtdInicial = 1,
  precoUnitarioInicial = 0,
  marcaNomeInicial = "Marca Exemplo",
  marcaQualidadeInicial = "nao_sei",
  compradoInicial = false,
  onProdutoDataChange,
  onAttemptDelete 
}) => {
  const [nome, setNome] = useState(nomeInicial);
  const [qtd, setQtd] = useState(String(qtdInicial));
  const [precoUnitario, setPrecoUnitario] = useState(String(precoUnitarioInicial));
  const [precoTotal, setPrecoTotal] = useState(0);
  const [marcaNome, setMarcaNome] = useState(marcaNomeInicial);
  const [marcaQualidade, setMarcaQualidade] = useState(marcaQualidadeInicial);
  const [comprado, setComprado] = useState(compradoInicial);

  // << NOVO ESTADO para o modal de salvar >>
  const [modalSalvarProps, setModalSalvarProps] = useState(null);

  useEffect(() => {
    const quantidadeNum = parseFloat(qtd);
    const precoUnitarioNum = parseFloat(precoUnitario);
    const totalCalculado = quantidadeNum * precoUnitarioNum;
    const novoPrecoTotal = isNaN(totalCalculado) ? 0 : totalCalculado;
    
    setPrecoTotal(novoPrecoTotal);

    if (onProdutoDataChange) {
      onProdutoDataChange(idReact, { 
        precoTotal: novoPrecoTotal, 
        comprado: comprado 
      });
    }
  }, [qtd, precoUnitario, comprado, idReact, onProdutoDataChange]); 

  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const handleNumberInputChange = (setter) => (event) => {
    const value = event.target.value;
    if (value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0) || value.endsWith('.')) {
        setter(value);
    }
  };

  const handleCheckboxChange = () => {
    const novoEstadoComprado = !comprado;
    setComprado(novoEstadoComprado);
  };

  const handleDeleteAttempt = () => {
    if (onAttemptDelete) {
      onAttemptDelete(idReact, nome); 
    }
  };

  // << NOVA FUNÇÃO para o clique no botão de salvar >>
  const handleSaveAttempt = () => {
    setModalSalvarProps({
      mensagem: "Função de salvar produto será adicionada em breve.",
      onConfirm: () => setModalSalvarProps(null),
      onCancel: () => setModalSalvarProps(null),
      textoConfirmar: 'Ok',
      textoCancelar: 'Fechar',
      tipo: 'padrao'
    });
  };

  const getMarcaQualidadeClass = () => {
    if (marcaQualidade === 'boa') return styles.marcaBoa;
    if (marcaQualidade === 'ruim') return styles.marcaRuim;
    return styles.marcaNaoSei;
  };

  return (
    <>
      <div className={`${styles.produtoRow} ${comprado ? styles.comprado : ''}`}>
        <div className={styles.colunaNome}>
          <input
            type="text" value={nome} onChange={handleInputChange(setNome)}
            placeholder="Nome do Produto" className={styles.inputField} disabled={comprado}
          />
        </div>

        {/* --- DEMAIS COLUNAS DE DADOS (QTD, PREÇO, MARCA...) --- */}
        <div className={styles.colunaQtd}>
          <label htmlFor={`qtd-${idReact}`} className={styles.label}>QTD</label>
          <input type="text" inputMode="decimal" id={`qtd-${idReact}`} value={qtd} onChange={handleNumberInputChange(setQtd)} className={`${styles.inputField} ${styles.inputNumber}`} disabled={comprado}/>
        </div>
        <div className={styles.colunaPrecoUnitario}>
          <label htmlFor={`precoU-${idReact}`} className={styles.label}>R$ U</label>
          <input type="text" inputMode="decimal" id={`precoU-${idReact}`} value={precoUnitario} step="0.01" onChange={handleNumberInputChange(setPrecoUnitario)} className={`${styles.inputField} ${styles.inputNumber}`} disabled={comprado} />
        </div>
        <div className={styles.colunaPrecoTotal}>
          <span className={styles.label}>R$ T</span>
          <span className={styles.valorCalculado}>{precoTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        </div>
        <div className={styles.colunaMarcaNome}>
          <label htmlFor={`marcaNome-${idReact}`} className={styles.label}>Marca</label>
          <input type="text" id={`marcaNome-${idReact}`} value={marcaNome} onChange={handleInputChange(setMarcaNome)} placeholder="Nome da Marca" className={styles.inputField} disabled={comprado} />
        </div>
        <div className={styles.colunaMarcaQualidade}>
          <span className={styles.label}>Qualid.</span>
          <select value={marcaQualidade} onChange={handleInputChange(setMarcaQualidade)} className={`${styles.selectField} ${getMarcaQualidadeClass()}`} disabled={comprado} >
            <option value="boa" className={styles.marcaBoaOption}>Boa</option>
            <option value="ruim" className={styles.marcaRuimOption}>Ruim</option>
            <option value="nao_sei" className={styles.marcaNaoSeiOption}>Não Sei</option>
          </select>
        </div>
        
        {/* << ALTERAÇÃO: Agrupando as ações finais em um único contêiner >> */}
        <div className={styles.areaAcoes}>
          <button onClick={handleSaveAttempt} className={`${styles.actionButton} ${styles.saveButton}`} title="Salvar produto" disabled={comprado}>
            <SaveIcon />
          </button>

          <div className={styles.compraContainer}>
            {/* O texto "Comprou?" só aparece se o produto NÃO estiver comprado */}
            {!comprado && <span className={styles.compraLabel}>Comprou?</span>}
            <input
              type="checkbox"
              checked={comprado}
              onChange={handleCheckboxChange}
              className={styles.checkbox}
              title={comprado ? "Desmarcar" : "Marcar como comprado"}
            />
          </div>

          <button onClick={handleDeleteAttempt} className={`${styles.actionButton} ${styles.deleteButton}`} title="Excluir produto" disabled={comprado}>
            <TrashIcon />
          </button>
        </div>
      </div>

      {/* Renderiza o novo modal se ele estiver ativo */}
      {modalSalvarProps && <ModalConfirmacao {...modalSalvarProps} />}
    </>
  );
};

export default Produto;