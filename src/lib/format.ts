const NEWS_CATEGORIES = [
  "news",
  "announcement",
  "notice",
  "admission",
  "holiday",
  "exam",
  "update",
] as const;

export function newsCategoryKey(category: string) {
  return NEWS_CATEGORIES.includes(category as (typeof NEWS_CATEGORIES)[number])
    ? category
    : "news";
}

export function formatDate(iso: string, locale: string, withTime = false) {
  return new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-GB", {
    dateStyle: "medium",
    timeStyle: withTime ? "short" : undefined,
  }).format(new Date(iso));
}
