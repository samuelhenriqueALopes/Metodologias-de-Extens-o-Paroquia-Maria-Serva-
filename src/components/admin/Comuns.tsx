"use client";

import { useFormStatus } from "react-dom";
import { estilo } from "./estilo";

/** Botão de exclusão com confirmação. A ação no servidor verifica o admin de novo. */
export function BotaoExcluir({ acao, id, pergunta = "Excluir este item? Esta ação não pode ser desfeita." }: {
  acao: (fd: FormData) => Promise<void>;
  id: string;
  pergunta?: string;
}) {
  return (
    <form action={acao} onSubmit={(e) => { if (!confirm(pergunta)) e.preventDefault(); }}>
      <input type="hidden" name="id" value={id} />
      <BotaoEnviar className={estilo.botaoPerigo} texto="Excluir" />
    </form>
  );
}

export function BotaoEnviar({ texto, className = estilo.botaoPrimario }: { texto: string; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? "Aguarde…" : texto}
    </button>
  );
}

export function Campo({ id, rotulo, erros, children, dica }: {
  id: string;
  rotulo: string;
  erros?: string[];
  dica?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={estilo.rotulo}>{rotulo}</label>
      {children}
      {dica && !erros?.length && <p className="mt-1 text-xs text-slate-500">{dica}</p>}
      {erros?.length ? <p className={estilo.erro}>{erros[0]}</p> : null}
    </div>
  );
}

export function Marcador({ nome, rotulo, padrao }: { nome: string; rotulo: string; padrao: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm text-slate-700">
      <input type="checkbox" name={nome} defaultChecked={padrao} className="size-4 accent-mariano-700" />
      {rotulo}
    </label>
  );
}
