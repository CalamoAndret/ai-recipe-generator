// Prompt e schema compartilhados por todos os provedores de IA.

export class ErroIA extends Error {
  constructor(mensagem, status = 502) {
    super(mensagem);
    this.status = status;
  }
}

const ROTULO_OBJETIVO = {
  hipertrofia: "hipertrofia (priorize proteína alta, ~30 g ou mais por porção, e calorias adequadas)",
  emagrecimento: "emagrecimento (priorize baixa densidade calórica, alta saciedade, fibras e proteína)",
  equilibrio: "alimentação equilibrada (boa distribuição de macronutrientes)",
};

const ROTULO_RESTRICAO = {
  vegetariano: "vegetariano (sem carne, frango, peixe ou frutos do mar)",
  "sem-lactose": "sem lactose (sem leite e derivados com lactose)",
  "sem-gluten": "sem glúten (sem trigo, centeio, cevada; aveia só se for sem glúten)",
};

export const SCHEMA_RECEITAS = {
  type: "object",
  additionalProperties: false,
  required: ["receitas"],
  properties: {
    receitas: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "nome",
          "descricao",
          "tempoMinutos",
          "dificuldade",
          "porcoes",
          "macros",
          "ingredientes",
          "passos",
          "dica",
          "termoBuscaImagem",
        ],
        properties: {
          nome: { type: "string" },
          termoBuscaImagem: { type: "string" },
          descricao: { type: "string" },
          tempoMinutos: { type: "integer" },
          dificuldade: { type: "string", enum: ["Fácil", "Média", "Difícil"] },
          porcoes: { type: "integer" },
          macros: {
            type: "object",
            additionalProperties: false,
            required: ["calorias", "proteina", "carboidratos", "gordura"],
            properties: {
              calorias: { type: "number" },
              proteina: { type: "number" },
              carboidratos: { type: "number" },
              gordura: { type: "number" },
            },
          },
          ingredientes: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["nome", "quantidade", "temEmCasa"],
              properties: {
                nome: { type: "string" },
                quantidade: { type: "string" },
                temEmCasa: { type: "boolean" },
              },
            },
          },
          passos: { type: "array", items: { type: "string" } },
          dica: { type: "string" },
        },
      },
    },
  },
};

export const SYSTEM_PROMPT = `Você é um chef e nutricionista brasileiro. Cria receitas caseiras, práticas e saborosas, com ingredientes fáceis de achar no Brasil.

Regras:
- Use principalmente os ingredientes que a pessoa tem em casa. Pode acrescentar poucos ingredientes extras quando realmente melhorarem a receita.
- Considere que sal, pimenta-do-reino, azeite/óleo e água estão sempre disponíveis.
- Em cada ingrediente, "temEmCasa" é true se ele está na lista da pessoa (ou é um desses básicos) e false se ela precisará comprar.
- Respeite rigorosamente as restrições alimentares e o tempo máximo de preparo.
- As quantidades devem corresponder ao número de porções pedido, em medidas caseiras brasileiras (xícara, colher, unidade, g, ml).
- Os macros são estimativas realistas POR PORÇÃO: calorias em kcal; proteína, carboidratos e gordura em gramas.
- As três receitas devem ser bem diferentes entre si (técnica, estilo ou tipo de refeição).
- Passos claros e objetivos, um por item, sem numeração no texto.
- Escreva tudo em português do Brasil, EXCETO "termoBuscaImagem": o nome do prato em inglês, curto e genérico (2 a 3 palavras, sem marcas nem adjetivos), usado para buscar uma foto. Ex.: "spinach omelette", "chicken rice broccoli", "lentil soup".
- Responda somente com o JSON no formato pedido: {"receitas": [ ... 3 receitas ... ]}.`;

export function montarPedido({ ingredientes, objetivo, tempoMax, restricoes, porcoes }) {
  return `Crie 3 receitas.

Ingredientes que tenho em casa: ${ingredientes.join(", ")}.
Objetivo: ${ROTULO_OBJETIVO[objetivo]}.
Tempo máximo de preparo: ${tempoMax ? `${tempoMax} minutos` : "sem limite"}.
Restrições: ${restricoes.length ? restricoes.map((r) => ROTULO_RESTRICAO[r]).join("; ") : "nenhuma"}.
Número de porções: ${porcoes}.`;
}

/** fetch com timeout, convertendo falhas de rede em ErroIA. */
export async function fetchComTimeout(url, opcoes, nomeProvedor, timeoutMs = 110_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...opcoes, signal: controller.signal, cache: "no-store" });
  } catch (e) {
    if (e?.name === "AbortError") throw new ErroIA("A IA demorou demais para responder. Tente novamente.", 504);
    throw new ErroIA(`Não foi possível conectar à API do ${nomeProvedor}.`, 502);
  } finally {
    clearTimeout(timer);
  }
}
