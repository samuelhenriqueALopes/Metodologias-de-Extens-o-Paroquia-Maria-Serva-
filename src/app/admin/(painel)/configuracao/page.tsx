import type { Metadata } from "next";
import { salvarConfiguracoes } from "@/app/admin/actions";
import { Campo } from "@/components/admin/Comuns";
import { estilo } from "@/components/admin/estilo";
import { MensagemOk, Tela, TituloPainel } from "@/components/admin/Layout";
import { exigirAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Configurações do site" };

type Configuracoes = {
  nome: string; nome_curto: string; lema: string; lema_referencia: string; divisa: string | null;
  arquidiocese: string; logradouro: string; bairro: string; cidade: string; cep: string; maps_url: string | null;
  telefone: string; email: string; whatsapp_secretaria: string; mensagem_whatsapp: string; secretaria_horario: string;
  instagram_url: string | null; facebook_url: string | null; youtube_url: string | null;
  dizimo_chave_pix: string; dizimo_favorecido: string;
};

const secoes = "rounded-xl border border-slate-200 bg-white shadow-sm";
const tituloSecao = "border-b border-slate-100 px-5 py-4";
const grade = "grid gap-4 p-5 sm:grid-cols-2";

function CampoTexto({ nome, rotulo, valor, maxLength, tipo = "text", dica }: {
  nome: keyof Configuracoes; rotulo: string; valor: string; maxLength?: number; tipo?: string; dica?: string;
}) {
  return <Campo id={nome} rotulo={rotulo} dica={dica}>
    <input id={nome} name={nome} type={tipo} maxLength={maxLength} defaultValue={valor} className={estilo.campo} />
  </Campo>;
}

function CampoArea({ nome, rotulo, valor, maxLength, linhas = 3 }: {
  nome: keyof Configuracoes; rotulo: string; valor: string; maxLength?: number; linhas?: number;
}) {
  return <Campo id={nome} rotulo={rotulo}>
    <textarea id={nome} name={nome} maxLength={maxLength} rows={linhas} defaultValue={valor} className={estilo.campo} />
  </Campo>;
}

async function Conteudo({ searchParams }: { searchParams: PageProps<"/admin/configuracao">["searchParams"] }) {
  const { supabase } = await exigirAdmin();
  const { ok, erro } = await searchParams;
  const { data, error } = await supabase.from("configuracoes_site").select("*").eq("id", 1).maybeSingle<Configuracoes>();
  if (error) console.error("Painel: erro ao carregar configurações:", error.message);
  const c: Configuracoes = data ?? {
    nome: "", nome_curto: "", lema: "", lema_referencia: "", divisa: "", arquidiocese: "",
    logradouro: "", bairro: "", cidade: "", cep: "", maps_url: "", telefone: "", email: "",
    whatsapp_secretaria: "", mensagem_whatsapp: "Olá! Vim pelo site da paróquia.", secretaria_horario: "",
    instagram_url: "", facebook_url: "", youtube_url: "", dizimo_chave_pix: "", dizimo_favorecido: "",
  };
  const v = (campo: keyof Configuracoes) => c[campo] ?? "";

  return <>
    <MensagemOk ok={ok} />
    {erro && <p role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{erro === "validacao" ? "Confira os campos: há informações inválidas ou fora do limite permitido." : "Não foi possível salvar as configurações. Verifique os dados e tente novamente."}</p>}
    {!data && <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">As configurações ainda não foram cadastradas. Preencha os campos abaixo para criar o registro inicial.</p>}
    <form action={salvarConfiguracoes} className="space-y-5">
      <section className={secoes}>
        <div className={tituloSecao}><h2 className="font-semibold text-slate-900">Identidade da paróquia</h2><p className="mt-1 text-sm text-slate-500">Nome, lema e identificação exibidos no site.</p></div>
        <div className={grade}>
          <CampoTexto nome="nome" rotulo="Nome completo *" valor={v("nome")} maxLength={120} />
          <CampoTexto nome="nome_curto" rotulo="Nome curto *" valor={v("nome_curto")} maxLength={80} />
          <div className="sm:col-span-2"><CampoArea nome="lema" rotulo="Lema" valor={v("lema")} maxLength={300} linhas={2} /></div>
          <CampoTexto nome="lema_referencia" rotulo="Referência bíblica" valor={v("lema_referencia")} maxLength={60} />
          <CampoTexto nome="divisa" rotulo="Divisa / frase do rodapé" valor={v("divisa")} maxLength={120} />
          <div className="sm:col-span-2"><CampoTexto nome="arquidiocese" rotulo="Arquidiocese *" valor={v("arquidiocese")} maxLength={120} /></div>
        </div>
      </section>

      <section className={secoes}>
        <div className={tituloSecao}><h2 className="font-semibold text-slate-900">Endereço</h2><p className="mt-1 text-sm text-slate-500">Localização e link para abrir o mapa.</p></div>
        <div className={grade}>
          <div className="sm:col-span-2"><CampoTexto nome="logradouro" rotulo="Logradouro e número *" valor={v("logradouro")} maxLength={160} /></div>
          <CampoTexto nome="bairro" rotulo="Bairro *" valor={v("bairro")} maxLength={120} />
          <CampoTexto nome="cidade" rotulo="Cidade / UF *" valor={v("cidade")} maxLength={120} />
          <CampoTexto nome="cep" rotulo="CEP *" valor={v("cep")} maxLength={20} />
          <CampoTexto nome="maps_url" rotulo="Link do Google Maps" valor={v("maps_url")} tipo="url" maxLength={500} dica="Opcional; use uma URL https://." />
        </div>
      </section>

      <section className={secoes}>
        <div className={tituloSecao}><h2 className="font-semibold text-slate-900">Contato e secretaria</h2><p className="mt-1 text-sm text-slate-500">Canais de atendimento exibidos no cabeçalho, rodapé e contato.</p></div>
        <div className={grade}>
          <CampoTexto nome="telefone" rotulo="Telefone *" valor={v("telefone")} maxLength={30} />
          <CampoTexto nome="email" rotulo="E-mail *" valor={v("email")} tipo="email" maxLength={160} />
          <CampoTexto nome="whatsapp_secretaria" rotulo="WhatsApp da secretaria *" valor={v("whatsapp_secretaria")} maxLength={13} dica="Somente números, incluindo código do país 55 e DDD." />
          <CampoTexto nome="secretaria_horario" rotulo="Horário da secretaria *" valor={v("secretaria_horario")} maxLength={200} />
          <div className="sm:col-span-2"><CampoArea nome="mensagem_whatsapp" rotulo="Mensagem inicial do WhatsApp *" valor={v("mensagem_whatsapp")} maxLength={300} linhas={2} /></div>
        </div>
      </section>

      <section className={secoes}>
        <div className={tituloSecao}><h2 className="font-semibold text-slate-900">Redes sociais</h2><p className="mt-1 text-sm text-slate-500">Deixe em branco as redes que não serão exibidas.</p></div>
        <div className={grade}>
          <CampoTexto nome="instagram_url" rotulo="Instagram" valor={v("instagram_url")} tipo="url" maxLength={500} />
          <CampoTexto nome="facebook_url" rotulo="Facebook" valor={v("facebook_url")} tipo="url" maxLength={500} />
          <CampoTexto nome="youtube_url" rotulo="YouTube" valor={v("youtube_url")} tipo="url" maxLength={500} />
        </div>
      </section>

      <section className={secoes}>
        <div className={tituloSecao}><h2 className="font-semibold text-slate-900">Dízimo e PIX</h2><p className="mt-1 text-sm text-slate-500">Informações utilizadas na página de dízimo.</p></div>
        <div className={grade}>
          <CampoTexto nome="dizimo_chave_pix" rotulo="Chave PIX *" valor={v("dizimo_chave_pix")} maxLength={120} />
          <CampoTexto nome="dizimo_favorecido" rotulo="Nome do favorecido *" valor={v("dizimo_favorecido")} maxLength={160} />
        </div>
      </section>

      <div className="sticky bottom-3 z-10 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">As alterações serão aplicadas ao site após salvar.</p>
        <button type="submit" className={estilo.botaoPrimario}>Salvar configurações</button>
      </div>
    </form>
  </>;
}

export default function ConfiguracaoAdminPage(props: PageProps<"/admin/configuracao">) {
  return <>
    <TituloPainel titulo="Configurações do site" descricao="Cadastre e edite os dados gerais, contatos, redes sociais e informações do dízimo." />
    <Tela><Conteudo searchParams={props.searchParams} /></Tela>
  </>;
}
