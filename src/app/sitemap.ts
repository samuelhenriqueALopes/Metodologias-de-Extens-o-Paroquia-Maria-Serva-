import type { MetadataRoute } from "next";
import { navegacao, site } from "@/config/site";
import { pastorais } from "@/content/pastorais";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...navegacao.map((n) => ({ url: `${site.url}${n.href === "/" ? "" : n.href}` })),
    ...pastorais.map((p) => ({ url: `${site.url}/pastorais/${p.slug}` })),
  ];
}
