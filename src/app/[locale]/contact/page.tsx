import { Mail, MapPin, Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/contact/ContactForm";
import { FacebookIcon, InstagramIcon, YoutubeIcon } from "@/components/icons/Social";
import { PageHero } from "@/components/ui/PageHero";
import { apiGet, type SiteSettings } from "@/lib/api";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const site = await apiGet<SiteSettings>("/api/site/", locale);

  return (
    <div>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-3xl border border-igqs-gold/20 bg-white p-6 dark:bg-[#0d1f18]">
            <p className="flex gap-3 text-sm">
              <MapPin className="mt-0.5 h-5 w-5 text-igqs-gold" />
              <span>
                <strong className="block">{t("address")}</strong>
                {site?.address}
              </span>
            </p>
            <p className="mt-4 flex gap-3 text-sm">
              <Phone className="mt-0.5 h-5 w-5 text-igqs-gold" />
              <span>
                <strong className="block">{t("phone")}</strong>
                {site?.phone_primary}
                {site?.phone_secondary ? <span className="block">{site.phone_secondary}</span> : null}
              </span>
            </p>
            <p className="mt-4 flex gap-3 text-sm">
              <Mail className="mt-0.5 h-5 w-5 text-igqs-gold" />
              <span>
                <strong className="block">{t("email")}</strong>
                {site?.email}
              </span>
            </p>
            <p className="mt-4 text-sm">
              <strong className="block">{t("hours")}</strong>
              {site?.office_hours}
            </p>
            <div className="mt-6 flex gap-2">
              {site?.facebook_url && (
                <a href={site.facebook_url} aria-label={t("facebook")} className="inline-flex h-11 w-11 items-center justify-center">
                  <FacebookIcon className="h-5 w-5" />
                </a>
              )}
              {site?.youtube_url && (
                <a href={site.youtube_url} aria-label={t("youtube")} className="inline-flex h-11 w-11 items-center justify-center">
                  <YoutubeIcon className="h-5 w-5" />
                </a>
              )}
              {site?.instagram_url && (
                <a href={site.instagram_url} aria-label={t("instagram")} className="inline-flex h-11 w-11 items-center justify-center">
                  <InstagramIcon className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
          {site?.map_embed_url && (
            <iframe
              title={t("map")}
              src={site.map_embed_url}
              className="h-72 w-full rounded-3xl border-0"
              loading="lazy"
            />
          )}
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
