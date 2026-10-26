"use client";

import Link from "next/link";
import { startTransition, useActionState } from "react";
import { salvarAviso, salvarEvento, salvarHorario, type EstadoForm } from "@/app/admin/actions";
import { DIAS_SEMANA } from "@/lib/format";
import { Campo, Marcador } from "./Comuns";
import { estilo } from "./estilo";

// Envio via onSubmit: assim o React não limpa os campos quando a validação falha.
function Moldura({ titulo, estado, acao, pendente, editando, voltar, children }: {
  titulo: string;
  estado: EstadoForm;
  acao: (fd: FormData) => void;
  pendente: boolean;
  editando: boolean;
  voltar: string;
  children: React.ReactNode;
}) {
  function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => acao(fd));
  }

  return (
    <form onSubmit={enviar} className={`${estilo.cartao} space-y-4 p-5`}>
      <h2 className="font-semibold text-slate-900">{titulo}</h2>
      {estado.erro && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{estado.erro}</p>}
      {children}
      <div className="flex gap-2 pt-2">
        <button type="submit" disabled={pendente} className={estilo.botaoPrimario}>
          {pendente ? "Salvando…" : editando ? "Salvar alterações" : "Cadastrar"}
        </button>
        {editando && <Link href={voltar} className={estilo.botaoSecundario}>Cancelar</Link>}
      </div>
    </form>
  );
}

// ---------------------------------------------------------------- Aviso

export type AvisoForm = {
  id: string; titulo: string; conteudo: string; destaque: boolean; publicado: boolean;
  data_publicacao: string; expira_em: string;
};

export function FormAviso({ aviso }: { aviso?: AvisoForm }) {
  const [estado, acao, pendente] = useActionState(salvarAviso, {});
  const c = estado.campos ?? {};
  return (
    <Moldura titulo={aviso ? "Editar aviso" : "Novo aviso"} estado={estado} acao={acao} pendente={pendente} editando={!!aviso} voltar="/admin/avisos">
      {aviso && <input type="hidden" name="id" value={aviso.id} />}
      <Campo id="titulo" rotulo="Título *" erros={c.titulo}>
        <input id="titulo" name="titulo" required maxLength={140} defaultValue={aviso?.titulo} className={estilo.campo} />
      </Campo>
      <Campo id="conteudo" rotulo="Texto do aviso *" erros={c.conteudo}>
        <textarea id="conteudo" name="conteudo" required maxLength={2000} rows={4} defaultValue={aviso?.conteudo} className={estilo.campo} />
      </Campo>
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo id="data_publicacao" rotulo="Publicar em" erros={c.data_publicacao} dica="Vazio = agora. Datas futuras ficam agendadas.">
          <input id="data_publicacao" name="data_publicacao" type="datetime-local" defaultValue={aviso?.data_publicacao} className={estilo.campo} />
        </Campo>
        <Campo id="expira_em" rotulo="Sai do site em" erros={c.expira_em} dica="Opcional. Depois desta data o aviso some.">
          <input id="expira_em" name="expira_em" type="datetime-local" defaultValue={aviso?.expira_em} className={estilo.campo} />
        </Campo>
      </div>
      <div className="flex flex-wrap gap-6">
        <Marcador nome="publicado" rotulo="Publicado" padrao={aviso?.publicado ?? true} />
        <Marcador nome="destaque" rotulo="Destaque (aparece primeiro)" padrao={aviso?.destaque ?? false} />
      </div>
    </Moldura>
  );
}

// ---------------------------------------------------------------- Horário

export type HorarioForm = {
  id: string; dia_semana: number; hora: string; tipo: string; local: string; observacao: string; ativo: boolean;
};

