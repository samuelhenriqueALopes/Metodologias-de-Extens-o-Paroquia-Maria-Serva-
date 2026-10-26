"use client";

import { alterarStatusInscricao } from "@/app/admin/actions";

export const ROTULOS_STATUS = { novo: "Novo", em_contato: "Em contato", concluido: "Concluído" } as const;

export function SeletorStatus({ id, status, filtros }: { id: string; status: string; filtros: string }) {
  return (
    <form action={alterarStatusInscricao}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="filtros" value={filtros} />
      <label className="sr-only" htmlFor={`status-${id}`}>Status</label>
      <select id={`status-${id}`} name="status" defaultValue={status}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs">
        {Object.entries(ROTULOS_STATUS).map(([v, r]) => <option key={v} value={v}>{r}</option>)}
      </select>
    </form>
  );
}
