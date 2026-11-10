import { gerarComAnthropic } from "./anthropic";
import { gerarComGemini } from "./gemini";

export { ErroIA } from "./prompt";

const PROVEDORES = {
  gemini: { nome: "Google Gemini", envChave: "GEMINI_API_KEY", gerar: gerarComGemini },
  anthropic: { nome: "Anthropic Claude", envChave: "ANTHROPIC_API_KEY", gerar: gerarComAnthropic },
};

/**
 * Decide qual IA usar:
 * - AI_PROVIDER=gemini|anthropic força um provedor (se a chave dele existir);
 * - senão, usa o primeiro com chave configurada (Gemini, que é gratuito, primeiro);
 * - sem nenhuma chave, retorna null (modo demonstração).
 */
export function escolherProvedor() {
  const preferido = process.env.AI_PROVIDER?.trim().toLowerCase();
  const ordem = PROVEDORES[preferido] ? [preferido] : ["gemini", "anthropic"];

  for (const id of ordem) {
    const p = PROVEDORES[id];
    const chave = process.env[p.envChave]?.trim();
    if (chave) return { id, nome: p.nome, chave, gerar: p.gerar };
  }
  return null;
}
