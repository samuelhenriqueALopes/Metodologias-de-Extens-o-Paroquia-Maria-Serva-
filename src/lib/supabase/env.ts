// Variáveis do Supabase em um só lugar (usado pelo proxy, pelo painel e pelo site).
// Nomes atuais: SUPABASE_PUBLISHABLE_KEY (sb_publishable_...) e SUPABASE_SECRET_KEY (sb_secret_...).
// Os nomes antigos (SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY) ainda são aceitos como
// reserva, para quem não trocou as chaves ainda - o Supabase vai descontinuá-las até o fim de 2026.

export function supabaseUrl() {
  return process.env.SUPABASE_URL;
}

/** Chave publishable: só enxerga o que as policies de RLS liberam. */
export function chavePublicavel() {
  return process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
}

/** Chave secret: ignora o RLS. Somente no servidor. */
export function chaveSecreta() {
  return process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
}