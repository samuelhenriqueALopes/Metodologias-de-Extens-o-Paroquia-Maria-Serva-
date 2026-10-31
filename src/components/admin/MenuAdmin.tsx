"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const itens = [
  { href: "/admin", label: "Visão geral" },
  { href: "/admin/avisos", label: "Avisos" },
  { href: "/admin/horarios", label: "Horários de missa" },
  { href: "/admin/eventos", label: "Eventos" },
  { href: "/admin/inscricoes", label: "Inscrições" },
  { href: "/admin/configuracao", label: "Configurações do site" },
];

export function MenuAdmin() {
  const pathname = usePathname();
  return (
    <nav aria-label="Painel">
      <ul className="flex gap-1 overflow-x-auto lg:flex-col">
        {itens.map((i) => {
          const ativo = i.href === "/admin" ? pathname === "/admin" : pathname.startsWith(i.href);
          return (
            <li key={i.href} className="shrink-0">
              <Link href={i.href} aria-current={ativo ? "page" : undefined}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                  ativo ? "bg-white/15 text-white" : "text-mariano-100 hover:bg-white/10 hover:text-white"
                }`}>
                {i.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
