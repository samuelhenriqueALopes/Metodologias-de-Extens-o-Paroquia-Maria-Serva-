"use client";

import { useActionState } from "react";
import { entrar, type LoginState } from "./actions";
import { estilo } from "@/components/admin/estilo";

export function FormLogin({ avisoInicial }: { avisoInicial?: string }) {
  const [estado, acao, enviando] = useActionState<LoginState, FormData>(entrar, {});
  const erro = estado.erro ?? avisoInicial;

  return (
    <form action={acao} className="space-y-4">
      {erro && <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>}
      <div>
        <label htmlFor="email" className={estilo.rotulo}>E-mail</label>
        <input id="email" name="email" type="email" required autoComplete="username" maxLength={160}
          defaultValue={estado.email} className={estilo.campo} />
      </div>
      <div>
        <label htmlFor="senha" className={estilo.rotulo}>Senha</label>
        <input id="senha" name="senha" type="password" required autoComplete="current-password" minLength={8} maxLength={128}
          className={estilo.campo} />
      </div>
      <button type="submit" disabled={enviando} className={`${estilo.botaoPrimario} w-full`}>
        {enviando ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
