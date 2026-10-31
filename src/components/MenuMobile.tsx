"use client";

import { useEffect, useState } from "react";
import type { ItemMenu } from "@/lib/types";
import { IconeFechar, IconeMenu } from "./Icones";
import { NavLink } from "./NavLink";

export function MenuMobile({ navegacao }: { navegacao: ItemMenu[] }) {
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    if (!aberto) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAberto(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [aberto]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        aria-controls="menu-mobile"
        className="rounded-md p-2 text-mariano-900 hover:bg-mariano-50"
      >
        {aberto ? <IconeFechar className="size-6" /> : <IconeMenu className="size-6" />}
        <span className="sr-only">{aberto ? "Fechar menu" : "Abrir menu"}</span>
      </button>

      {aberto && (
        <nav id="menu-mobile" aria-label="Principal" className="absolute inset-x-0 top-full border-b border-mariano-100 bg-white shadow-lg">
          <ul className="mx-auto max-w-7xl space-y-1 px-4 py-4">
            {navegacao.map((item) => (
              <li key={item.href}>
                <NavLink href={item.href} onClick={() => setAberto(false)}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
