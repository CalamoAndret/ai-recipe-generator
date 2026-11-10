import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Busca a foto de um prato no servidor (as chaves nunca vão para o navegador).
// Ordem: Pixabay -> TheMealDB -> sem foto. Esta rota nunca falha: no pior caso devolve { url: null }.

const TIMEOUT_MS = 6000;
const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 h (URLs da Pixabay expiram em 24 h)
const CACHE_TTL_VAZIO_MS = 30 * 60 * 1000; // "não achou" fica 30 min
const CACHE_MAX = 500;

// Cache em memória por termo. Guarda a Promise para que buscas simultâneas
// do mesmo termo compartilhem a mesma requisição.
const cache = globalThis.__cacheImagens ?? (globalThis.__cacheImagens = new Map());

const SEM_FOTO = { url: null, fonte: null, link: null };

function limparTermo(bruto) {
  return String(bruto ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60);
}

async function buscarJSON(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const r = await fetch(url, { signal: controller.signal, cache: "no-store" });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function buscarPixabay(termo) {
  const chave = process.env.PIXABAY_API_KEY?.trim();
  if (!chave) return null;
  const params = new URLSearchParams({
    key: chave,
    q: termo,
    image_type: "photo",
    category: "food",
    safesearch: "true",
    orientation: "horizontal",
    per_page: "3",
  });
  const json = await buscarJSON(`https://pixabay.com/api/?${params}`);
  const foto = json?.hits?.[0];
  const url = foto?.webformatURL || foto?.largeImageURL;
  if (!url) return null;
  return { url, fonte: "Pixabay", link: foto.pageURL || "https://pixabay.com/" };
}

async function buscarMealDB(termo) {
  const palavras = termo.split(" ").filter((p) => p.length > 2);
  // Tenta o termo completo, depois a palavra principal (em inglês costuma ser a última), depois as demais.
  const tentativas = [...new Set([termo, palavras.at(-1), ...palavras].filter(Boolean))].slice(0, 4);
  for (const t of tentativas) {
    const json = await buscarJSON(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(t)}`
    );
    const prato = json?.meals?.[0];
    if (prato?.strMealThumb) {
      return {
        url: prato.strMealThumb,
        fonte: "TheMealDB",
        link: prato.idMeal ? `https://www.themealdb.com/meal/${prato.idMeal}` : "https://www.themealdb.com/",
      };
    }
  }
  return null;
}

async function buscarFoto(termo) {
  try {
    return (await buscarPixabay(termo)) || (await buscarMealDB(termo)) || SEM_FOTO;
  } catch (e) {
    console.error("[api/imagem] Erro ao buscar foto:", e);
    return SEM_FOTO;
  }
}

function lerCache(termo) {
  const item = cache.get(termo);
  if (!item) return null;
  if (Date.now() > item.expira) {
    cache.delete(termo);
    return null;
  }
  return item.promessa;
}

function gravarCache(termo, promessa) {
  if (cache.size >= CACHE_MAX) cache.delete(cache.keys().next().value); // remove o mais antigo
  const item = { promessa, expira: Date.now() + CACHE_TTL_MS };
  cache.set(termo, item);
  promessa.then((r) => {
    if (!r.url) item.expira = Date.now() + CACHE_TTL_VAZIO_MS;
  });
}

export async function GET(request) {
  const termo = limparTermo(new URL(request.url).searchParams.get("q"));
  if (!termo) return NextResponse.json(SEM_FOTO);

  let promessa = lerCache(termo);
  const emCache = !!promessa;
  if (!promessa) {
    promessa = buscarFoto(termo);
    gravarCache(termo, promessa);
  }

  const resultado = await promessa;
  return NextResponse.json(resultado, {
    headers: {
      "Cache-Control": "private, max-age=3600",
      "X-Cache": emCache ? "HIT" : "MISS",
    },
  });
}
