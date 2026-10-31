"use client";

import { useState } from "react";

export function CopiarTexto({ texto, rotulo = "Copiar" }: { texto: string; rotulo?: string }) {
  const [copiado, setCopiado] = useState(false);

  async function copiar() {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      setCopiado(false);
    }
  }

  return (
    <button type="button" onClick={copiar}
      className="rounded-full bg-ouro-400 px-4 py-1.5 text-xs font-semibold text-mariano-950 transition hover:bg-ouro-300 cursor-pointer">
      <span aria-live="polite">{copiado ? "Copiado!" : rotulo}</span>
    </button>
  );
}
