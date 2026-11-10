"use client";

import { useCallback, useEffect, useState } from "react";

const CHAVE_FAVORITOS = "gerador-receitas:favoritos";

function lerFavoritos() {
  try {
    const bruto = window.localStorage.getItem(CHAVE_FAVORITOS);
    const lista = bruto ? JSON.parse(bruto) : [];
    return Array.isArray(lista) ? lista.filter((r) => r && typeof r === "object" && r.id && r.nome) : [];
  } catch {
    return [];
  }
}

function salvarFavoritos(lista) {
  try {
    window.localStorage.setItem(CHAVE_FAVORITOS, JSON.stringify(lista));
  } catch {
    // localStorage indisponível (modo privado, cota cheia...) — segue só em memória.
  }
}

/** Favoritos persistidos no localStorage (com fallback em memória). */
export function useFavoritos() {
  const [favoritos, setFavoritos] = useState([]);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    setFavoritos(lerFavoritos());
    setCarregado(true);
  }, []);

  useEffect(() => {
    if (carregado) salvarFavoritos(favoritos);
  }, [favoritos, carregado]);

  const ehFavorito = useCallback((id) => favoritos.some((f) => f.id === id), [favoritos]);

  const alternarFavorito = useCallback((receita) => {
    setFavoritos((atual) =>
      atual.some((f) => f.id === receita.id)
        ? atual.filter((f) => f.id !== receita.id)
        : [{ ...receita, salvoEm: Date.now() }, ...atual]
    );
  }, []);

  return { favoritos, ehFavorito, alternarFavorito, carregado };
}
