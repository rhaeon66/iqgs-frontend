import { getTranslations, setRequestLocale } from "next-intl/server";
import { AdmissionForm } from "@/components/admission/AdmissionForm";
import { PaymentInstructions } from "@/components/admission/PaymentInstructions";
import { PageHero } from "@/components/ui/PageHero";
import { Link } from "@/i18n/navigation";
import { apiGet, type AdmissionInfo, type SiteSettings } from "@/lib/api";

export default async function AdmissionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admission");
  const [classes, site, info] = await Promise.all([
    apiGet<{ slug: string; name: string }[]>("/api/admissions/classes/", locale),
    apiGet<SiteSettings>("/api/site/", locale),
    apiGet<AdmissionInfo>("/api/admissions/info/", locale),
  ]);

  return (
    <div>
      <PageHero title={t("title")} subtitle={t("subtitle")} />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {site?.admission_announcement && (
          <p className="mb-8 rounded-2xl border border-igqs-gold/30 bg-igqs-sand/40 p-4 text-sm dark:bg-white/5">
            {site.admission_announcement}
          </p>
        )}
        <p className="mb-8 text-sm text-igqs-muted">
          {t("lostReceiptHint")}{" "}
          <Link href="/admission/receipt" className="text-igqs-gold underline">
            {t("downloadPageTitle")}
          </Link>
        </p>
        <PaymentInstructions
          fee={info?.default_fee}
          methods={info?.methods ?? []}
          title={t("methodsIntro")}
          amountLabel={t("feeLabel")}
          howTitle={t("howToPay")}
          steps={[t("payStep1"), t("payStep2"), t("payStep3")]}
          methodsTitle={t("methodsTitle")}
          accountLabel={t("accountLabel")}
          typeLabel={t("typeLabel")}
          notice={t("noGateway")}
        />
        <AdmissionForm classes={classes ?? []} info={info} />
      </div>
    </div>
  );
}
