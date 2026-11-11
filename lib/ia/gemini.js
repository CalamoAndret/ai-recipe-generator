// Provedor Google Gemini (tem plano gratuito: https://aistudio.google.com/apikey)
// Usa a Interactions API via fetch, com saída JSON estruturada.
// Se o modelo principal estiver sobrecarregado, tenta modelos reserva automaticamente.

import { extrairJSON } from "@/lib/normalizar";
import { ErroIA, SCHEMA_RECEITAS, SYSTEM_PROMPT, fetchComTimeout, montarPedido } from "./prompt";

const API_URL = "https://generativelanguage.googleapis.com/v1beta/interactions";
const API_REVISION = "2026-05-20";
export const MODELO_PADRAO_GEMINI = "gemini-3.8-flash";
// Modelos "lite" do plano gratuito costumam continuar disponíveis quando os "flash" lotam.
const MODELOS_RESERVA_PADRAO = ["gemini-3.5-flash-lite", "gemini-3.1-flash-lite"];

const ORCAMENTO_MS = 55_000; // cabe no limite de 60 s da função na Vercel
const TIMEOUT_TENTATIVA_MS = 22_000; // tentativas que ainda têm reserva depois
const STATUS_TENTAR_OUTRO = new Set([429, 500, 502, 503, 504]);

function listaModelos() {
  const principal = process.env.GEMINI_MODEL?.trim() || MODELO_PADRAO_GEMINI;
  const reservaEnv = process.env.GEMINI_FALLBACK_MODELS?.trim();
  const reserva = reservaEnv
    ? reservaEnv.split(",").map((m) => m.trim()).filter(Boolean)
    : MODELOS_RESERVA_PADRAO;
  return [...new Set([principal, ...reserva])];
}

/** Extrai o texto final da resposta, tolerando as variações de formato da API. */
function extrairTexto(json) {
  if (typeof json?.output_text === "string" && json.output_text.trim()) return json.output_text;

  const textoDe = (conteudo) =>
    (Array.isArray(conteudo) ? conteudo : [conteudo])
      .filter((c) => c && typeof c.text === "string" && (!c.type || c.type === "text"))
      .map((c) => c.text)
      .join("");

  // Formato atual: steps[].content[].text (passos "thought" não têm texto) — pega o último com texto.
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

/** Uma chamada a um modelo. Retorna { ok, status, json } sem lançar erro HTTP. */
async function chamarModelo(modelo, dados, apiKey, timeoutMs) {
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
    "Google Gemini",
    timeoutMs
  );
  const bruto = await resposta.json().catch(() => null);
  // Erros às vezes vêm embrulhados em array: [{ error: {...} }]
  const json = Array.isArray(bruto) ? bruto[0] : bruto;
  return { ok: resposta.ok, status: resposta.status, json };
}

function erroDefinitivo(status, detalhe, modelo) {
  if (status === 400 && /api key/i.test(detalhe))
    return new ErroIA("Chave do Gemini inválida. Verifique o GEMINI_API_KEY.", 500);
  if (status === 401 || status === 403)
    return new ErroIA("Chave do Gemini sem permissão. Verifique o GEMINI_API_KEY.", 500);
  if (status === 404) return new ErroIA(`Modelo "${modelo}" não encontrado. Ajuste o GEMINI_MODEL.`, 500);
  return new ErroIA(`Erro ao gerar receitas: ${detalhe}`, 502);
}

export async function gerarComGemini(dados, apiKey) {
  const modelos = listaModelos();
  const inicio = Date.now();
  let ultimoErro = null;

  for (let i = 0; i < modelos.length; i++) {
    const modelo = modelos[i];
    const restante = ORCAMENTO_MS - (Date.now() - inicio);
    if (restante < 5_000) break;
    const ultima = i === modelos.length - 1;
    const timeout = ultima ? restante : Math.min(TIMEOUT_TENTATIVA_MS, restante);

    let resultado;
    try {
      resultado = await chamarModelo(modelo, dados, apiKey, timeout);
    } catch (e) {
      // Timeout ou falha de rede: tenta o próximo modelo.
      console.warn(`[api/receitas] Gemini ${modelo} falhou (${e.message}); tentando o próximo.`);
      ultimoErro = e instanceof ErroIA ? e : new ErroIA("Não foi possível conectar ao Gemini.", 502);
      continue;
    }

    const { ok, status, json } = resultado;
    if (!ok) {
      const detalhe = json?.error?.message || `HTTP ${status}`;
      if (STATUS_TENTAR_OUTRO.has(status)) {
        console.warn(`[api/receitas] Gemini ${modelo} indisponível (${status}): ${detalhe.slice(0, 120)}`);
        ultimoErro =
          status === 429
            ? new ErroIA("Limite gratuito do Gemini atingido. Aguarde um pouco e tente de novo.", 429)
            : new ErroIA("O Gemini está sobrecarregado no momento. Tente novamente em instantes.", 503);
        continue;
      }
      console.error("[api/receitas] Erro do Gemini:", status, detalhe);
      throw erroDefinitivo(status, detalhe, modelo);
    }

    const texto = extrairTexto(json);
    const parsed = texto ? extrairJSON(texto) : null;
    if (!parsed) {
      console.warn(`[api/receitas] Gemini ${modelo} retornou formato inesperado; tentando o próximo.`);
      ultimoErro = new ErroIA("A IA retornou um formato inesperado. Tente novamente.", 502);
      continue;
    }

    return { parsed, modelo: json?.model || modelo };
  }

  throw ultimoErro ?? new ErroIA("O Gemini está sobrecarregado no momento. Tente novamente em instantes.", 503);
}
