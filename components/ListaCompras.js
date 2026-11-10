"use client";

import { useMemo, useState } from "react";
import { normalizarTexto } from "@/lib/ingredientes";

async function copiarTexto(texto) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(texto);
      return true;
    }
  } catch {}
  try {
    const area = document.createElement("textarea");
    area.value = texto;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

/** Junta os ingredientes que faltam nas receitas selecionadas, sem repetir. */
function montarItens(receitas) {
  const mapa = new Map();
  for (const r of receitas) {
    for (const ing of r.ingredientes) {
      if (ing.temEmCasa) continue;
      const chave = normalizarTexto(ing.nome);
      const item = mapa.get(chave) ?? { nome: ing.nome, usos: [] };
      item.usos.push({ receita: r.nome, quantidade: ing.quantidade });
      mapa.set(chave, item);
    }
  }
  return [...mapa.values()].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}

export default function ListaCompras({ receitas }) {
  const [marcados, setMarcados] = useState({});
  const [status, setStatus] = useState(null);

  const itens = useMemo(() => montarItens(receitas), [receitas]);

  const alternar = (nome) => setMarcados((m) => ({ ...m, [nome]: !m[nome] }));

  async function copiar() {
    const pendentes = itens.filter((i) => !marcados[i.nome]);
    const texto = [
      "🛒 Lista de compras",
      "",
      ...pendentes.map((i) => `- ${i.nome} (${i.usos.map((u) => u.quantidade).join(" + ")})`),
    ].join("\n");
    const ok = await copiarTexto(texto);
    setStatus(ok ? "copiado" : "erro");
    setTimeout(() => setStatus(null), 2200);
  }

  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200/70" aria-labelledby="titulo-lista">
      <div className="flex items-center justify-between gap-3">
        <h2 id="titulo-lista" className="text-lg font-bold">
          🛒 Lista de compras
        </h2>
        {itens.length > 0 && (
          <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-semibold text-orange-800">
            {itens.length} {itens.length === 1 ? "item" : "itens"}
          </span>
        )}
      </div>

      {itens.length === 0 ? (
        <p className="mt-3 text-sm text-stone-500">
          {receitas.length === 0
            ? "Gere receitas e adicione-as à lista para ver aqui o que precisa comprar."
            : "Você já tem todos os ingredientes das receitas selecionadas. 🎉"}
        </p>
      ) : (
        <>
          <p className="mt-1 text-xs text-stone-500">
            Ingredientes que faltam em {receitas.length} {receitas.length === 1 ? "receita" : "receitas"}.
          </p>
          <ul className="mt-3 divide-y divide-stone-100">
            {itens.map((item) => (
              <li key={item.nome}>
                <label className="flex cursor-pointer items-start gap-3 py-2">
                  <input
                    type="checkbox"
                    checked={!!marcados[item.nome]}
                    onChange={() => alternar(item.nome)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-brand-600"
                  />
                  <span className={`text-sm ${marcados[item.nome] ? "text-stone-400 line-through" : "text-stone-800"}`}>
                    <span className="font-medium">{item.nome}</span>
                    <span className="block text-xs text-stone-500">
                      {item.usos.map((u) => `${u.quantidade} (${u.receita})`).join(" · ")}
                    </span>
                  </span>
                </label>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={copiar}
            className="mt-4 w-full rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            {status === "copiado" ? "✓ Copiado!" : status === "erro" ? "Não foi possível copiar" : "📋 Copiar lista"}
          </button>
        </>
      )}
    </section>
  );
}
