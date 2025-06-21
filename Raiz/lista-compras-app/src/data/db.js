// src/data/db.js
import Dexie from 'dexie';

// 1. Crie uma classe que herda de Dexie
export class MinhaAppDB extends Dexie {
  // 2. Declare as "tabelas" (object stores) como propriedades da classe
  textos; // Esta será nossa tabela para salvar os textos de teste

  constructor() {
    // 3. Dê um nome ao seu banco de dados
    super('meuBancoDeDadosLocal');

    // 4. Defina o schema do banco de dados
    this.version(1).stores({
      // A sintaxe é 'nomeDaTabela: "++id, nomeDoCampo1, nomeDoCampo2, ..."'
      // '++id' significa que teremos um campo 'id' que se auto-incrementa (chave primária)
      // 'texto' é o campo onde vamos armazenar nosso texto.
      textos: '++id, texto',
    });

    // 5. Mapeie a propriedade da classe para a tabela real
    this.textos = this.table('textos');
  }
}

// 6. Exporte uma instância única (singleton) do seu banco de dados
export const db = new MinhaAppDB();