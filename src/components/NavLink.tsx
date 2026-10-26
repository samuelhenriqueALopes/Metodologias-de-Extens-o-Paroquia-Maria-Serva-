"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  const pathname = usePathname();
  const ativo = href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={ativo ? "page" : undefined}
      className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        ativo ? "bg-mariano-50 text-mariano-800" : "text-tinta/80 hover:bg-mariano-50 hover:text-mariano-800"
      }`}
    >
      {children}
    </Link>
  );
}
