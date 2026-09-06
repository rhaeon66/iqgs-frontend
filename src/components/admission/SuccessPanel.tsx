"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { apiUrl } from "@/lib/api";
import {
  ApplicationReceiptCard,
  type ApplicationDetail,
} from "@/components/admission/ApplicationReceiptCard";

export function SuccessPanel() {
  const t = useTranslations("admission");
  const locale = useLocale();
  const params = useSearchParams();
  const id = params.get("id");
  const [data, setData] = useState<ApplicationDetail | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(apiUrl(`/api/admissions/applications/${encodeURIComponent(id)}/`, locale), {
      cache: "no-store",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then(setData);
  }, [id, locale]);

  return (
    <div>
      <ApplicationReceiptCard
        data={data}
        fallbackApplicationId={id ?? undefined}
        kicker={t("successTitle")}
        heading={t("confirmationHeading")}
        intro={t("successBody")}
        showEmailNote
        showViewPdf
      />
      <p className="mt-6 text-center text-sm text-igqs-muted print:hidden">
        {t("lostReceiptHint")}{" "}
        <Link href="/admission/receipt" className="text-igqs-gold underline">
          {t("downloadPageTitle")}
        </Link>
      </p>
    </div>
  );
}