export function FormHorario({ horario }: { horario?: HorarioForm }) {
  const [estado, acao, pendente] = useActionState(salvarHorario, {});
  const c = estado.campos ?? {};
  return (
    <Moldura titulo={horario ? "Editar horário" : "Novo horário"} estado={estado} acao={acao} pendente={pendente} editando={!!horario} voltar="/admin/horarios">
      {horario && <input type="hidden" name="id" value={horario.id} />}
      <div className="grid gap-4 sm:grid-cols-3">
        <Campo id="dia_semana" rotulo="Dia *" erros={c.dia_semana}>
          <select id="dia_semana" name="dia_semana" defaultValue={horario?.dia_semana ?? 0} className={estilo.campo}>
            {DIAS_SEMANA.map((d, i) => <option key={d} value={i}>{d}</option>)}
          </select>
        </Campo>
        <Campo id="hora" rotulo="Hora *" erros={c.hora}>
          <input id="hora" name="hora" type="time" required defaultValue={horario?.hora} className={estilo.campo} />
        </Campo>
        <Campo id="tipo" rotulo="Celebração *" erros={c.tipo}>
          <input id="tipo" name="tipo" required maxLength={60} defaultValue={horario?.tipo ?? "Missa"} className={estilo.campo} />
        </Campo>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo id="local" rotulo="Local" erros={c.local} dica="Ex.: Capela São José. Vazio = igreja matriz.">
          <input id="local" name="local" maxLength={120} defaultValue={horario?.local} className={estilo.campo} />
        </Campo>
        <Campo id="observacao" rotulo="Observação" erros={c.observacao}>
          <input id="observacao" name="observacao" maxLength={200} defaultValue={horario?.observacao} className={estilo.campo} />
        </Campo>
      </div>
      <Marcador nome="ativo" rotulo="Ativo (aparece no site)" padrao={horario?.ativo ?? true} />
    </Moldura>
  );
}

// ---------------------------------------------------------------- Evento

export type EventoForm = {
  id: string; titulo: string; descricao: string; data_inicio: string; data_fim: string;
  local: string; link_inscricao: string; publicado: boolean;
};

export function FormEvento({ evento }: { evento?: EventoForm }) {
  const [estado, acao, pendente] = useActionState(salvarEvento, {});
  const c = estado.campos ?? {};
  return (
    <Moldura titulo={evento ? "Editar evento" : "Novo evento"} estado={estado} acao={acao} pendente={pendente} editando={!!evento} voltar="/admin/eventos">
      {evento && <input type="hidden" name="id" value={evento.id} />}
      <Campo id="titulo" rotulo="Título *" erros={c.titulo}>
        <input id="titulo" name="titulo" required maxLength={140} defaultValue={evento?.titulo} className={estilo.campo} />
      </Campo>
      <Campo id="descricao" rotulo="Descrição" erros={c.descricao}>
        <textarea id="descricao" name="descricao" maxLength={3000} rows={3} defaultValue={evento?.descricao} className={estilo.campo} />
      </Campo>
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo id="data_inicio" rotulo="Início *" erros={c.data_inicio}>
          <input id="data_inicio" name="data_inicio" type="datetime-local" required defaultValue={evento?.data_inicio} className={estilo.campo} />
        </Campo>
        <Campo id="data_fim" rotulo="Término" erros={c.data_fim}>
          <input id="data_fim" name="data_fim" type="datetime-local" defaultValue={evento?.data_fim} className={estilo.campo} />
        </Campo>
        <Campo id="local" rotulo="Local" erros={c.local}>
          <input id="local" name="local" maxLength={160} defaultValue={evento?.local} className={estilo.campo} />
        </Campo>
        <Campo id="link_inscricao" rotulo="Link de inscrição" erros={c.link_inscricao} dica="Opcional, deve começar com https://">
          <input id="link_inscricao" name="link_inscricao" type="url" maxLength={500} placeholder="https://"
            defaultValue={evento?.link_inscricao} className={estilo.campo} />
        </Campo>
      </div>
      <Marcador nome="publicado" rotulo="Publicado" padrao={evento?.publicado ?? true} />
    </Moldura>
  );
}
