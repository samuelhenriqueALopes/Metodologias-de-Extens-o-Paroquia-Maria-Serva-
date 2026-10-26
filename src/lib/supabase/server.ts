import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Nenhum cliente Supabase roda no navegador: toda leitura e escrita passa pelo
// servidor do Next.js, então nenhuma chave é enviada ao visitante.

const url = process.env.SUPABASE_URL;
const anonKey = process.env.SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const options = {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
} as const;

let publicClient: SupabaseClient | null | undefined;
let serviceClient: SupabaseClient | null | undefined;

/** Cliente com a chave anon: só enxerga o que as policies de RLS liberam. */
export function getPublicClient(): SupabaseClient | null {
  if (publicClient === undefined) {
    publicClient = url && anonKey ? createClient(url, anonKey, options) : null;
  }
  return publicClient;
}

/** Cliente com service_role: usado APENAS em Server Actions para gravar inscrições. */
export function getServiceClient(): SupabaseClient | null {
  if (serviceClient === undefined) {
    serviceClient = url && serviceRoleKey ? createClient(url, serviceRoleKey, options) : null;
  }
  return serviceClient;
}
