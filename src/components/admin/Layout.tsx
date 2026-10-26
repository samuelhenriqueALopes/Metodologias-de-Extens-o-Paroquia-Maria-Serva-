import Link from "next/link";
import { Suspense } from "react";

const mensagensOk: Record<string, string> = {
  salvo: "Salvo com sucesso. O site já foi atualizado.",
  excluido: "Item excluído.",
};

/** Cabeçalho de cada tela do painel. */
export function TituloPainel({ titulo, descricao, acao }: { titulo: string; descricao?: string; acao?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-serif text-3xl font-bold text-mariano-950">{titulo}</h1>
        {descricao && <p className="mt-1 text-sm text-slate-600">{descricao}</p>}
      </div>
      {acao}
    </div>
  );
}

export function MensagemOk({ ok }: { ok?: string | string[] }) {
  const texto = typeof ok === "string" ? mensagensOk[ok] : undefined;
  if (!texto) return null;
  return <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{texto}</p>;
}

export function Carregando() {
  return (
    <div className="space-y-3" aria-busy>
      <div className="h-8 w-48 animate-pulse rounded bg-slate-200" />
      <div className="h-40 animate-pulse rounded-xl bg-slate-200" />
      <div className="h-40 animate-pulse rounded-xl bg-slate-200" />
    </div>
  );
}

export function Vazio({ texto }: { texto: string }) {
  return <p className="px-5 py-10 text-center text-sm text-slate-500">{texto}</p>;
}

export function LinkVoltar({ href, texto }: { href: string; texto: string }) {
  return <Link href={href} className="text-sm text-mariano-700 hover:underline">{texto}</Link>;
}

/** Envolve a tela: a sessão é lida por requisição, então o conteúdo chega via streaming. */
export function Tela({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<Carregando />}>{children}</Suspense>;
}
