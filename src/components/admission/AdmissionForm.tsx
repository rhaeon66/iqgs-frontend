"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { apiPost, type AdmissionInfo, type ClassOption } from "@/lib/api";

const fieldClass =
  "mt-1 w-full rounded-xl border border-igqs-gold/30 bg-transparent px-3 py-2";

export function AdmissionForm({
  classes,
  info,
}: {
  classes: ClassOption[];
  info: AdmissionInfo | null;
}) {
  const t = useTranslations("admission");
  const tc = useTranslations("common");
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<{
    photo?: File;
    birth?: File;
    screenshot?: File;
  }>({});

  const steps = [t("stepStudent"), t("stepGuardian"), t("stepMore"), t("stepPayment")];

  function setField(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  const applicableFee = useMemo(() => {
    const selected = classes.find((c) => c.name === form.applying_class);
    const match = info?.fees.find((fee) => fee.grade_slug && fee.grade_slug === selected?.slug);
    return match ?? info?.default_fee ?? null;
  }, [classes, form.applying_class, info]);

  const studentValid = useMemo(
    () =>
      Boolean(
        form.student_name &&
          form.student_name_bn &&
          form.date_of_birth &&
          form.gender &&
          form.applying_class &&
          form.student_address &&
          files.photo &&
          files.birth
      ),
    [form, files]
  );

  const guardianValid = useMemo(
    () =>
      Boolean(
        form.father_name &&
          form.mother_name &&
          form.guardian_name &&
          form.father_occupation &&
          form.mobile &&
          form.email &&
          form.guardian_address &&
          form.emergency_contact
      ),
    [form]
  );

  const paymentValid = useMemo(
    () =>
      Boolean(
        form.payment_method &&
          form.transaction_id &&
          form.payment_amount &&
          form.payment_date &&
          form.payer_mobile
      ),
    [form]
  );

  function goToPayment() {
    if (applicableFee && !form.payment_amount) {
      setField("payment_amount", String(Number(applicableFee.amount)));
    }
    setStep(3);
  }

  async function submit() {
    setSending(true);
    setError("");
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (files.photo) data.append("student_photo", files.photo);
    if (files.birth) data.append("birth_certificate", files.birth);
    if (files.screenshot) data.append("payment_screenshot", files.screenshot);
    try {
      const result = await apiPost("/api/admissions/apply/", data);
      router.push(`/admission/success?id=${result.application_id}`);
    } catch {
      setError(t("error"));
      setSending(false);
    }
  }

  return (
    <div className="rounded-3xl border border-igqs-gold/25 bg-white p-5 dark:bg-[#0d1f18] sm:p-8">
      <ol className="mb-8 grid grid-cols-2 gap-2 text-center text-xs sm:grid-cols-4 sm:text-sm">
        {steps.map((label, i) => (
          <li
            key={label}
            className={`rounded-full px-2 py-2.5 leading-tight ${
              i === step
                ? "bg-igqs-green text-igqs-cream dark:bg-igqs-gold dark:text-igqs-ink"
                : "bg-igqs-sand/70 dark:bg-white/5"
            }`}
          >
            <span className="block font-medium">{i + 1}</span>
            <span>{label}</span>
          </li>
        ))}
      </ol>

      {step === 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <h2 className="sm:col-span-2 font-display text-2xl">{t("studentInfo")}</h2>
          <label className="text-sm">
            {t("studentName")}
            <input className={fieldClass} required value={form.student_name ?? ""} onChange={(e) => setField("student_name", e.target.value)} />
          </label>
          <label className="text-sm">
            {t("studentNameBn")}
            <input className={fieldClass} required value={form.student_name_bn ?? ""} onChange={(e) => setField("student_name_bn", e.target.value)} />
          </label>
          <label className="text-sm">
            {t("dob")}
            <input type="date" className={fieldClass} required value={form.date_of_birth ?? ""} onChange={(e) => setField("date_of_birth", e.target.value)} />
          </label>
          <label className="text-sm">
            {t("gender")}
            <select className={fieldClass} required value={form.gender ?? ""} onChange={(e) => setField("gender", e.target.value)}>
              <option value="">{t("selectGender")}</option>
              <option value="male">{t("male")}</option>
              <option value="female">{t("female")}</option>
            </select>
          </label>
          <label className="text-sm">
            {t("previousClass")}
            <input className={fieldClass} value={form.previous_class ?? ""} onChange={(e) => setField("previous_class", e.target.value)} />
            <span className="mt-1 block text-xs text-igqs-muted">({tc("optional")})</span>
          </label>
          <label className="text-sm">
            {t("applyingClass")}
            <select className={fieldClass} required value={form.applying_class ?? ""} onChange={(e) => setField("applying_class", e.target.value)}>
              <option value="">{t("selectClass")}</option>
              {classes.map((c) => (
                <option key={c.slug} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm sm:col-span-2">
            {t("address")}
            <textarea className={fieldClass} required value={form.student_address ?? ""} onChange={(e) => setField("student_address", e.target.value)} />
          </label>
          <label className="text-sm">
            {t("photo")}
            <input type="file" accept="image/*" required className={`${fieldClass} min-h-11`} onChange={(e) => setFiles((f) => ({ ...f, photo: e.target.files?.[0] }))} />
            <span className="mt-1 block text-xs text-igqs-muted">{t("fileHint")}</span>
          </label>
          <label className="text-sm">
            {t("birthCertificate")}
            <input type="file" required className={`${fieldClass} min-h-11`} onChange={(e) => setFiles((f) => ({ ...f, birth: e.target.files?.[0] }))} />
            <span className="mt-1 block text-xs text-igqs-muted">{t("fileHint")}</span>
          </label>
        </div>
      )}

      {step === 1 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <h2 className="sm:col-span-2 font-display text-2xl">{t("guardianInfo")}</h2>
          <label className="text-sm">
            {t("fatherName")}
            <input className={fieldClass} required value={form.father_name ?? ""} onChange={(e) => setField("father_name", e.target.value)} />
          </label>
          <label className="text-sm">
            {t("motherName")}
            <input className={fieldClass} required value={form.mother_name ?? ""} onChange={(e) => setField("mother_name", e.target.value)} />
          </label>
          <label className="text-sm sm:col-span-2">
            {t("guardianName")}
            <input className={fieldClass} required value={form.guardian_name ?? ""} onChange={(e) => setField("guardian_name", e.target.value)} />
          </label>
          <label className="text-sm">
            {t("fatherOccupation")}
            <input className={fieldClass} required value={form.father_occupation ?? ""} onChange={(e) => setField("father_occupation", e.target.value)} />
          </label>
          <label className="text-sm">
            {t("motherOccupation")} <span className="text-igqs-muted">({tc("optional")})</span>
            <input className={fieldClass} value={form.mother_occupation ?? ""} onChange={(e) => setField("mother_occupation", e.target.value)} />
          </label>
          <label className="text-sm">
            {t("mobile")}
            <input className={fieldClass} required value={form.mobile ?? ""} onChange={(e) => setField("mobile", e.target.value)} />
          </label>
          <label className="text-sm">
            {t("email")}
            <input type="email" className={fieldClass} required value={form.email ?? ""} onChange={(e) => setField("email", e.target.value)} />
          </label>
          <label className="text-sm sm:col-span-2">
            {t("guardianAddress")}
            <textarea className={fieldClass} required value={form.guardian_address ?? ""} onChange={(e) => setField("guardian_address", e.target.value)} />
          </label>
          <label className="text-sm sm:col-span-2">
            {t("emergency")}
            <input className={fieldClass} required value={form.emergency_contact ?? ""} onChange={(e) => setField("emergency_contact", e.target.value)} />
          </label>
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-4">
          <h2 className="font-display text-2xl">{t("moreInfo")}</h2>
          <label className="text-sm">
            {t("previousAcademic")} <span className="text-igqs-muted">({tc("optional")})</span>
            <textarea className={fieldClass} value={form.previous_academic_info ?? ""} onChange={(e) => setField("previous_academic_info", e.target.value)} />
          </label>
          <label className="text-sm">
            {t("special")} <span className="text-igqs-muted">({tc("optional")})</span>
            <textarea className={fieldClass} value={form.special_requirements ?? ""} onChange={(e) => setField("special_requirements", e.target.value)} />
          </label>
        </div>
      )}

      {step === 3 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <h2 className="sm:col-span-2 font-display text-2xl">{t("paymentInfo")}</h2>
          {applicableFee && (
            <p className="sm:col-span-2 rounded-2xl bg-igqs-sand/50 px-4 py-3 text-sm dark:bg-white/5">
              {applicableFee.label}: <strong>{applicableFee.display}</strong>
            </p>
          )}
          <fieldset className="sm:col-span-2">
            <legend className="text-sm">{t("paymentMethod")}</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {(info?.methods ?? []).map((method) => (
                <label
                  key={method.code}
                  className={`cursor-pointer rounded-2xl border px-4 py-3 text-sm ${
                    form.payment_method === method.code
                      ? "border-igqs-gold bg-igqs-gold/15"
                      : "border-igqs-gold/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_method"
                    className="mr-2"
                    checked={form.payment_method === method.code}
                    onChange={() => setField("payment_method", method.code)}
                  />
                  {method.name}
                  <span className="mt-1 block break-all font-mono text-xs text-igqs-muted">{method.account_number}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <label className="text-sm">
            {t("transactionId")}
            <input className={fieldClass} required value={form.transaction_id ?? ""} onChange={(e) => setField("transaction_id", e.target.value)} />
          </label>
          <label className="text-sm">
            {t("paymentAmount")}
            <input className={fieldClass} type="number" min="1" required value={form.payment_amount ?? ""} onChange={(e) => setField("payment_amount", e.target.value)} />
          </label>
          <label className="text-sm">
            {t("paymentDate")}
            <input type="date" className={fieldClass} required value={form.payment_date ?? ""} onChange={(e) => setField("payment_date", e.target.value)} />
          </label>
          <label className="text-sm">
            {t("payerMobile")}
            <input className={fieldClass} required value={form.payer_mobile ?? ""} onChange={(e) => setField("payer_mobile", e.target.value)} />
          </label>
          <label className="text-sm sm:col-span-2">
            {t("screenshot")} <span className="text-igqs-muted">({t("screenshotOptional")})</span>
            <input type="file" accept="image/*" className={fieldClass} onChange={(e) => setFiles((f) => ({ ...f, screenshot: e.target.files?.[0] }))} />
          </label>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        {step > 0 ? (
          <button type="button" onClick={() => setStep((s) => s - 1)} className="min-h-11 rounded-full border border-igqs-gold/40 px-5 py-2.5 text-sm">
            {tc("back")}
          </button>
        ) : (
          <span />
        )}
        {step < 3 ? (
          <button
            type="button"
            disabled={(step === 0 && !studentValid) || (step === 1 && !guardianValid)}
            onClick={() => (step === 2 ? goToPayment() : setStep((s) => s + 1))}
            className="min-h-11 rounded-full bg-igqs-green px-5 py-2.5 text-sm text-igqs-cream disabled:opacity-40 dark:bg-igqs-gold dark:text-igqs-ink"
          >
            {tc("next")}
          </button>
        ) : (
          <button
            type="button"
            disabled={sending || !paymentValid}
            onClick={submit}
            className="min-h-11 rounded-full bg-igqs-green px-5 py-2.5 text-sm text-igqs-cream disabled:opacity-40 dark:bg-igqs-gold dark:text-igqs-ink"
          >
            {sending ? tc("sending") : tc("submit")}
          </button>
        )}
      </div>
    </div>
  );
}
