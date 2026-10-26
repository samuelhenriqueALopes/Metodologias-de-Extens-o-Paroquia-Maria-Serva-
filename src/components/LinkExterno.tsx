import type { AnchorHTMLAttributes } from "react";

/** Link para fora do site: sempre em nova aba, sem vazar referer nem window.opener. */
export function LinkExterno({ children, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <a target="_blank" rel="noopener noreferrer" {...props}>
      {children}
      <span className="sr-only"> (abre em nova aba)</span>
    </a>
  );
}
