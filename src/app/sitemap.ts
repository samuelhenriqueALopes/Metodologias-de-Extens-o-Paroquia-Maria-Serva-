import type { MetadataRoute } from "next";
import { getNavegacao, getPastorais, getSite } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [site, navegacao, pastorais] = await Promise.all([getSite(), getNavegacao(), getPastorais()]);
  return [
    ...navegacao.map((n) => ({ url: `${site.url}${n.href === "/" ? "" : n.href}` })),
    ...pastorais.map((p) => ({ url: `${site.url}/pastorais/${p.slug}` })),
  ];
}
