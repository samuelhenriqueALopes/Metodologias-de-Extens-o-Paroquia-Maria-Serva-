import { IconeEstrela } from "./Icones";

/** Faixa de título no topo das páginas internas. */
export function CabecalhoPagina({ titulo, subtitulo, sobretitulo }: { titulo: string; subtitulo?: string; sobretitulo?: string }) {
  return (
    <section className="relative overflow-hidden bg-mariano-400">
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_80%_-20%,rgba(255,255,255,0.35),transparent_55%)]" />
      <div className="relative mx-auto max-w-7xl px-6 py-14 text-center sm:py-20">
        {sobretitulo && <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mariano-950/70">{sobretitulo}</p>}
        <h1 className="mt-2 font-serif text-4xl font-bold text-white drop-shadow-sm sm:text-5xl">{titulo}</h1>
        <div className="ornamento mx-auto mt-4 w-fit text-white!">
          <IconeEstrela className="size-3.5" />
        </div>
        {subtitulo && <p className="mx-auto mt-4 max-w-2xl text-mariano-950/80">{subtitulo}</p>}
      </div>
    </section>
  );
}

export function TituloSecao({ titulo, sobretitulo, centro = false }: { titulo: string; sobretitulo?: string; centro?: boolean }) {
  return (
    <div className={centro ? "text-center" : ""}>
      {sobretitulo && <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mariano-600">{sobretitulo}</p>}
      <h2 className="mt-1 font-serif text-3xl font-bold text-mariano-950 sm:text-4xl">{titulo}</h2>
      <div className={`ornamento mt-3 ${centro ? "mx-auto w-fit" : "w-fit"}`}>
        <IconeEstrela className="size-3" />
      </div>
    </div>
  );
}

export const botao = {
  primario:
    "inline-flex items-center justify-center gap-2 rounded-full bg-mariano-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-mariano-800",
  ouro:
    "inline-flex items-center justify-center gap-2 rounded-full bg-ouro-400 px-6 py-3 text-sm font-semibold text-mariano-950 shadow-sm transition hover:bg-ouro-300",
  claro:
    "inline-flex items-center justify-center gap-2 rounded-full border border-white/70 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10",
  whatsapp:
    "inline-flex items-center justify-center gap-2 rounded-full bg-[#1f8f4e] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#187540]",
  contorno:
    "inline-flex items-center justify-center gap-2 rounded-full border border-mariano-300 bg-white px-6 py-3 text-sm font-semibold text-mariano-900 transition hover:border-mariano-500",
};
