export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatWon(value: number | null | undefined) {
  if (value == null) return "제한 없음";
  return new Intl.NumberFormat("ko-KR").format(value) + "원";
}

export function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function clampText(value: string, maxLength = 80) {
  if (value.length <= maxLength) return value;
  return value.slice(0, maxLength - 1) + "…";
}
