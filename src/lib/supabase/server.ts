import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { chavePublicavel, chaveSecreta, supabaseUrl } from "./env";

// Nenhum cliente Supabase roda no navegador: toda leitura e escrita passa pelo
// servidor do Next.js, então nenhuma chave é enviada ao visitante.

const url = supabaseUrl();
const publishableKey = chavePublicavel();
const secretKey = chaveSecreta();

const options = {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
} as const;

let publicClient: SupabaseClient | null | undefined;
let serviceClient: SupabaseClient | null | undefined;

/** Cliente com a chave publishable: só enxerga o que as policies de RLS liberam. */
export function getPublicClient(): SupabaseClient | null {
  if (publicClient === undefined) {
    publicClient = url && publishableKey ? createClient(url, publishableKey, options) : null;
  }
  return publicClient;
}

/** Cliente com a chave secret: usado APENAS em Server Actions para gravar inscrições. */
export function getServiceClient(): SupabaseClient | null {
  if (serviceClient === undefined) {
    serviceClient = url && secretKey ? createClient(url, secretKey, options) : null;
  }
  return serviceClient;
}