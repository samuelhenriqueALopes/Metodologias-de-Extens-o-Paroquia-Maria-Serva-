import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { endurecerCookie } from "@/lib/supabase/cookies";
import { chavePublicavel, supabaseUrl } from "@/lib/supabase/env";

// Renova a sessão do Supabase e manda para o login quem não está autenticado.
// É só a primeira barreira: cada página/ação do painel verifica de novo.
export async function proxy(request: NextRequest) {
  const url = supabaseUrl();
  const chave = chavePublicavel();
  const naLogin = request.nextUrl.pathname === "/admin/login";

  let response = NextResponse.next({ request });
  if (!url || !chave) {
    return naLogin ? response : NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const supabase = createServerClient(url, chave, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (lista) => {
        lista.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        lista.forEach(({ name, value, options }) => response.cookies.set(name, value, endurecerCookie(options)));
      },
    },
  });

  const { data } = await supabase.auth.getUser();

  if (!data.user && !naLogin) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};