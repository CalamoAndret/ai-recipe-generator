import { BASICOS } from "./constants";

/** Minúsculas, sem acentos, sem espaços extras. */
export function normalizarTexto(texto) {
  return String(texto ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function singular(palavra) {
  if (palavra.length > 3 && palavra.endsWith("oes")) return palavra.slice(0, -3) + "ao";
  if (palavra.length > 3 && palavra.endsWith("s")) return palavra.slice(0, -1);
  return palavra;
}

function chave(texto) {
  return normalizarTexto(texto)
    .split(/[\s-]+/)
    .filter(Boolean)
    .map(singular)
    .join(" ");
}

/**
 * Verifica se um ingrediente da receita corresponde a algum ingrediente
 * que o usuário tem em casa (comparação tolerante a acento e plural).
 */
export function usuarioTem(nomeIngrediente, ingredientesUsuario) {
  const alvo = chave(nomeIngrediente);
  if (!alvo) return false;
  if (BASICOS.some((b) => alvo === chave(b) || alvo.startsWith(chave(b) + " "))) return true;
  return ingredientesUsuario.some((ing) => {
    const k = chave(ing);
    if (!k) return false;
    const regex = new RegExp(`(^| )${k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}( |$)`);
    return regex.test(alvo) || alvo === k;
  });
}
