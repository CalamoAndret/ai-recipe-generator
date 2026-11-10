"use client";

import { useState } from "react";
import { useFotoPrato } from "@/lib/useFotoPrato";

const CORES_DIFICULDADE = {
  Fácil: "bg-emerald-100 text-emerald-800",
  Média: "bg-amber-100 text-amber-800",
  Difícil: "bg-rose-100 text-rose-800",
};

const GRADIENTES = [
  "from-emerald-500 to-teal-600",
  "from-orange-400 to-rose-500",
  "from-sky-500 to-indigo-600",
];

function Macro({ rotulo, valor, unidade, cor }) {
  return (
    <div className={`rounded-xl px-2 py-2.5 text-center ${cor}`}>
      <p className="text-lg font-bold leading-none tabular-nums">
        {valor}
        <span className="ml-0.5 text-xs font-semibold opacity-70">{unidade}</span>
      </p>
      <p className="mt-1 text-[11px] font-medium uppercase tracking-wide opacity-80">{rotulo}</p>
    </div>
  );
}

export default function CartaoReceita({ receita, indice = 0, favorito, onFavoritar, naLista, onAlternarLista }) {
  const [aberta, setAberta] = useState(false);
  const foto = useFotoPrato(receita.termoBuscaImagem || receita.nome);
  const [fotoCarregada, setFotoCarregada] = useState(null); // url da foto já carregada
  const comFoto = !!foto && fotoCarregada === foto.url;
  const faltando = receita.ingredientes.filter((i) => !i.temEmCasa).length;
  const { calorias, proteina, carboidratos, gordura } = receita.macros;

  return (
    <article
      className="animate-fade-up flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-200/70"
      style={{ animationDelay: `${indice * 80}ms` }}
    >
      <div className="relative isolate flex min-h-44 flex-col overflow-hidden px-5 pb-6 pt-4 text-white">
        {foto && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={foto.url}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            onLoad={() => setFotoCarregada(foto.url)}
            onError={() => setFotoCarregada(null)}
            className={`absolute inset-0 -z-20 h-full w-full scale-105 object-cover blur-[1px] transition-opacity duration-700 ease-out ${
              comFoto ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
        <div
          aria-hidden
          className={`absolute inset-0 -z-10 bg-gradient-to-br ${GRADIENTES[indice % GRADIENTES.length]} transition-opacity duration-700 ${
            comFoto ? "opacity-30" : "opacity-100"
          }`}
        />
        {/* Sombra escura embaixo para o texto continuar legível sobre fotos claras */}
        <div
          aria-hidden
          className={`absolute inset-0 -z-10 bg-gradient-to-t from-black/45 via-black/10 to-transparent transition-opacity duration-700 ${
            comFoto ? "opacity-100" : "opacity-0"
          }`}
        />
        {comFoto && (
          <a
            href={foto.link}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-1 right-2 text-[9px] font-medium text-white/75 hover:text-white hover:underline"
          >
            Foto: {foto.fonte}
          </a>
        )}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap gap-1.5 text-xs font-semibold">
            <span className="rounded-full bg-white/20 px-2.5 py-1 backdrop-blur">⏱ {receita.tempoMinutos} min</span>
            <span className="rounded-full bg-white/20 px-2.5 py-1 backdrop-blur">
              🍽 {receita.porcoes} {receita.porcoes === 1 ? "porção" : "porções"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onFavoritar(receita)}
            aria-pressed={favorito}
            aria-label={favorito ? "Remover dos favoritos" : "Salvar nos favoritos"}
            title={favorito ? "Remover dos favoritos" : "Salvar nos favoritos"}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/20 text-xl backdrop-blur transition hover:scale-110 hover:bg-white/30"
          >
            {favorito ? "❤️" : "🤍"}
          </button>
        </div>
        <h3 className="mt-auto pt-3 text-xl font-bold leading-tight [text-shadow:0_1px_2px_rgb(0_0_0/0.6),0_2px_10px_rgb(0_0_0/0.4)]">
          {receita.nome}
        </h3>
        {receita.descricao && (
          <p className="mt-1 text-sm text-white/90 [text-shadow:0_1px_2px_rgb(0_0_0/0.6),0_1px_8px_rgb(0_0_0/0.4)]">{receita.descricao}</p>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Macros por porção</p>
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${CORES_DIFICULDADE[receita.dificuldade]}`}>
              {receita.dificuldade}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            <Macro rotulo="kcal" valor={calorias} unidade="" cor="bg-stone-900 text-white" />
            <Macro rotulo="Proteína" valor={proteina} unidade="g" cor="bg-rose-50 text-rose-700" />
            <Macro rotulo="Carbo" valor={carboidratos} unidade="g" cor="bg-amber-50 text-amber-700" />
            <Macro rotulo="Gordura" valor={gordura} unidade="g" cor="bg-sky-50 text-sky-700" />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-baseline justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">Ingredientes</p>
            <span className="text-xs text-stone-500">
              {faltando === 0 ? "✅ Você tem tudo!" : `🛒 Falta${faltando > 1 ? "m" : ""} ${faltando}`}
            </span>
          </div>
          <ul className="space-y-1.5 text-sm">
            {receita.ingredientes.map((ing, i) => (
              <li key={`${ing.nome}-${i}`} className="flex items-start gap-2">
                <span
                  className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
                    ing.temEmCasa ? "bg-brand-100 text-brand-700" : "bg-orange-100 text-orange-700"
                  }`}
                  aria-hidden
                >
                  {ing.temEmCasa ? "✓" : "+"}
                </span>
                <span className={ing.temEmCasa ? "text-stone-700" : "text-stone-900"}>
                  <span className="font-medium">{ing.nome}</span>
                  <span className="text-stone-500"> · {ing.quantidade}</span>
                  {!ing.temEmCasa && <span className="sr-only"> (precisa comprar)</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {aberta && (
          <div className="animate-fade-up space-y-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-500">Modo de preparo</p>
              <ol className="space-y-2.5 text-sm text-stone-700">
                {receita.passos.map((passo, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-stone-900 text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="pt-0.5">{passo}</span>
                  </li>
                ))}
              </ol>
            </div>
            {receita.dica && (
              <div className="rounded-2xl bg-amber-50 p-3.5 text-sm text-amber-900 ring-1 ring-amber-200">
                <span className="font-semibold">💡 Dica do chef: </span>
                {receita.dica}
              </div>
            )}
          </div>
        )}

        <div className="mt-auto flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => setAberta((v) => !v)}
            aria-expanded={aberta}
            className="flex-1 rounded-xl bg-stone-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-700"
          >
            {aberta ? "Ocultar preparo" : "Ver modo de preparo"}
          </button>
          {onAlternarLista && faltando > 0 && (
            <button
              type="button"
              onClick={() => onAlternarLista(receita.id)}
              aria-pressed={naLista}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                naLista
                  ? "bg-orange-100 text-orange-800 ring-1 ring-orange-200 hover:bg-orange-200"
                  : "bg-white text-stone-700 ring-1 ring-stone-200 hover:ring-stone-300"
              }`}
            >
              {naLista ? "✓ Na lista" : "+ Lista de compras"}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
