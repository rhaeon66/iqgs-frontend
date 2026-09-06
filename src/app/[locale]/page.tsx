import { BookOpen, Heart, Layers, Shield } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { FadeIn } from "@/components/motion/FadeIn";
import { SectionHeading } from "@/components/ui/PageHero";
import { Link } from "@/i18n/navigation";
import { apiGet, type AdmissionInfo, type HomePayload, type SiteSettings } from "@/lib/api";
import { formatDate, newsCategoryKey } from "@/lib/format";

const ICONS: Record<string, typeof BookOpen> = {
  "book-open": BookOpen,
  layers: Layers,
  heart: Heart,
  shield: Shield,
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const [home, site, admission] = await Promise.all([
    apiGet<HomePayload>("/api/home/", locale),
    apiGet<SiteSettings>("/api/site/", locale),
    apiGet<AdmissionInfo>("/api/admissions/info/", locale),
  ]);

  if (!home || !site) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <p>{t("common.loadError")}</p>
      </div>
    );
  }

  const { home: content } = home;

  return (
    <div>
      <section className="relative min-h-[88vh] overflow-hidden">
        {content.hero_image_url && (
          <Image
            src={content.hero_image_url}
            alt=""
            fill
            priority
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-igqs-green/90 via-igqs-green/75 to-igqs-ink/40" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-center px-4 py-24 sm:px-6">
          <FadeIn>
            <p className="text-xs uppercase tracking-[0.35em] text-igqs-gold">
              {site.school_name}
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight text-white md:text-6xl">
              {content.hero_title}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-igqs-cream/90">
              {content.hero_subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/admission"
                className="rounded-full bg-igqs-gold px-6 py-3 text-sm font-medium text-igqs-ink"
              >
                {t("common.applyNow")}
              </Link>
              <Link
                href="/curriculum"
                className="rounded-full border border-igqs-gold/70 px-6 py-3 text-sm text-igqs-cream"
              >
                {t("common.viewCurriculum")}
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-white/30 px-6 py-3 text-sm text-white"
              >
                {t("common.contactUs")}
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <FadeIn>
          <SectionHeading kicker={t("brand.name")} title={t("home.welcome")} />
          <p className="max-w-3xl text-lg leading-relaxed text-igqs-muted dark:text-igqs-sand/80">
            {content.welcome}
          </p>
        </FadeIn>
      </section>

      <section className="bg-white/60 py-20 dark:bg-white/5">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <FadeIn>
            <SectionHeading title={t("home.about")} />
            <p className="text-lg leading-relaxed text-igqs-muted dark:text-igqs-sand/80">
              {content.about_preview}
            </p>
            <Link
              href="/about"
              className="mt-6 inline-block text-sm font-medium text-igqs-gold"
            >
              {t("common.learnMore")} →
            </Link>
          </FadeIn>
          <FadeIn delay={0.1} className="relative min-h-72 overflow-hidden rounded-3xl">
            <Image src={home.gallery[0]?.cover_image_url || content.hero_image_url} alt="" fill className="object-cover" />
          </FadeIn>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <FadeIn>
          <SectionHeading title={t("home.principal")} />
        </FadeIn>
        <FadeIn className="grid gap-8 rounded-3xl border border-igqs-gold/25 bg-igqs-sand/40 p-6 md:grid-cols-[200px_1fr] md:p-10 dark:bg-white/5">
          {content.principal_photo_url && (
            <div className="relative h-56 overflow-hidden rounded-2xl md:h-auto">
              <Image src={content.principal_photo_url} alt={content.principal_name} fill className="object-cover" />
            </div>
          )}
          <blockquote>
            <p className="font-display text-2xl leading-relaxed text-igqs-green dark:text-igqs-gold-soft">
              “{content.principal_message}”
            </p>
            <footer className="mt-6 text-sm">
              <strong>{content.principal_name}</strong>
              <span className="block text-igqs-muted">{content.principal_title}</span>
            </footer>
          </blockquote>
        </FadeIn>
      </section>

      <section className="pattern-bg py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading title={t("home.why")} />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {home.why_choose.map((item, i) => {
              const Icon = ICONS[item.icon] ?? BookOpen;
              return (
                <FadeIn key={item.id} delay={i * 0.08}>
                  <article className="h-full rounded-3xl border border-igqs-gold/20 bg-white/80 p-6 dark:bg-[#0d1f18]">
                    <Icon className="h-8 w-8 text-igqs-gold" />
                    <h3 className="mt-4 font-display text-2xl">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-igqs-muted dark:text-igqs-sand/70">
                      {item.description}
                    </p>
                  </article>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <SectionHeading title={t("home.academics")} />
          <Link href="/curriculum" className="mb-8 text-sm text-igqs-gold">
            {t("common.viewAll")}
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {home.curriculum_highlights.map((grade) => (
            <FadeIn key={grade.slug}>
              <Link
                href="/curriculum"
                className="block rounded-2xl border border-igqs-gold/20 bg-white p-5 dark:bg-[#0d1f18]"
              >
                <h3 className="font-display text-2xl text-igqs-green dark:text-igqs-gold-soft">
                  {grade.name}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-igqs-muted">
                  {grade.description}
                </p>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {site.admission_open && (
        <section className="bg-igqs-green py-16 text-igqs-cream">
          <FadeIn className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 md:flex-row md:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-igqs-gold">
                {t("home.admission")}
              </p>
              <p className="mt-3 max-w-2xl text-lg">{site.admission_announcement}</p>
              {admission?.default_fee && (
                <p className="mt-3 font-display text-2xl text-igqs-gold">
                  {admission.default_fee.label}: {admission.default_fee.display}
                </p>
              )}
            </div>
            <Link
              href="/admission"
              className="rounded-full bg-igqs-gold px-6 py-3 text-sm font-medium text-igqs-ink"
            >
              {t("common.applyNow")}
            </Link>
          </FadeIn>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <SectionHeading title={t("home.events")} />
          <Link href="/events" className="mb-8 text-sm text-igqs-gold">
            {t("common.viewAll")}
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {home.upcoming_events.map((event) => (
            <FadeIn key={event.slug}>
              <Link href={`/events/${event.slug}`} className="group block overflow-hidden rounded-3xl border border-igqs-gold/20 bg-white dark:bg-[#0d1f18]">
                <div className="relative h-44">
                  {event.image && (
                    <Image src={event.image} alt="" fill className="object-cover transition group-hover:scale-105" />
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs text-igqs-gold">{formatDate(event.start_at, locale, true)}</p>
                  <h3 className="mt-2 font-display text-2xl">{event.title}</h3>
                  <p className="mt-1 text-sm text-igqs-muted">{event.location}</p>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="bg-white/60 py-20 dark:bg-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 flex items-end justify-between">
            <SectionHeading title={t("home.news")} />
            <Link href="/news" className="mb-8 text-sm text-igqs-gold">
              {t("common.viewAll")}
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {home.latest_news.map((item) => (
              <FadeIn key={item.slug}>
                <Link href={`/news/${item.slug}`} className="block">
                  <div className="relative h-40 overflow-hidden rounded-2xl">
                    {item.image && <Image src={item.image} alt="" fill className="object-cover" />}
                  </div>
                  <p className="mt-3 text-xs uppercase tracking-wide text-igqs-gold">{t(`news.${newsCategoryKey(item.category)}`)}</p>
                  <h3 className="mt-1 font-display text-xl">{item.title}</h3>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <SectionHeading title={t("home.gallery")} />
          <Link href="/gallery" className="mb-8 text-sm text-igqs-gold">
            {t("common.viewAll")}
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {home.gallery.map((album, i) => (
            <FadeIn key={album.slug} delay={i * 0.05} className={i === 0 ? "col-span-2 md:row-span-2" : ""}>
              <Link href="/gallery" className="relative block min-h-40 overflow-hidden rounded-3xl">
                {album.cover_image_url && (
                  <Image src={album.cover_image_url} alt={album.title} fill className="object-cover" />
                )}
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 p-4 text-sm text-white">
                  {album.title}
                </span>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="border-y border-igqs-gold/20 bg-igqs-sand/50 py-16 dark:bg-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading title={t("home.notices")} />
          <ul className="divide-y divide-igqs-gold/20">
            {home.notices.map((notice) => (
              <li key={notice.slug} className="py-4">
                <Link href={`/news/${notice.slug}`} className="flex flex-wrap items-baseline justify-between gap-3">
                  <span className="font-medium">{notice.title}</span>
                  <span className="text-sm text-igqs-muted">{formatDate(notice.published_at, locale)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
