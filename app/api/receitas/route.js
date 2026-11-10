import { NextResponse } from "next/server";
import { LIMITES, OBJETIVOS, RESTRICOES } from "@/lib/constants";
import { gerarReceitasDemo } from "@/lib/demo";
import { ErroIA, escolherProvedor } from "@/lib/ia";
import { normalizarResposta } from "@/lib/normalizar";

export const runtime = "nodejs";
export const maxDuration = 120;

function erro(mensagem, status = 400) {
  return NextResponse.json({ erro: mensagem }, { status });
}

function validarEntrada(corpo) {
  if (!corpo || typeof corpo !== "object") return { erro: "Requisição inválida." };

  const ingredientes = (Array.isArray(corpo.ingredientes) ? corpo.ingredientes : [])
    .filter((i) => typeof i === "string")
    .map((i) => i.trim().slice(0, LIMITES.maxTamanhoIngrediente))
    .filter(Boolean)
    .slice(0, LIMITES.maxIngredientes);

  if (ingredientes.length === 0) return { erro: "Adicione pelo menos um ingrediente." };

  const objetivo = OBJETIVOS.some((o) => o.id === corpo.objetivo) ? corpo.objetivo : "equilibrio";

  const tempo = parseInt(corpo.tempoMax, 10);
  const tempoMax = Number.isFinite(tempo) && tempo > 0 ? Math.min(Math.max(tempo, 5), 240) : null;

  const idsRestricoes = RESTRICOES.map((r) => r.id);
  const restricoes = (Array.isArray(corpo.restricoes) ? corpo.restricoes : []).filter((r) =>
    idsRestricoes.includes(r)
  );

  const p = parseInt(corpo.porcoes, 10);
  const porcoes = Number.isFinite(p)
    ? Math.min(Math.max(p, LIMITES.minPorcoes), LIMITES.maxPorcoes)
    : 2;

  return { dados: { ingredientes, objetivo, tempoMax, restricoes, porcoes } };
}

export async function POST(request) {
  let corpo;
  try {
    corpo = await request.json();
  } catch {
    return erro("Corpo da requisição inválido.");
  }

  const { dados, erro: erroValidacao } = validarEntrada(corpo);
  if (erroValidacao) return erro(erroValidacao);

  const provedor = escolherProvedor();

  // MODO DEMONSTRAÇÃO: sem nenhuma chave, devolve receitas de exemplo.
  if (!provedor) {
    const receitas = normalizarResposta(gerarReceitasDemo(dados), dados.ingredientes, dados.porcoes);
    await new Promise((r) => setTimeout(r, 700)); // simula a espera para a UI de carregamento
    return NextResponse.json({ modo: "demo", receitas });
  }

  try {
    const { parsed, modelo } = await provedor.gerar(dados, provedor.chave);
    const receitas = normalizarResposta(parsed, dados.ingredientes, dados.porcoes);
    if (receitas.length === 0) {
      return erro("A IA não retornou receitas válidas. Tente novamente.", 502);
    }
    return NextResponse.json({ modo: "ia", provedor: provedor.nome, modelo, receitas });
  } catch (e) {
    if (e instanceof ErroIA) return erro(e.message, e.status);
    console.error("[api/receitas] Erro inesperado:", e);
    return erro("Erro inesperado ao gerar receitas.", 500);
  }
}

export function GET() {
  const provedor = escolherProvedor();
  return NextResponse.json(provedor ? { modo: "ia", provedor: provedor.nome } : { modo: "demo" });
}
