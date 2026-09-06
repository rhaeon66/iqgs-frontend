import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SuccessPanel } from "@/components/admission/SuccessPanel";
import { PageHero } from "@/components/ui/PageHero";

export default async function AdmissionSuccessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admission");

  return (
    <div>
      <PageHero title={t("successTitle")} subtitle={t("successBody")} />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Suspense>
          <SuccessPanel />
        </Suspense>
      </div>
    </div>
  );
}
