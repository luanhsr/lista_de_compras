import { db } from '../../data/db';

export const addProduto = async (produto) => {
  if (!produto || !produto.nome || !produto.nome.trim()) {
    throw new Error("O nome do produto não pode estar vazio.");
  }
  
  const produtoParaSalvar = {
    nome: produto.nome,
    qtd: parseFloat(produto.qtd) || 0,
    precoUnitario: parseFloat(produto.precoUnitario) || 0,
    marcaNome: produto.marcaNome,
    marcaQualidade: produto.marcaQualidade,
    comprado: produto.comprado
  };

  return await db.produtos.add(produtoParaSalvar);
};