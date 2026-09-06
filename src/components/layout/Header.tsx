"use client";

import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { LanguageSwitcher } from "@/components/locale/LanguageSwitcher";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Link, usePathname } from "@/i18n/navigation";
import type { SiteSettings } from "@/lib/api";

const LINKS = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/curriculum", key: "curriculum" },
  { href: "/events", key: "events" },
  { href: "/news", key: "news" },
  { href: "/gallery", key: "gallery" },
  { href: "/contact", key: "contact" },
] as const;

export function Header({ site }: { site?: SiteSettings | null }) {
  const t = useTranslations("nav");
  const ta = useTranslations("a11y");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname.startsWith("/staff")) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-igqs-gold/20 bg-igqs-cream/85 backdrop-blur-md print:hidden dark:border-igqs-gold/15 dark:bg-[#07140f]/85">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-5 lg:flex">
          {LINKS.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm tracking-wide transition ${
                  active
                    ? "text-igqs-gold"
                    : "text-igqs-ink/80 hover:text-igqs-green dark:text-igqs-sand/80 dark:hover:text-igqs-gold-soft"
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <Link
            href="/admission"
            className="hidden rounded-full bg-igqs-green px-4 py-2 text-sm text-igqs-cream shadow-sm transition hover:bg-igqs-forest sm:inline-flex dark:bg-igqs-gold dark:text-igqs-ink"
          >
            {t("apply")}
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-igqs-gold/40 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={ta("menu")}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-igqs-gold/20 px-4 py-4 lg:hidden">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-igqs-gold">
            {site?.school_name}
          </p>
          <div className="grid gap-3">
            {LINKS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-base text-igqs-ink dark:text-igqs-sand"
              >
                {t(item.key)}
              </Link>
            ))}
            <Link
              href="/admission"
              onClick={() => setOpen(false)}
              className="rounded-full bg-igqs-green px-4 py-2 text-center text-igqs-cream dark:bg-igqs-gold dark:text-igqs-ink"
            >
              {t("apply")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
