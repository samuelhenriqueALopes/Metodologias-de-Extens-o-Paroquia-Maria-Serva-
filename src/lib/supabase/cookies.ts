import type { CookieOptions } from "@supabase/ssr";

// Nenhum código no navegador lê a sessão, então os cookies podem ser httpOnly
// (inacessíveis a scripts, mesmo em caso de XSS).
export function endurecerCookie(options: CookieOptions): CookieOptions {
  return {
    ...options,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  };
}
