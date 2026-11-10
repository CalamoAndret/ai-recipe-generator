import { DIFICULDADES } from "./constants";
import { normalizarTexto, usuarioTem } from "./ingredientes";

function texto(valor, padrao = "", max = 600) {
  if (typeof valor !== "string" && typeof valor !== "number") return padrao;
  const t = String(valor).replace(/\s+/g, " ").trim();
  return t ? t.slice(0, max) : padrao;
}

function numero(valor, { min = 0, max = 10000, casas = 0 } = {}) {
  let n = typeof valor === "number" ? valor : parseFloat(String(valor ?? "").replace(",", "."));
  if (!Number.isFinite(n)) return 0;
  n = Math.min(max, Math.max(min, n));
  const fator = 10 ** casas;
  return Math.round(n * fator) / fator;
}

function dificuldade(valor) {
  const v = normalizarTexto(valor);
  if (v.startsWith("dif") || v === "hard") return "Difícil";
  if (v.startsWith("med") || v === "medium") return "Média";
  if (v.startsWith("fac") || v === "easy") return "Fácil";
  return DIFICULDADES[0];
}

/**
 * Termo (em inglês) para buscar a foto: só letras, números, espaço e hífen,
 * no máximo 5 palavras. Sem termo válido, cai no nome do prato sem acentos.
 */
function termoImagem(valor, nome) {
  const limpar = (t) =>
    normalizarTexto(t)
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 5)
      .join(" ")
      .slice(0, 60);
  return limpar(typeof valor === "string" ? valor : "") || limpar(nome);
}

function slug(t) {
  return normalizarTexto(t).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 50);
}

/**
 * Valida e normaliza uma receita vinda da IA (ou do modo demo).
 * Retorna null se a receita não tiver o mínimo necessário.
 */
export function normalizarReceita(bruta, ingredientesUsuario = [], porcoesPadrao = 2) {
  if (!bruta || typeof bruta !== "object") return null;

  const nome = texto(bruta.nome, "", 120);
  if (!nome) return null;

  const ingredientes = (Array.isArray(bruta.ingredientes) ? bruta.ingredientes : [])
    .map((i) => {
      if (typeof i === "string") i = { nome: i };
      if (!i || typeof i !== "object") return null;
      const nomeIng = texto(i.nome, "", 80);
      if (!nomeIng) return null;
      return {
        nome: nomeIng,
        quantidade: texto(i.quantidade, "a gosto", 60),
        temEmCasa: i.temEmCasa === true || usuarioTem(nomeIng, ingredientesUsuario),
      };
    })
    .filter(Boolean)
    .slice(0, 30);

  const passos = (Array.isArray(bruta.passos) ? bruta.passos : [])
    .map((p) => texto(typeof p === "object" && p ? p.descricao ?? p.texto : p, "", 500))
    .filter(Boolean)
    .slice(0, 20);

  if (ingredientes.length === 0 || passos.length === 0) return null;

  const macros = bruta.macros && typeof bruta.macros === "object" ? bruta.macros : {};

  return {
    id: `${slug(nome)}-${Math.random().toString(36).slice(2, 8)}`,
    nome,
    descricao: texto(bruta.descricao, "", 300),
    tempoMinutos: numero(bruta.tempoMinutos ?? bruta.tempo, { min: 1, max: 600 }) || 30,
    dificuldade: dificuldade(bruta.dificuldade),
    porcoes: numero(bruta.porcoes, { min: 1, max: 24 }) || porcoesPadrao,
    macros: {
      calorias: numero(macros.calorias, { max: 5000 }),
      proteina: numero(macros.proteina, { max: 500, casas: 1 }),
      carboidratos: numero(macros.carboidratos, { max: 1000, casas: 1 }),
      gordura: numero(macros.gordura, { max: 500, casas: 1 }),
    },
    ingredientes,
    passos,
    dica: texto(bruta.dica, "", 300),
    termoBuscaImagem: termoImagem(bruta.termoBuscaImagem, nome),
  };
}

/** Aceita { receitas: [...] } ou um array direto; devolve até 3 receitas válidas. */
export function normalizarResposta(dados, ingredientesUsuario, porcoes) {
  const lista = Array.isArray(dados) ? dados : Array.isArray(dados?.receitas) ? dados.receitas : [];
  return lista
    .map((r) => normalizarReceita(r, ingredientesUsuario, porcoes))
    .filter(Boolean)
    .slice(0, 3);
}

/** Extrai JSON de um texto, tolerando cercas ```json e texto extra ao redor. */
export function extrairJSON(textoBruto) {
  const t = String(textoBruto ?? "").trim();
  try {
    return JSON.parse(t);
  } catch {}
  const semCerca = t.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  try {
    return JSON.parse(semCerca);
  } catch {}
  const inicio = t.indexOf("{");
  const fim = t.lastIndexOf("}");
  if (inicio !== -1 && fim > inicio) {
    try {
      return JSON.parse(t.slice(inicio, fim + 1));
    } catch {}
  }
  return null;
}
