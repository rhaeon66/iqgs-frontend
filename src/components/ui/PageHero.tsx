import { useTranslations } from "next-intl";
import { FadeIn } from "@/components/motion/FadeIn";

export function PageHero({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  const brand = useTranslations("brand");
  return (
    <section className="pattern-bg border-b border-igqs-gold/20 bg-igqs-green py-12 text-igqs-cream print:hidden dark:bg-[#0b241c] sm:py-16">
      <FadeIn className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="text-xs uppercase tracking-[0.28em] text-igqs-gold">{brand("name")}</p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-igqs-cream/80">{subtitle}</p>
        )}
      </FadeIn>
    </section>
  );
}

export function SectionHeading({
  kicker,
  title,
}: {
  kicker?: string;
  title: string;
}) {
  return (
    <div className="mb-8">
      {kicker && (
        <p className="text-xs uppercase tracking-[0.28em] text-igqs-gold">
          {kicker}
        </p>
      )}
      <h2 className="mt-2 font-display text-3xl text-igqs-green dark:text-igqs-gold-soft md:text-4xl">
        {title}
      </h2>
      <div className="mt-4 max-w-xs">
        <div className="gold-rule" />
      </div>
    </div>
  );
}
