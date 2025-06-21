// src/App.jsx
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ListContainer from './components/ListContainer';
import Footer from './components/Footer';
import ModalConfirmacao from './components/ModalConfirmacao';
import ModalInput from './components/ModalInput';
// IMPORTAÇÃO CORRETA DO NOSSO NOVO COMPONENTE
import SQLiteTest from "./test/SQLiteTest"; 

import './App.css'; 

function App() {
  const [listas, setListas] = useState([]);
  const [nextListaId, setNextListaId] = useState(1);
  const [tetoGastos, setTetoGastos] = useState("0,00");
  
  const [isModalNomeOpen, setIsModalNomeOpen] = useState(false);
  const [modalTipoProps, setModalTipoProps] = useState(null);
  const [isModalTetoOpen, setIsModalTetoOpen] = useState(false);

  const [avisosTeto, setAvisosTeto] = useState({
    aviso100: false,
    aviso50: false,
    avisoEstourado: false
  });
  
  const LIMITE_AVISO = 100;
  const LIMITE_CRITICO = 50;

  useEffect(() => {
    setAvisosTeto({
      aviso100: false,
      aviso50: false,
      avisoEstourado: false,
    });
  }, [tetoGastos]);

  const handleProfileClick = () => {
    setModalTipoProps({
      mensagem: 'Função de perfil será adicionada em breve.',
      onConfirm: () => setModalTipoProps(null), onCancel: () => setModalTipoProps(null),
      textoConfirmar: 'Entendi', tipo: 'padrao'
    });
  };

  const handleCarregarListasClick = () => {
    setModalTipoProps({
      mensagem: 'Função de carregar listas salvas será adicionada em breve.',
      onConfirm: () => setModalTipoProps(null), onCancel: () => setModalTipoProps(null),
      textoConfirmar: 'Ok', tipo: 'padrao'
    });
  };

  const handleStartAddLista = () => setIsModalNomeOpen(true);

  const handleNomeConfirmado = (nomeLista) => {
    setIsModalNomeOpen(false); 

    const criarLista = (isEssencial) => {
      const novaLista = {
        id: nextListaId, nome: nomeLista, essencial: isEssencial, valor: 0
      };
      setListas(prevListas => [...prevListas, novaLista]);
      setNextListaId(prevId => prevId + 1);
      setModalTipoProps(null);
    };

    setModalTipoProps({
      mensagem: `A lista "${nomeLista}" é Essencial?`,
      onConfirm: () => criarLista(true), onCancel: () => criarLista(false),
      textoConfirmar: 'Sim, essencial', textoCancelar: 'Não, supérflua', tipo: 'padrao'
    });
  };
  
  const handleStartEditarTeto = () => setIsModalTetoOpen(true);
  
  const handleTetoConfirmado = (novoTetoString) => {
    const valorNumerico = parseFloat(novoTetoString.replace(",","."));
    if (!isNaN(valorNumerico) && valorNumerico >= 0) {
      setTetoGastos(valorNumerico.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    } else {
      alert("Valor inválido para teto de gastos.");
    }
    setIsModalTetoOpen(false);
  };
  
  const handleRemoverListaApp = (idLista) => setListas(p => p.filter(l => l.id !== idLista));
  const handleEditarNomeLista = (idLista, novoNome) => setListas(p => p.map(l => l.id === idLista ? { ...l, nome: novoNome } : l));
  const handleToggleEssencial = (idLista) => setListas(p => p.map(l => l.id === idLista ? { ...l, essencial: !l.essencial } : l));
  const handleValorListaChange = (idLista, novoValor) => setListas(p => p.map(l => l.id === idLista ? { ...l, valor: novoValor } : l));

  const tetoAtualNumerico = parseFloat(tetoGastos.replace(/\./g, "").replace(",", "."));
  const valorTotalCompraNumerico = listas.reduce((soma, lista) => soma + lista.valor, 0);

  useEffect(() => {
    if (tetoAtualNumerico <= 0) return;
    const diferenca = tetoAtualNumerico - valorTotalCompraNumerico;
    const fecharModalAviso = () => setModalTipoProps(null);

    if (valorTotalCompraNumerico >= tetoAtualNumerico && !avisosTeto.avisoEstourado) {
      setModalTipoProps({
        mensagem: '⚠️ ATENÇÃO: Você atingiu o teto de gastos!',
        onConfirm: fecharModalAviso, onCancel: fecharModalAviso,
        textoConfirmar: 'Ok', textoCancelar: 'Fechar', tipo: 'delete'
      });
      setAvisosTeto(prev => ({ ...prev, avisoEstourado: true }));
    }
    else if (diferenca <= LIMITE_CRITICO && !avisosTeto.aviso50) {
      setModalTipoProps({
        mensagem: `🚨 ALERTA: Faltam menos de R$ ${LIMITE_CRITICO.toFixed(2)} para atingir o teto!`,
        onConfirm: fecharModalAviso, onCancel: fecharModalAviso,
        textoConfirmar: 'Ok', tipo: 'delete'
      });
      setAvisosTeto(prev => ({ ...prev, aviso50: true }));
    }
    else if (diferenca <= LIMITE_AVISO && !avisosTeto.aviso100) {
      setModalTipoProps({
        mensagem: `🤔 CUIDADO: Faltam menos de R$ ${LIMITE_AVISO.toFixed(2)} para atingir o teto.`,
        onConfirm: fecharModalAviso, onCancel: fecharModalAviso,
        textoConfirmar: 'Ok', tipo: 'padrao'
      });
      setAvisosTeto(prev => ({ ...prev, aviso100: true }));
    }
  }, [valorTotalCompraNumerico, tetoAtualNumerico, avisosTeto, LIMITE_AVISO, LIMITE_CRITICO]);

  const getTetoStatusClass = () => {
    if (tetoAtualNumerico <= 0) return '';
    const diferenca = tetoAtualNumerico - valorTotalCompraNumerico;
    if (valorTotalCompraNumerico >= tetoAtualNumerico) return 'teto-estourado';
    if (diferenca <= LIMITE_CRITICO) return 'teto-critico';
    if (diferenca <= LIMITE_AVISO) return 'teto-aviso';
    return '';
  };

  const valorTotalCompraFormatado = valorTotalCompraNumerico.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="app-container">
      {/* ===== INÍCIO DA SEÇÃO DE TESTE ===== */}
      {/* Adicionei o componente de teste aqui no topo para fácil visualização */}
      <SQLiteTest />
      {/* ===== FIM DA SEÇÃO DE TESTE ===== */}
      
      <Header
        onProfileClick={handleProfileClick}
        onAddListClick={handleStartAddLista}
        onCarregarListasClick={handleCarregarListasClick}
      />

      <ListContainer 
        listas={listas}
        onRemoveLista={handleRemoverListaApp}
        onNomeChange={handleEditarNomeLista}
        onToggleEssencial={handleToggleEssencial}
        onTotalChange={handleValorListaChange}
      />
      
      <Footer
        valorTotal={valorTotalCompraFormatado}
        tetoGastos={tetoGastos}
        onEditTeto={handleStartEditarTeto}
        tetoStatusClass={getTetoStatusClass()}
      />
      
      <ModalInput
        isOpen={isModalNomeOpen}
        onConfirm={handleNomeConfirmado}
        onCancel={() => setIsModalNomeOpen(false)}
        titulo="Qual o nome da nova lista?"
        placeholder="Ex: Compras da Semana"
        textoConfirmar="Próximo"
      />
      
      {modalTipoProps && <ModalConfirmacao {...modalTipoProps} />}
      
      <ModalInput
        isOpen={isModalTetoOpen}
        onConfirm={handleTetoConfirmado}
        onCancel={() => setIsModalTetoOpen(false)}
        titulo="Defina o teto de gastos"
        placeholder="Ex: 500,00"
        valorInicial={tetoGastos}
        inputMode="decimal"
        textoConfirmar="Salvar"
      />
    </div>
  );
}

export default App;