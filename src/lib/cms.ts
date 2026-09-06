export type Option = { value: string; label: string };

export type CmsMeta = {
  grades: { id: number; slug: string; name_en: string }[];
  subject_categories: Option[];
  news_categories: Option[];
  gallery_categories: Option[];
  payment_codes: Option[];
  why_icons: Option[];
};

export type CmsField =
  | { type: "text" | "textarea" | "url" | "number"; name: string; label: string }
  | { type: "pair"; name: string; label: string; textarea?: boolean }
  | { type: "checkbox"; name: string; label: string }
  | { type: "select"; name: string; label: string; options: Option[] }
  | { type: "datetime"; name: string; label: string };

export const fieldClass =
  "mt-1 w-full rounded-xl border border-igqs-gold/30 bg-transparent px-3 py-2 text-sm";

export function toDateTimeLocal(value?: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function fromDateTimeLocal(value: string) {
  if (!value) return "";
  return new Date(value).toISOString();
}

export function preparePayload(fields: CmsField[], values: Record<string, unknown>) {
  const payload: Record<string, unknown> = { ...values };
  for (const key of [
    "id",
    "subjects",
    "documents",
    "images",
    "image_src",
    "logo_src",
    "download_url",
    "grade_name",
  ]) {
    delete payload[key];
  }
  for (const field of fields) {
    if (field.type === "datetime") {
      const raw = String(payload[field.name] ?? "");
      payload[field.name] = raw ? fromDateTimeLocal(raw) : null;
    }
    if (field.type === "select" && payload[field.name] === "") {
      payload[field.name] = null;
    }
  }
  if (payload.grade !== undefined && payload.grade !== null && payload.grade !== "") {
    payload.grade = Number(payload.grade);
  }
  return payload;
}

export function emptyRecord(fields: CmsField[], extras: Record<string, unknown> = {}) {
  const values: Record<string, unknown> = { ...extras };
  for (const field of fields) {
    if (field.type === "pair") {
      values[`${field.name}_en`] = "";
      values[`${field.name}_bn`] = "";
    } else if (field.type === "checkbox") {
      values[field.name] = false;
    } else if (field.type === "number") {
      values[field.name] = 0;
    } else {
      values[field.name] = "";
    }
  }
  return values;
}

export const homeFields: CmsField[] = [
  { type: "pair", name: "hero_title", label: "Hero title" },
  { type: "pair", name: "hero_subtitle", label: "Hero subtitle", textarea: true },
  { type: "url", name: "hero_image_url", label: "Hero image URL" },
  { type: "pair", name: "welcome", label: "Welcome", textarea: true },
  { type: "pair", name: "about_preview", label: "About preview", textarea: true },
  { type: "pair", name: "principal_name", label: "Principal name" },
  { type: "pair", name: "principal_title", label: "Principal title" },
  { type: "pair", name: "principal_message", label: "Principal message", textarea: true },
  { type: "url", name: "principal_photo_url", label: "Principal photo URL" },
];

export const whyFields = (icons: Option[]): CmsField[] => [
  { type: "pair", name: "title", label: "Title" },
  { type: "pair", name: "description", label: "Description", textarea: true },
  { type: "select", name: "icon", label: "Icon", options: icons },
  { type: "number", name: "order", label: "Order" },
];

export const aboutFields: CmsField[] = [
  { type: "pair", name: "introduction", label: "Introduction", textarea: true },
  { type: "pair", name: "vision", label: "Vision", textarea: true },
  { type: "pair", name: "mission", label: "Mission", textarea: true },
  { type: "pair", name: "history", label: "History", textarea: true },
  { type: "pair", name: "quranic_approach", label: "Qur'anic approach", textarea: true },
  { type: "pair", name: "principal_message", label: "Principal message", textarea: true },
];

export const leaderFields: CmsField[] = [
  { type: "pair", name: "name", label: "Name" },
  { type: "pair", name: "role", label: "Role" },
  { type: "pair", name: "bio", label: "Biography", textarea: true },
  { type: "url", name: "photo_url", label: "Photo URL" },
  { type: "number", name: "order", label: "Order" },
];

export const facilityFields: CmsField[] = [
  { type: "pair", name: "title", label: "Title" },
  { type: "pair", name: "description", label: "Description", textarea: true },
  { type: "url", name: "image_url", label: "Image URL" },
  { type: "number", name: "order", label: "Order" },
];

export const contactFields: CmsField[] = [
  { type: "pair", name: "school_name", label: "School name" },
  { type: "pair", name: "tagline", label: "Tagline" },
  { type: "url", name: "logo_url", label: "Logo URL" },
  { type: "pair", name: "address", label: "Address" },
  { type: "text", name: "phone_primary", label: "Primary phone" },
  { type: "text", name: "phone_secondary", label: "Secondary phone" },
  { type: "text", name: "email", label: "Email" },
  { type: "pair", name: "office_hours", label: "Office hours" },
  { type: "url", name: "map_embed_url", label: "Map embed URL" },
  { type: "url", name: "facebook_url", label: "Facebook" },
  { type: "url", name: "youtube_url", label: "YouTube" },
  { type: "url", name: "instagram_url", label: "Instagram" },
  { type: "url", name: "whatsapp_url", label: "WhatsApp" },
];

export const admissionInfoFields: CmsField[] = [
  { type: "checkbox", name: "admission_open", label: "Admission is open" },
  { type: "pair", name: "admission_announcement", label: "Admission announcement", textarea: true },
];

export const eventFields: CmsField[] = [
  { type: "text", name: "slug", label: "Slug" },
  { type: "pair", name: "title", label: "Title" },
  { type: "datetime", name: "start_at", label: "Starts" },
  { type: "datetime", name: "end_at", label: "Ends" },
  { type: "pair", name: "location", label: "Location" },
  { type: "pair", name: "description", label: "Description", textarea: true },
  { type: "url", name: "image_url", label: "Image URL" },
  { type: "checkbox", name: "is_published", label: "Published" },
];

export const newsFields = (categories: Option[]): CmsField[] => [
  { type: "text", name: "slug", label: "Slug" },
  { type: "pair", name: "title", label: "Title" },
  { type: "select", name: "category", label: "Category", options: categories },
  { type: "pair", name: "description", label: "Description", textarea: true },
  { type: "url", name: "featured_image_url", label: "Image URL" },
  { type: "datetime", name: "published_at", label: "Published at" },
  { type: "checkbox", name: "is_published", label: "Published" },
  { type: "checkbox", name: "is_important", label: "Show as important notice" },
];

export const gradeFields: CmsField[] = [
  { type: "text", name: "slug", label: "Slug" },
  { type: "pair", name: "name", label: "Name" },
  { type: "pair", name: "description", label: "Description", textarea: true },
  { type: "number", name: "order", label: "Order" },
];

export const subjectFields = (categories: Option[]): CmsField[] => [
  { type: "pair", name: "name", label: "Name" },
  { type: "select", name: "category", label: "Category", options: categories },
  { type: "pair", name: "description", label: "Description", textarea: true },
  { type: "number", name: "order", label: "Order" },
];

export const documentFields: CmsField[] = [
  { type: "pair", name: "title", label: "Title" },
  { type: "url", name: "file_url", label: "File URL" },
  { type: "number", name: "order", label: "Order" },
];

export const albumFields = (categories: Option[]): CmsField[] => [
  { type: "text", name: "slug", label: "Slug" },
  { type: "pair", name: "title", label: "Title" },
  { type: "select", name: "category", label: "Category", options: categories },
  { type: "pair", name: "description", label: "Description", textarea: true },
  { type: "url", name: "cover_image_url", label: "Cover image URL" },
  { type: "number", name: "order", label: "Order" },
];

export const imageFields: CmsField[] = [
  { type: "url", name: "image_url", label: "Image URL" },
  { type: "pair", name: "caption", label: "Caption" },
  { type: "number", name: "order", label: "Order" },
];

export const feeFields = (grades: Option[]): CmsField[] => [
  { type: "select", name: "grade", label: "Class (empty = default fee)", options: grades },
  { type: "number", name: "amount", label: "Amount" },
  { type: "text", name: "currency", label: "Currency" },
  { type: "pair", name: "label", label: "Label" },
  { type: "checkbox", name: "is_active", label: "Active" },
];

export const methodFields = (codes: Option[]): CmsField[] => [
  { type: "select", name: "code", label: "Method", options: codes },
  { type: "pair", name: "name", label: "Name" },
  { type: "text", name: "account_number", label: "Account number" },
  { type: "text", name: "account_name", label: "Account name" },
  { type: "text", name: "bank_name", label: "Bank name" },
  { type: "pair", name: "payment_type", label: "Payment type" },
  { type: "pair", name: "instructions", label: "Payment instructions", textarea: true },
  { type: "checkbox", name: "is_active", label: "Active" },
  { type: "number", name: "order", label: "Order" },
];
