"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("a11y");
  const router = useRouter();
  const pathname = usePathname();

  const setLocale = (next: "en" | "bn") => {
    router.replace(pathname, { locale: next });
  };

  return (
    <div className="flex items-center gap-0.5 text-sm font-medium sm:gap-1" role="group" aria-label={t("language")}>
      <button
        type="button"
        onClick={() => setLocale("bn")}
        className={`rounded-full px-2.5 py-1 transition ${
          locale === "bn"
            ? "bg-igqs-gold text-igqs-ink"
            : "text-igqs-muted hover:text-igqs-green dark:text-igqs-gold-soft"
        }`}
      >
        বাংলা
      </button>
      <span className="text-igqs-gold/70">|</span>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`rounded-full px-2.5 py-1 transition ${
          locale === "en"
            ? "bg-igqs-gold text-igqs-ink"
            : "text-igqs-muted hover:text-igqs-green dark:text-igqs-gold-soft"
        }`}
      >
        English
      </button>
    </div>
  );
}
