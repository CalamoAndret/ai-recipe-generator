// Provedor Google Gemini (tem plano gratuito: https://aistudio.google.com/apikey)
// Usa a Interactions API via fetch, com saída JSON estruturada.

import { extrairJSON } from "@/lib/normalizar";
import { ErroIA, SCHEMA_RECEITAS, SYSTEM_PROMPT, fetchComTimeout, montarPedido } from "./prompt";

const API_URL = "https://generativelanguage.googleapis.com/v1beta/interactions";
const API_REVISION = "2026-05-20";
export const MODELO_PADRAO_GEMINI = "gemini-3.8-flash";

/** Extrai o texto final da resposta, tolerando as variações de formato da API. */
function extrairTexto(json) {
  if (typeof json?.output_text === "string" && json.output_text.trim()) return json.output_text;

  const textoDe = (conteudo) =>
    (Array.isArray(conteudo) ? conteudo : [conteudo])
      .filter((c) => c && typeof c.text === "string" && (!c.type || c.type === "text"))
      .map((c) => c.text)
      .join("");

  // Formato atual: steps[].content[].text — pega o último passo que tenha texto.
  if (Array.isArray(json?.steps)) {
    for (let i = json.steps.length - 1; i >= 0; i--) {
      const t = textoDe(json.steps[i]?.content);
      if (t.trim()) return t;
    }
  }
  // Formato anterior: outputs[].text
  if (Array.isArray(json?.outputs)) {
    for (let i = json.outputs.length - 1; i >= 0; i--) {
      const t = textoDe(json.outputs[i]);
      if (t.trim()) return t;
    }
  }
  return "";
}

export async function gerarComGemini(dados, apiKey) {
  const modelo = process.env.GEMINI_MODEL?.trim() || MODELO_PADRAO_GEMINI;

  const resposta = await fetchComTimeout(
    API_URL,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-goog-api-key": apiKey,
        "Api-Revision": API_REVISION,
      },
      body: JSON.stringify({
        model: modelo,
        system_instruction: SYSTEM_PROMPT,
        input: montarPedido(dados),
        response_format: {
          type: "text",
          mime_type: "application/json",
          schema: SCHEMA_RECEITAS,
        },
      }),
    },
    "Google Gemini"
  );

  const bruto = await resposta.json().catch(() => null);
  // Erros às vezes vêm embrulhados em array: [{ error: {...} }]
  const json = Array.isArray(bruto) ? bruto[0] : bruto;

  if (!resposta.ok) {
    const detalhe = json?.error?.message || `HTTP ${resposta.status}`;
    console.error("[api/receitas] Erro do Gemini:", resposta.status, detalhe);
    if (resposta.status === 400 && /api key/i.test(detalhe))
      throw new ErroIA("Chave do Gemini inválida. Verifique o GEMINI_API_KEY.", 500);
    if (resposta.status === 401 || resposta.status === 403)
      throw new ErroIA("Chave do Gemini sem permissão. Verifique o GEMINI_API_KEY.", 500);
    if (resposta.status === 404)
      throw new ErroIA(`Modelo "${modelo}" não encontrado. Ajuste o GEMINI_MODEL.`, 500);
    if (resposta.status === 429)
      throw new ErroIA("Limite gratuito do Gemini atingido. Aguarde um pouco e tente de novo.", 429);
    if (resposta.status >= 500) throw new ErroIA("O Gemini está instável no momento. Tente novamente.", 503);
    throw new ErroIA(`Erro ao gerar receitas: ${detalhe}`, 502);
  }

  const texto = extrairTexto(json);
  if (!texto) {
    console.error("[api/receitas] Resposta do Gemini sem texto:", JSON.stringify(json)?.slice(0, 800));
    throw new ErroIA("O Gemini não retornou receitas. Tente outros ingredientes.", 502);
  }

  const parsed = extrairJSON(texto);
  if (!parsed) throw new ErroIA("A IA retornou um formato inesperado. Tente novamente.", 502);

  return { parsed, modelo: json?.model || modelo };
}
