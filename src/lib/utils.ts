export function formatDate(date: Date | string | null | undefined): string {
   if (!date) return "—";
   const d = typeof date === "string" ? new Date(date) : date;
   return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
   }).format(d);
}

export function formatDateTime(date: Date | string | null | undefined): string {
   if (!date) return "—";
   const d = typeof date === "string" ? new Date(date) : date;
   return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
   }).format(d);
}

export function formatNumber(num: number | bigint | null | undefined): string {
   if (num === null || num === undefined) return "۰";
   return new Intl.NumberFormat("fa-IR").format(Number(num));
}

export function toGregorianDateInput(date: Date | null | undefined): string {
   if (!date) return "";
   const d = typeof date === "string" ? new Date(date) : date;
   const y = d.getFullYear();
   const m = String(d.getMonth() + 1).padStart(2, "0");
   const day = String(d.getDate()).padStart(2, "0");
   return `${y}-${m}-${day}`;
}

export function truncate(text: string | null | undefined, length = 80): string {
   if (!text) return "";
   return text.length > length ? text.slice(0, length) + "…" : text;
}
