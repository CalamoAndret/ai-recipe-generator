"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import CampoIngredientes from "@/components/CampoIngredientes";
import CartaoReceita from "@/components/CartaoReceita";
import Filtros from "@/components/Filtros";
import ListaCompras from "@/components/ListaCompras";
import { useFavoritos } from "@/lib/armazenamento";

const FILTROS_INICIAIS = {
  objetivo: "equilibrio",
  tempoMax: 30,
  restricoes: [],
  porcoes: 2,
};

function Esqueleto() {
  return (
    <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-stone-200/70" aria-hidden>
      <div className="h-32 animate-pulse bg-stone-200" />
      <div className="space-y-3 p-5">
        <div className="grid grid-cols-4 gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-stone-100" />
          ))}
        </div>
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="h-4 animate-pulse rounded bg-stone-100" style={{ width: `${90 - i * 10}%` }} />
        ))}
      </div>
    </div>
  );
}

function Vazio({ icone, titulo, texto }) {
  return (
    <div className="grid place-items-center rounded-3xl border-2 border-dashed border-stone-200 bg-white/60 px-6 py-16 text-center">
      <span className="text-5xl" aria-hidden>
        {icone}
      </span>
      <h3 className="mt-3 text-lg font-bold text-stone-800">{titulo}</h3>
      <p className="mt-1 max-w-sm text-sm text-stone-500">{texto}</p>
    </div>
  );
}

export default function Home() {
  const [ingredientes, setIngredientes] = useState([]);
  const [filtros, setFiltros] = useState(FILTROS_INICIAIS);
  const [receitas, setReceitas] = useState([]);
  const [modo, setModo] = useState(null);
  const [provedor, setProvedor] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [aba, setAba] = useState("receitas");
  const [naLista, setNaLista] = useState([]);
  const resultadosRef = useRef(null);
  const { favoritos, ehFavorito, alternarFavorito } = useFavoritos();

  useEffect(() => {
    fetch("/api/receitas")
      .then((r) => r.json())
      .then((d) => {
        setModo(d.modo);
        setProvedor(d.provedor || "");
      })
      .catch(() => {});
  }, []);

  async function gerar(e) {
    e.preventDefault();
    if (ingredientes.length === 0) {
      setErro("Adicione pelo menos um ingrediente para começar.");
      return;
    }
    setErro("");
    setCarregando(true);
    setAba("receitas");
    resultadosRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    try {
      const resposta = await fetch("/api/receitas", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ingredientes, ...filtros }),
      });
      const dados = await resposta.json().catch(() => ({}));
      if (!resposta.ok) throw new Error(dados.erro || "Não foi possível gerar as receitas.");
      setReceitas(dados.receitas);
      setModo(dados.modo);
      setProvedor(dados.provedor || "");
      setNaLista(dados.receitas.map((r) => r.id));
    } catch (err) {
      setErro(err.message || "Erro de conexão. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  const alternarLista = (id) => setNaLista((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));

  const receitasNaLista = useMemo(() => {
    const todas = new Map([...receitas, ...favoritos].map((r) => [r.id, r]));
    return naLista.map((id) => todas.get(id)).filter(Boolean);
  }, [receitas, favoritos, naLista]);

  const lista = aba === "receitas" ? receitas : favoritos;

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between sm:py-8">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-teal-600 text-2xl shadow-lg shadow-brand-500/30">
            🍳
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Gerador de Receitas com IA</h1>
            <p className="text-sm text-stone-500">Cozinhe com o que você já tem em casa.</p>
          </div>
        </div>
        {modo === "demo" && (
          <span
            className="self-start rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900 ring-1 ring-amber-200 sm:self-auto"
            title="Configure GEMINI_API_KEY (gratuita) no .env.local para usar a IA"
          >
            ✨ Modo demonstração
          </span>
        )}
        {modo === "ia" && (
          <span className="self-start rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-900 ring-1 ring-brand-200 sm:self-auto">
            🤖 IA conectada{provedor && ` · ${provedor}`}
          </span>
        )}
      </header>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr] lg:items-start">
        <aside className="space-y-6 lg:sticky lg:top-6">
          <form onSubmit={gerar} className="space-y-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200/70">
            <CampoIngredientes ingredientes={ingredientes} onChange={setIngredientes} />
            <hr className="border-stone-100" />
            <Filtros filtros={filtros} onChange={setFiltros} />
            <button
              type="submit"
              disabled={carregando}
              className="w-full rounded-2xl bg-gradient-to-r from-brand-600 to-teal-600 px-5 py-3.5 text-base font-bold text-white shadow-lg shadow-brand-600/25 transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
            >
              {carregando ? "Criando receitas..." : "✨ Gerar receitas"}
            </button>
            {modo === "demo" && (
              <p className="-mt-3 text-center text-xs text-stone-500">
                Sem chave de API: mostrando receitas de exemplo.
              </p>
            )}
          </form>

          <div className="hidden lg:block">
            <ListaCompras receitas={receitasNaLista} />
          </div>
        </aside>

        <main ref={resultadosRef} className="scroll-mt-4">
          <div className="mb-4 inline-flex rounded-2xl bg-stone-200/60 p-1" role="tablist">
            {[
              { id: "receitas", label: "Receitas", qtd: receitas.length },
              { id: "favoritos", label: "Favoritos", qtd: favoritos.length },
            ].map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={aba === t.id}
                onClick={() => setAba(t.id)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  aba === t.id ? "bg-white text-stone-900 shadow-sm" : "text-stone-600 hover:text-stone-900"
                }`}
              >
                {t.id === "favoritos" ? "❤️ " : "🍽 "}
                {t.label}
                {t.qtd > 0 && (
                  <span className="ml-1.5 rounded-full bg-stone-900/10 px-1.5 py-0.5 text-xs">{t.qtd}</span>
                )}
              </button>
            ))}
          </div>

          {erro && (
            <div role="alert" className="mb-4 rounded-2xl bg-rose-50 p-4 text-sm text-rose-800 ring-1 ring-rose-200">
              ⚠️ {erro}
            </div>
          )}

          {aba === "receitas" && carregando ? (
            <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3" aria-busy="true" aria-label="Carregando receitas">
              <Esqueleto />
              <Esqueleto />
              <Esqueleto />
            </div>
          ) : lista.length === 0 ? (
            aba === "receitas" ? (
              <Vazio
                icone="🥕"
                titulo="Suas receitas aparecem aqui"
                texto="Adicione os ingredientes que você tem, ajuste os filtros e clique em “Gerar receitas”."
              />
            ) : (
              <Vazio
                icone="🤍"
                titulo="Nenhum favorito ainda"
                texto="Toque no coração de uma receita para salvá-la aqui. Os favoritos ficam guardados neste navegador."
              />
            )
          ) : (
            <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
              {lista.map((r, i) => (
                <CartaoReceita
                  key={r.id}
                  receita={r}
                  indice={i}
                  favorito={ehFavorito(r.id)}
                  onFavoritar={alternarFavorito}
                  naLista={naLista.includes(r.id)}
                  onAlternarLista={alternarLista}
                />
              ))}
            </div>
          )}

          <div className="mt-6 lg:hidden">
            <ListaCompras receitas={receitasNaLista} />
          </div>
        </main>
      </div>

      <footer className="mt-12 text-center text-xs text-stone-400">
        Valores nutricionais são estimativas. Feito com Next.js, Tailwind CSS e IA generativa.
      </footer>
    </div>
  );
}
