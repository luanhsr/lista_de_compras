// src/test/SQLiteTest.jsx
import React, { useState, useEffect } from 'react';
import { addText, getAllTexts, updateText, deleteText } from './SQLiteTest.service';

const SQLiteTest = () => {
  const [inputText, setInputText] = useState('');
  const [savedTexts, setSavedTexts] = useState([]);
  const [message, setMessage] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const fetchSavedTexts = async () => {
    try {
      const texts = await getAllTexts();
      setSavedTexts(texts);
    } catch (error) {
      console.error("Erro ao buscar textos:", error);
      setMessage('Falha ao carregar textos.');
    }
  };

  useEffect(() => {
    fetchSavedTexts();
  }, []);

  const handleSaveText = async () => {
    try {
      await addText(inputText);
      setMessage(`Texto salvo com sucesso.`);
      setInputText('');
      fetchSavedTexts();
    } catch (error) {
      console.error("Erro ao salvar o texto:", error);
      setMessage(`Erro: ${error.message}`);
    }
  };

  const handleDeleteText = async (idToDelete) => {
    try {
      await deleteText(idToDelete);
      setMessage('Texto excluído com sucesso.');
      fetchSavedTexts();
    } catch (error) {
      console.error("Erro ao excluir texto:", error);
      setMessage('Falha ao excluir o texto.');
    }
  };

  const handleStartEditing = (item) => {
    setEditingId(item.id);
    setEditText(item.texto);
  };

  const handleCancelEditing = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleUpdateText = async () => {
    try {
      await updateText(editingId, editText);
      setMessage('Texto atualizado com sucesso.');
      handleCancelEditing();
      fetchSavedTexts();
    } catch (error)
    {
      console.error("Erro ao atualizar texto:", error);
      setMessage(`Falha ao atualizar o texto: ${error.message}`);
    }
  };

  const styles = {
    container: {
      padding: '20px',
      margin: '20px auto',
      maxWidth: '600px',
      backgroundColor: '#2a2a2a',
      borderRadius: '8px',
      border: '1px solid #333',
    },
    input: {
      width: 'calc(100% - 110px)',
      padding: '10px',
      marginRight: '10px',
      borderRadius: '4px',
      border: '1px solid #555',
      backgroundColor: '#1e1e1e',
      color: '#e0e0e0',
    },
    button: {
      padding: '10px 20px',
      cursor: 'pointer',
      backgroundColor: '#00bcd4',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontWeight: 'bold',
    },
    list: {
      listStyleType: 'none',
      padding: 0,
      marginTop: '20px',
    },
    listItem: {
      backgroundColor: '#1e1e1e',
      padding: '10px',
      borderBottom: '1px solid #333',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '10px',
    },
    listItemText: {
      flexGrow: 1,
      overflowWrap: 'break-word',
      wordBreak: 'break-word',
    },
    editInput: {
      flexGrow: 1,
      padding: '8px',
      borderRadius: '4px',
      border: '1px solid #00bcd4',
      backgroundColor: '#333',
      color: '#e0e0e0',
    },
    actionsContainer: {
      display: 'flex',
      gap: '8px',
      flexShrink: 0,
    },
    editButton: {
      padding: '5px 10px',
      backgroundColor: '#ff9800',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    saveButton: {
      padding: '5px 10px',
      backgroundColor: '#4caf50',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    cancelButton: {
      padding: '5px 10px',
      backgroundColor: '#757575',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    deleteButton: {
      padding: '5px 10px',
      backgroundColor: '#f44336',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    message: {
      marginTop: '10px',
      color: '#ff9800',
    }
  };

  return (
    <div style={styles.container}>
      <h2>Teste de Persistência com IndexedDB (via Dexie.js)</h2>
      <div>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Digite um texto para salvar"
          style={styles.input}
        />
        <button onClick={handleSaveText} style={styles.button}>
          Salvar
        </button>
      </div>
      {message && <p style={styles.message}>{message}</p>}

      <h3>Textos Salvos:</h3>
      {savedTexts.length > 0 ? (
        <ul style={styles.list}>
          {savedTexts.map((item) => (
            <li key={item.id} style={styles.listItem}>
              {editingId === item.id ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateText()}
                    style={styles.editInput}
                    autoFocus
                  />
                  <div style={styles.actionsContainer}>
                    <button onClick={handleUpdateText} style={styles.saveButton}>Salvar</button>
                    <button onClick={handleCancelEditing} style={styles.cancelButton}>Cancelar</button>
                  </div>
                </>
              ) : (
                <>
                  <span style={styles.listItemText}>{item.texto}</span>
                  <div style={styles.actionsContainer}>
                    <button onClick={() => handleStartEditing(item)} style={styles.editButton}>Editar</button>
                    <button onClick={() => handleDeleteText(item.id)} style={styles.deleteButton}>Excluir</button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhum texto salvo ainda.</p>
      )}
    </div>
  );
};

export default SQLiteTest;