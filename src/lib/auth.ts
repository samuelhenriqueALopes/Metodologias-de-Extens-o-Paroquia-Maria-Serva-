import "server-only";
import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { endurecerCookie } from "@/lib/supabase/cookies";

// Camada de acesso do painel: TODA página e Server Action do /admin passa por
// exigirAdmin(). O proxy só faz um redirecionamento otimista; quem garante o
// acesso é esta verificação + o RLS do banco.

export function supabaseConfigurado() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
}

/** Cliente Supabase com a sessão do usuário (cookies). Sujeito ao RLS. */
export async function getSupabaseSessao(): Promise<SupabaseClient | null> {
  // Lê os cookies antes de tudo: marca a rota como dinâmica (nunca pré-renderizada).
  const cookieStore = await cookies();
  if (!supabaseConfigurado()) return null;

  return createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (lista) => {
        try {
          lista.forEach(({ name, value, options }) => cookieStore.set(name, value, endurecerCookie(options)));
        } catch {
          // Chamado de um Server Component: o proxy já renovou a sessão.
        }
      },
    },
  });
}

export type Admin = { id: string; email: string };

/** Garante usuário autenticado E cadastrado como administrador (memoizado por requisição). */
export const exigirAdmin = cache(async (): Promise<{ supabase: SupabaseClient; admin: Admin }> => {
  const supabase = await getSupabaseSessao();
  if (!supabase) redirect("/admin/login");

  // getUser() valida o token no servidor do Supabase (não confia só no cookie).
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/admin/login");

  const { data: ehAdmin } = await supabase.rpc("is_admin");
  if (ehAdmin !== true) {
    await supabase.auth.signOut();
    redirect("/admin/login?erro=acesso");
  }

  return { supabase, admin: { id: data.user.id, email: data.user.email ?? "" } };
});
