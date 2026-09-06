import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ReceiptLookupPanel } from "@/components/admission/ReceiptLookupPanel";
import { PageHero } from "@/components/ui/PageHero";

export default async function DownloadReceiptPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admission");

  return (
    <div>
      <PageHero title={t("downloadPageTitle")} subtitle={t("downloadPageSubtitle")} />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Suspense>
          <ReceiptLookupPanel />
        </Suspense>
      </div>
    </div>
  );
}
