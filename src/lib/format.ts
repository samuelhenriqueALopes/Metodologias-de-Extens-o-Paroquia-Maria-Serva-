const TZ = "America/Sao_Paulo";

export const DIAS_SEMANA = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

/** "19:30:00" -> "19h30", "07:00" -> "7h" */
export function formatarHora(hora: string) {
  const [h, m] = hora.split(":");
  return `${Number(h)}h${m && m !== "00" ? m : ""}`;
}

export function formatarData(iso: string, opcoes: Intl.DateTimeFormatOptions = { day: "2-digit", month: "long", year: "numeric" }) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: TZ, ...opcoes }).format(new Date(iso));
}

export function partesData(iso: string) {
  const d = new Date(iso);
  const f = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat("pt-BR", { timeZone: TZ, ...o }).format(d);
  return {
    dia: f({ day: "2-digit" }),
    mes: f({ month: "short" }).replace(".", ""),
    semana: f({ weekday: "long" }),
    hora: f({ hour: "2-digit", minute: "2-digit" }).replace(":", "h"),
  };
}

/** ISO -> "AAAA-MM-DDTHH:mm" no fuso de Brasília (valor de <input type="datetime-local">). */
export function paraInputLocal(iso: string | null | undefined) {
  if (!iso) return "";
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    }).formatToParts(new Date(iso)).map((x) => [x.type, x.value]),
  );
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}`;
}

/** "AAAA-MM-DDTHH:mm" digitado no painel -> ISO. Brasília não tem horário de verão desde 2019 (UTC-3). */
export function deInputLocal(valor: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(valor)) return null;
  const d = new Date(`${valor}:00-03:00`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/** Monta link wa.me aceitando somente dígitos e codificando a mensagem. */
export function linkWhatsapp(numero: string, mensagem?: string) {
  const digitos = numero.replace(/\D/g, "");
  if (!/^\d{10,13}$/.test(digitos)) return null;
  const texto = mensagem ? `?text=${encodeURIComponent(mensagem)}` : "";
  return `https://wa.me/${digitos}${texto}`;
}

/** Aceita apenas URLs https (evita javascript:, data: etc.). */
export function urlSegura(url: string | null | undefined) {
  if (!url) return null;
  try {
    const u = new URL(url);
    return u.protocol === "https:" ? u.toString() : null;
  } catch {
    return null;
  }
}
