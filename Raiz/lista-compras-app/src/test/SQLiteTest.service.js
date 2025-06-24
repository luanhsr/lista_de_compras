// src/test/SQLiteTest.service.js
import { db } from '../data/db';

export const addText = async (text) => {
  if (!text || !text.trim()) {
    throw new Error("O texto não pode estar vazio.");
  }
  return await db.textos.add({ texto: text });
};

export const getAllTexts = async () => {
  const allTexts = await db.textos.toArray();
  return allTexts.reverse();
};

export const updateText = async (id, newText) => {
  if (!newText || !newText.trim()) {
    throw new Error("O novo texto não pode estar vazio.");
  }
  return await db.textos.update(id, { texto: newText });
};

export const deleteText = async (id) => {
  return await db.textos.delete(id);
};