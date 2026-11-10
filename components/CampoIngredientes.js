"use client";

import { useState } from "react";
import { LIMITES, SUGESTOES } from "@/lib/constants";
import { normalizarTexto } from "@/lib/ingredientes";

export default function CampoIngredientes({ ingredientes, onChange }) {
  const [texto, setTexto] = useState("");

  const jaTem = (nome) => ingredientes.some((i) => normalizarTexto(i) === normalizarTexto(nome));

  function adicionar(valores) {
    const novos = [];
    for (const bruto of valores) {
      const nome = bruto.trim().replace(/\s+/g, " ").slice(0, LIMITES.maxTamanhoIngrediente);
      if (!nome || jaTem(nome) || novos.some((n) => normalizarTexto(n) === normalizarTexto(nome))) continue;
      novos.push(nome.toLowerCase());
    }
    if (novos.length) onChange([...ingredientes, ...novos].slice(0, LIMITES.maxIngredientes));
  }

  function remover(nome) {
    onChange(ingredientes.filter((i) => i !== nome));
  }

  function aoDigitar(e) {
    const valor = e.target.value;
    if (valor.includes(",")) {
      const partes = valor.split(",");
      adicionar(partes.slice(0, -1));
      setTexto(partes.at(-1));
    } else {
      setTexto(valor);
    }
  }

  function aoPressionar(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      adicionar([texto]);
      setTexto("");
    } else if (e.key === "Backspace" && !texto && ingredientes.length) {
      remover(ingredientes.at(-1));
    }
  }

  const sugestoesRestantes = SUGESTOES.filter((s) => !jaTem(s));
  const cheio = ingredientes.length >= LIMITES.maxIngredientes;

  return (
    <div>
      <label htmlFor="ingrediente" className="mb-2 block text-sm font-semibold text-stone-700">
        O que você tem em casa?
      </label>

      <div className="flex min-h-[3.25rem] flex-wrap items-center gap-2 rounded-2xl border border-stone-200 bg-white p-2 shadow-sm transition focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-100">
        {ingredientes.map((ing) => (
          <span
            key={ing}
            className="inline-flex items-center gap-1 rounded-full bg-brand-50 py-1 pl-3 pr-1 text-sm font-medium text-brand-900 ring-1 ring-brand-200"
          >
            {ing}
            <button
              type="button"
              onClick={() => remover(ing)}
              className="grid h-6 w-6 place-items-center rounded-full text-brand-700 transition hover:bg-brand-200"
              aria-label={`Remover ${ing}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          id="ingrediente"
          value={texto}
          onChange={aoDigitar}
          onKeyDown={aoPressionar}
          onBlur={() => {
            if (texto.trim()) {
              adicionar([texto]);
              setTexto("");
            }
          }}
          disabled={cheio}
          placeholder={ingredientes.length ? "Adicionar mais..." : "Ex.: frango, arroz, tomate"}
          className="min-w-[10rem] flex-1 bg-transparent px-2 py-1.5 text-base outline-none placeholder:text-stone-400 disabled:cursor-not-allowed"
          autoComplete="off"
          enterKeyHint="done"
        />
      </div>

      <p className="mt-1.5 text-xs text-stone-500">
        Pressione <kbd className="rounded bg-stone-200 px-1 font-sans">Enter</kbd> ou use vírgula para adicionar.
        {cheio && " Limite de ingredientes atingido."}
      </p>

      {sugestoesRestantes.length > 0 && (
        <div className="mt-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">Sugestões</p>
          <div className="flex flex-wrap gap-1.5">
            {sugestoesRestantes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => adicionar([s])}
                disabled={cheio}
                className="rounded-full border border-dashed border-stone-300 bg-white px-3 py-1 text-sm text-stone-600 transition hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700 disabled:opacity-50"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
