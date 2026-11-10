// Provedor Anthropic (Claude) — Messages API via fetch, com saída JSON estruturada.

import { extrairJSON } from "@/lib/normalizar";
import { ErroIA, SCHEMA_RECEITAS, SYSTEM_PROMPT, fetchComTimeout, montarPedido } from "./prompt";

const API_URL = "https://api.anthropic.com/v1/messages";
const API_VERSION = "2026-10-21";
export const MODELO_PADRAO_ANTHROPIC = "claude-opus-5-5";

// Modelos que aceitam o fallback automático do servidor em caso de recusa.
const MODELOS_COM_FALLBACK = [
  "claude-fable-5-2",
  "claude-fable-5-1",
  "claude-opus-5-5",
  "claude-opus-5",
  "claude-sonnet-5-5",
];

export async function gerarComAnthropic(dados, apiKey) {
  const modelo = process.env.ANTHROPIC_MODEL?.trim() || MODELO_PADRAO_ANTHROPIC;
  const esforco = process.env.ANTHROPIC_EFFORT?.trim() || "medium";
  const usarFallback = MODELOS_COM_FALLBACK.includes(modelo);

  const corpo = {
    model: modelo,
    max_tokens: 16000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: montarPedido(dados) }],
    output_config: {
      effort: esforco,
      format: { type: "json_schema", schema: SCHEMA_RECEITAS },
    },
  };
  if (usarFallback) corpo.fallbacks = "default";

  const headers = {
    "content-type": "application/json",
    "x-api-key": apiKey,
    "anthropic-version": API_VERSION,
  };
  if (usarFallback) headers["anthropic-beta"] = "server-side-fallback-2026-07-01";

  const resposta = await fetchComTimeout(
    API_URL,
    { method: "POST", headers, body: JSON.stringify(corpo) },
    "Anthropic"
  );

  const json = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    const detalhe = json?.error?.message || `HTTP ${resposta.status}`;
    console.error("[api/receitas] Erro da Anthropic:", resposta.status, detalhe);
    if (resposta.status === 401) throw new ErroIA("Chave de API inválida. Verifique o ANTHROPIC_API_KEY.", 500);
    if (resposta.status === 429) throw new ErroIA("Muitas requisições no momento. Aguarde um pouco e tente de novo.", 429);
    if (resposta.status === 529 || resposta.status >= 500)
      throw new ErroIA("A API da Anthropic está sobrecarregada. Tente novamente em instantes.", 503);
    throw new ErroIA(`Erro ao gerar receitas: ${detalhe}`, 502);
  }

  if (json?.stop_reason === "refusal") {
    throw new ErroIA("A IA não pôde atender a este pedido. Tente outros ingredientes.", 422);
  }
  if (json?.stop_reason === "max_tokens") {
    throw new ErroIA("A resposta da IA veio incompleta. Tente novamente.", 502);
  }

  const texto = (json?.content ?? [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");

  const parsed = extrairJSON(texto);
  if (!parsed) throw new ErroIA("A IA retornou um formato inesperado. Tente novamente.", 502);

  return { parsed, modelo: json?.model || modelo };
}
