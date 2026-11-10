"use client";

import { useEffect, useState } from "react";

// Cache no navegador (por termo) para não repetir a chamada ao trocar de aba ou re-renderizar.
const cacheCliente = new Map();

function buscar(termo) {
  if (!cacheCliente.has(termo)) {
    const promessa = fetch(`/api/imagem?q=${encodeURIComponent(termo)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => (d?.url ? d : null))
      .catch(() => null);
    cacheCliente.set(termo, promessa);
    // Se falhar, permite tentar de novo numa próxima montagem.
    promessa.then((d) => {
      if (!d) cacheCliente.delete(termo);
    });
  }
  return cacheCliente.get(termo);
}

/**
 * Retorna { url, fonte, link } da foto do prato, ou null enquanto carrega / se não houver foto.
 * Cada card chama o hook ao montar, então as fotos dos cards são buscadas em paralelo.
 */
export function useFotoPrato(termo) {
  const [foto, setFoto] = useState(null);

  useEffect(() => {
    setFoto(null);
    if (!termo) return;
    let ativo = true;
    buscar(termo).then((d) => {
      if (ativo) setFoto(d);
    });
    return () => {
      ativo = false;
    };
  }, [termo]);

  return foto;
}
