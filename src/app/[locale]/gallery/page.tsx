import { getTranslations, setRequestLocale } from "next-intl/server";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { PageHero } from "@/components/ui/PageHero";
import { apiGet, type GalleryAlbum } from "@/lib/api";

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("gallery");
  const albums = (await apiGet<GalleryAlbum[]>("/api/gallery/", locale)) ?? [];

  return (
    <div>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <GalleryGrid albums={albums} />
      </div>
    </div>
  );
}
