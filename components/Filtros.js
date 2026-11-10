"use client";

import { LIMITES, OBJETIVOS, RESTRICOES, TEMPOS } from "@/lib/constants";

function Titulo({ children }) {
  return <p className="mb-2 text-sm font-semibold text-stone-700">{children}</p>;
}

export default function Filtros({ filtros, onChange }) {
  const atualizar = (campo, valor) => onChange({ ...filtros, [campo]: valor });

  const alternarRestricao = (id) =>
    atualizar(
      "restricoes",
      filtros.restricoes.includes(id) ? filtros.restricoes.filter((r) => r !== id) : [...filtros.restricoes, id]
    );

  return (
    <div className="space-y-5">
      <div>
        <Titulo>Objetivo</Titulo>
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Objetivo">
          {OBJETIVOS.map((o) => {
            const ativo = filtros.objetivo === o.id;
            return (
              <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={ativo}
                onClick={() => atualizar("objetivo", o.id)}
                className={`rounded-2xl border px-2 py-3 text-center transition ${
                  ativo
                    ? "border-brand-500 bg-brand-50 ring-2 ring-brand-200"
                    : "border-stone-200 bg-white hover:border-stone-300"
                }`}
              >
                <span className="block text-xl" aria-hidden>
                  {o.emoji}
                </span>
                <span className={`block text-sm font-semibold ${ativo ? "text-brand-900" : "text-stone-800"}`}>
                  {o.label}
                </span>
                <span className="block text-[11px] text-stone-500">{o.descricao}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <Titulo>Tempo máximo de preparo</Titulo>
        <div className="flex flex-wrap gap-2">
          {TEMPOS.map((t) => {
            const ativo = filtros.tempoMax === t.valor;
            return (
              <button
                key={t.valor}
                type="button"
                aria-pressed={ativo}
                onClick={() => atualizar("tempoMax", t.valor)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                  ativo
                    ? "bg-stone-900 text-white"
                    : "bg-white text-stone-700 ring-1 ring-stone-200 hover:ring-stone-300"
                }`}
              >
                ⏱ {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <Titulo>Restrições</Titulo>
        <div className="flex flex-wrap gap-2">
          {RESTRICOES.map((r) => {
            const ativo = filtros.restricoes.includes(r.id);
            return (
              <button
                key={r.id}
                type="button"
                aria-pressed={ativo}
                onClick={() => alternarRestricao(r.id)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                  ativo
                    ? "bg-brand-600 text-white"
                    : "bg-white text-stone-700 ring-1 ring-stone-200 hover:ring-stone-300"
                }`}
              >
                {ativo ? "✓" : r.emoji} {r.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <Titulo>Porções</Titulo>
        <div className="inline-flex items-center rounded-full bg-white ring-1 ring-stone-200">
          <button
            type="button"
            onClick={() => atualizar("porcoes", Math.max(LIMITES.minPorcoes, filtros.porcoes - 1))}
            disabled={filtros.porcoes <= LIMITES.minPorcoes}
            className="grid h-10 w-10 place-items-center rounded-full text-lg text-stone-700 transition hover:bg-stone-100 disabled:opacity-40"
            aria-label="Diminuir porções"
          >
            −
          </button>
          <span className="w-24 text-center text-sm font-semibold" aria-live="polite">
            {filtros.porcoes} {filtros.porcoes === 1 ? "porção" : "porções"}
          </span>
          <button
            type="button"
            onClick={() => atualizar("porcoes", Math.min(LIMITES.maxPorcoes, filtros.porcoes + 1))}
            disabled={filtros.porcoes >= LIMITES.maxPorcoes}
            className="grid h-10 w-10 place-items-center rounded-full text-lg text-stone-700 transition hover:bg-stone-100 disabled:opacity-40"
            aria-label="Aumentar porções"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
