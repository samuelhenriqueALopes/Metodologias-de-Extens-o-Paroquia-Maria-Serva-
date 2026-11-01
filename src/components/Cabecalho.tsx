import Image from "next/image";
import Link from "next/link";
import { getNavegacao, getSite } from "@/lib/data";
import { linkWhatsapp, urlSegura } from "@/lib/format";
import { IconeFacebook, IconeInstagram, IconeTelefone, IconeWhatsapp, IconeYoutube } from "./Icones";
import { LinkExterno } from "./LinkExterno";
import { MenuMobile } from "./MenuMobile";
import { NavLink } from "./NavLink";

export async function Cabecalho() {
  const [site, navegacao] = await Promise.all([getSite(), getNavegacao()]);
  const whats = linkWhatsapp(site.whatsappSecretaria, site.mensagemWhatsapp);
  const instagram = urlSegura(site.redes.instagram);
  const facebook = urlSegura(site.redes.facebook);
  const youtube = urlSegura(site.redes.youtube);

  return (
    <header className="sticky top-0 z-40">
      <div className="hidden bg-mariano-950 text-mariano-100 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 text-xs">
          <p className="tracking-wide">{site.arquidiocese}</p>
          <div className="flex items-center gap-5">
            <span className="flex items-center gap-1.5">
              <IconeTelefone className="size-3.5" /> {site.telefone}
            </span>
            {whats && (
              <LinkExterno href={whats} className="flex items-center gap-1.5 hover:text-white">
                <IconeWhatsapp className="size-3.5" /> WhatsApp da secretaria
              </LinkExterno>
            )}
            <span className="h-3 w-px bg-mariano-700" />
            {instagram && (
              <LinkExterno href={instagram} aria-label="Instagram" className="hover:text-white">
                <IconeInstagram className="size-4" />
              </LinkExterno>
            )}
            {facebook && (
              <LinkExterno href={facebook} aria-label="Facebook" className="hover:text-white">
                <IconeFacebook className="size-4" />
              </LinkExterno>
            )}
            {youtube && (
              <LinkExterno href={youtube} aria-label="YouTube" className="hover:text-white">
                <IconeYoutube className="size-4" />
              </LinkExterno>
            )}
          </div>
        </div>
      </div>

      <div className="border-b border-mariano-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="relative size-12 shrink-0 overflow-hidden rounded-full bg-mariano-400 ring-2 ring-ouro-400/70">
              <Image src="/images/logo_paroquia.png" alt="" fill sizes="48px" quality={75} className="object-cover" priority />
            </span>
            <span className="leading-tight">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-mariano-600">Paróquia</span>
              <span className="block font-serif text-xl font-bold text-mariano-950 sm:text-2xl">{site.nomeCurto}</span>
            </span>
          </Link>


          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navegacao.map((item) => (
                <li key={item.href}>
                  <NavLink href={item.href}>{item.label}</NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <MenuMobile navegacao={navegacao} />
        </div>
      </div>
    </header>
  );
}
