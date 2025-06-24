// src/data/db.js
import Dexie from 'dexie';

export class MinhaAppDB extends Dexie {
  textos;

  constructor() {
    super('meuBancoDeDadosLocal');

    this.version(1).stores({
      textos: '++id, texto',
    });

    this.textos = this.table('textos');
  }
}

export const db = new MinhaAppDB();