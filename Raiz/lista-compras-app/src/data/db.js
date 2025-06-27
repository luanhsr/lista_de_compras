// src/data/db.js
import Dexie from 'dexie';

export class MinhaAppDB extends Dexie {
  textos;
  produtos;

  constructor() {
    super('meuBancoDeDadosLocal');

    this.version(1).stores({
      textos: '++id, texto',
    });

    this.version(2).stores({
      textos: '++id, texto',
      produtos: '++id, nome, qtd, precoUnitario, marcaNome, marcaQualidade, comprado'
    }).upgrade(tx => {
      return tx;
    });

    this.textos = this.table('textos');
    this.produtos = this.table('produtos');
  }
}

export const db = new MinhaAppDB();