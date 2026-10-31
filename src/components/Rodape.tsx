import Link from "next/link";
import { getNavegacao, getPastorais, getSite } from "@/lib/data";
import { linkWhatsapp } from "@/lib/format";
import { IconeDot, IconeEmail, IconeEstrela, IconeLocal, IconeRelogio, IconeTelefone, IconeWhatsapp } from "./Icones";
import { LinkExterno } from "./LinkExterno";

export async function Rodape() {
  const [site, navegacao, pastorais] = await Promise.all([getSite(), getNavegacao(), getPastorais()]);
  const whats = linkWhatsapp(site.whatsappSecretaria, site.mensagemWhatsapp);

  return (
    <footer className="mt-auto bg-mariano-950 text-mariano-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif text-2xl font-bold text-white">{site.nome}</p>
          <p className="mt-3 text-sm italic text-mariano-200">
            “{site.lema}” <span className="not-italic text-ouro-400">({site.lemaReferencia})</span>
          </p>
          <p className="mt-4 text-xs uppercase tracking-widest text-mariano-300">{site.arquidiocese}</p>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-ouro-400">Navegação</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {navegacao.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-ouro-400">Pastorais</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {pastorais.map((p) => (
              <li key={p.slug}>
                <Link href={`/pastorais/${p.slug}`} className="hover:text-white">{p.nome}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-ouro-400">Secretaria</h2>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex gap-2">
              <IconeLocal className="mt-0.5 size-4 shrink-0 text-ouro-400" />
              <span>
                {site.endereco.logradouro}, {site.endereco.bairro}
                <br />
                {site.endereco.cidade} <IconeDot className="inline-block size-4" /> CEP {site.endereco.cep}
              </span>
            </li>
            <li className="flex gap-2">
              <IconeRelogio className="mt-0.5 size-4 shrink-0 text-ouro-400" />
              <span>{site.secretariaHorario}</span>
            </li>
            <li className="flex gap-2">
              <IconeTelefone className="mt-0.5 size-4 shrink-0 text-ouro-400" />
              <span>{site.telefone}</span>
            </li>
            <li className="flex gap-2">
              <IconeEmail className="mt-0.5 size-4 shrink-0 text-ouro-400" />
              <a href={`mailto:${site.email}`} className="min-w-0 break-all hover:text-white">{site.email}</a>
            </li>
            {whats && (
              <li className="flex gap-2">
                <IconeWhatsapp className="mt-0.5 size-4 shrink-0 text-ouro-400" />
                <LinkExterno href={whats} className="hover:text-white">Fale pelo WhatsApp</LinkExterno>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-mariano-900">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-mariano-300 sm:flex-row">
          <p>© {site.nome}. Todos os direitos reservados.</p>
          {site.divisa && (
            <p className="flex items-center gap-1.5">
              <IconeEstrela className="size-3 text-ouro-400" /> {site.divisa}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
