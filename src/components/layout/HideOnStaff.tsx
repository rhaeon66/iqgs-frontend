"use client";

import { usePathname } from "@/i18n/navigation";

export function HideOnStaff({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/staff")) return null;
  return children;
}
