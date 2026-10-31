import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

export const IconeCruz = (p: P) => (
  <svg {...base} {...p}><path d="M12 2v20M7 7h10" /></svg>
);
export const IconeEstrela = (p: P) => (
  <svg {...base} fill="currentColor" stroke="none" {...p}><path d="m12 2 2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 21l1.6-7L2 9.2l7.1-.6z" /></svg>
);
export const IconeRelogio = (p: P) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
export const IconeCalendario = (p: P) => (
  <svg {...base} {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>
);
export const IconeLocal = (p: P) => (
  <svg {...base} {...p}><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
);
export const IconeTelefone = (p: P) => (
  <svg {...base} {...p}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>
);
export const IconeEmail = (p: P) => (
  <svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
);
export const IconeMegafone = (p: P) => (
  <svg {...base} {...p}><path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1zM15 9a3 3 0 0 1 0 6M18 6a7 7 0 0 1 0 12" /></svg>
);
export const IconeCoracao = (p: P) => (
  <svg {...base} {...p}><path d="M12 20s-8-4.8-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6.2-8 11-8 11z" /></svg>
);
export const IconeSetaDireita = (p: P) => (
  <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const IconeSetaEsquerda = (p: P) => (
  <svg {...base} {...p}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
);
export const IconeSetaCimaDireita = (p: P) => (
  <svg {...base} {...p}><path d="M7 17L17 7M8 7h9v9" /></svg>
);
export const IconeMenu = (p: P) => (
  <svg {...base} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const IconeFechar = (p: P) => (
  <svg {...base} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const IconeCheck = (p: P) => (
  <svg {...base} {...p}><path d="m5 12 5 5L20 7" /></svg>
);
export const IconeDot = (p: P) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="1" fill="currentColor" /></svg>
);
export const IconeExterno = (p: P) => (
  <svg {...base} {...p}><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></svg>
);
export const IconeWhatsapp = (p: P) => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3z" />
  </svg>
);
export const IconeInstagram = (p: P) => (
  <svg {...base} {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".6" fill="currentColor" /></svg>
);
export const IconeFacebook = (p: P) => (
  <svg {...base} {...p}><path d="M15 3h-2a4 4 0 0 0-4 4v3H7v4h2v7h4v-7h3l1-4h-4V7a1 1 0 0 1 1-1h2z" /></svg>
);
export const IconeYoutube = (p: P) => (
  <svg {...base} {...p}><rect x="2" y="5" width="20" height="14" rx="4" /><path d="m10 9 5 3-5 3z" fill="currentColor" /></svg>
);

// Ícones das pastorais
export const IconeAliancas = (p: P) => (
  <svg {...base} {...p}><circle cx="9" cy="14" r="5" /><circle cx="15" cy="14" r="5" /><path d="m10 5 2-2 2 2" /></svg>
);
export const IconeVela = (p: P) => (
  <svg {...base} {...p}><rect x="9" y="10" width="6" height="11" rx="1" /><path d="M12 10V8M12 3c1.5 1.5 1.5 3 0 4.5C10.5 6 10.5 4.5 12 3z" /></svg>
);
export const IconeCalice = (p: P) => (
  <svg {...base} {...p}><path d="M6 3h12c0 5-2.7 8-6 8S6 8 6 3zM12 11v7M8 21h8M9 18h6" /></svg>
);
export const IconeMaos = (p: P) => (
  <svg {...base} {...p}><path d="M12 21V11c0-2-1.5-4-3-6M12 11c0-2 1.5-4 3-6M9 5 6 12c-.6 1.6 0 3 1 4l5 5M15 5l3 7c.6 1.6 0 3-1 4l-5 5" /></svg>
);

export const iconesPastorais = {
  aliancas: IconeAliancas,
  vela: IconeVela,
  calice: IconeCalice,
  maos: IconeMaos,
};
