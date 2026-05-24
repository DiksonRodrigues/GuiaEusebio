import { MetadataRoute } from "next";
import { supabase } from "@/lib/supabase";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://guiaeusebio.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  const [{ data: businesses }, { data: neighborhoods }] = await Promise.all([
    supabase.from("businesses").select("slug, updated_at").order("name"),
    supabase.from("neighborhoods").select("slug, updated_at").eq("is_active", true),
  ]);

  const businessUrls: MetadataRoute.Sitemap = (businesses ?? []).map((b) => ({
    url: `${BASE_URL}/business/${b.slug}`,
    lastModified: b.updated_at ?? now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const neighborhoodUrls: MetadataRoute.Sitemap = (neighborhoods ?? []).map((n) => ({
    url: `${BASE_URL}/bairros/${n.slug}`,
    lastModified: n.updated_at ?? now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [
    { url: BASE_URL, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/categories`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/bairros`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/cupons`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/supermercados`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    ...businessUrls,
    ...neighborhoodUrls,
  ];
}
