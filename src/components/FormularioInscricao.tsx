"use client";

import { useActionState, useEffect, useRef } from "react";
import { enviarInscricao, type InscricaoState } from "@/app/actions/inscricao";
import type { SetorFormulario } from "@/content/pastorais";
import { IconeCheck } from "./Icones";

const inicial: InscricaoState = { status: "idle" };

const campo =
  "mt-1 block w-full rounded-lg border border-mariano-200 bg-white px-3.5 py-2.5 text-sm shadow-xs outline-none transition placeholder:text-tinta/40 focus:border-mariano-500 focus:ring-2 focus:ring-mariano-200 aria-invalid:border-red-400";

function Erro({ id, msgs }: { id: string; msgs?: string[] }) {
  if (!msgs?.length) return null;
  return <p id={id} className="mt-1 text-xs text-red-600">{msgs[0]}</p>;
}

export function FormularioInscricao({ setor, titulo = "Quero participar" }: { setor: SetorFormulario; titulo?: string }) {
  const [estado, acao, enviando] = useActionState(enviarInscricao, inicial);
  const montadoEm = useRef(0);

  // Marca o momento em que o formulário ficou visível (anti-robô).
  useEffect(() => {
    montadoEm.current = Date.now();
  }, []);

  function enviar(formData: FormData) {
    formData.set("_t", String(montadoEm.current));
    acao(formData);
  }

  // Após um erro o React limpa o formulário; restauramos o que foi digitado.
  const v: Partial<NonNullable<InscricaoState["valores"]>> = estado.valores ?? {};

  if (estado.status === "success") {
    return (
      <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-emerald-600 text-white">
          <IconeCheck className="size-6" />
        </span>
        <p className="mt-4 font-serif text-2xl font-bold text-emerald-900">Obrigado!</p>
        <p className="mt-1 text-sm text-emerald-800">{estado.message}</p>
      </div>
    );
  }

  const fe = estado.fieldErrors ?? {};

  return (
    <form action={enviar} noValidate className="rounded-2xl border border-mariano-100 bg-white p-6 shadow-sm sm:p-8">
      <h3 className="font-serif text-2xl font-bold text-mariano-950">{titulo}</h3>
      <p className="mt-1 text-sm text-tinta/70">Preencha e a equipe responsável entrará em contato.</p>

      <input type="hidden" name="setor" value={setor} />
      {/* Honeypot: invisível para pessoas, atraente para robôs */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {estado.status === "error" && estado.message && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{estado.message}</p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor={`${setor}-nome`} className="text-sm font-medium">Nome completo *</label>
          <input id={`${setor}-nome`} name="nome" defaultValue={v.nome} required maxLength={120} autoComplete="name" className={campo}
            aria-invalid={!!fe.nome} aria-describedby={fe.nome ? `${setor}-nome-erro` : undefined} />
          <Erro id={`${setor}-nome-erro`} msgs={fe.nome} />
        </div>
        <div>
          <label htmlFor={`${setor}-tel`} className="text-sm font-medium">WhatsApp / telefone *</label>
          <input id={`${setor}-tel`} name="telefone" defaultValue={v.telefone} type="tel" required maxLength={20} inputMode="tel" autoComplete="tel"
            placeholder="(31) 90000-0000" className={campo}
            aria-invalid={!!fe.telefone} aria-describedby={fe.telefone ? `${setor}-tel-erro` : undefined} />
          <Erro id={`${setor}-tel-erro`} msgs={fe.telefone} />
        </div>
        <div>
          <label htmlFor={`${setor}-email`} className="text-sm font-medium">E-mail</label>
          <input id={`${setor}-email`} name="email" defaultValue={v.email} type="email" maxLength={160} autoComplete="email" className={campo}
            aria-invalid={!!fe.email} aria-describedby={fe.email ? `${setor}-email-erro` : undefined} />
          <Erro id={`${setor}-email-erro`} msgs={fe.email} />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={`${setor}-msg`} className="text-sm font-medium">Mensagem</label>
          <textarea id={`${setor}-msg`} name="mensagem" defaultValue={v.mensagem} rows={4} maxLength={1000} className={campo}
            aria-invalid={!!fe.mensagem} aria-describedby={fe.mensagem ? `${setor}-msg-erro` : undefined} />
          <Erro id={`${setor}-msg-erro`} msgs={fe.mensagem} />
        </div>
        <div className="sm:col-span-2">
          <label className="flex items-start gap-2.5 text-sm text-tinta/80">
            <input type="checkbox" name="consentimento" required className="mt-0.5 size-4 accent-mariano-700"
              aria-invalid={!!fe.consentimento} />
            <span>Autorizo a paróquia a usar meus dados apenas para entrar em contato sobre este pedido (LGPD).</span>
          </label>
          <Erro id={`${setor}-consent-erro`} msgs={fe.consentimento} />
        </div>
      </div>

      <button type="submit" disabled={enviando}
        className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-mariano-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-mariano-800 disabled:opacity-60 sm:w-auto">
        {enviando ? "Enviando…" : "Enviar"}
      </button>
    </form>
  );
}
