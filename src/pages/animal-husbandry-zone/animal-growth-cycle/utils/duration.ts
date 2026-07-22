export function parseDurationToDays(duration: string | number): number {
  const durationStr = String(duration || "").trim();
  if (!durationStr) return 0;

  const yearMatch = durationStr.match(/(\d+)\s*năm/);
  const monthMatch = durationStr.match(/(\d+)\s*tháng/);
  const dayMatch = durationStr.match(/(\d+)\s*ngày/);

  // If it's just a raw number string or no specific units
  if (!yearMatch && !monthMatch && !dayMatch && !isNaN(Number(durationStr))) {
    return Number(durationStr) || 0;
  }

  const y = yearMatch ? parseInt(yearMatch[1], 10) : 0;
  const m = monthMatch ? parseInt(monthMatch[1], 10) : 0;
  const d = dayMatch ? parseInt(dayMatch[1], 10) : 0;

  return y * 365 + m * 30 + d;
}

export function formatDaysToDuration(days: number | undefined): string {
  if (!days) return "";
  let remaining = days;
  const years = Math.floor(remaining / 365);
  remaining %= 365;
  const months = Math.floor(remaining / 30);
  remaining %= 30;

  const parts = [];
  if (years > 0) parts.push(`${years} năm`);
  if (months > 0) parts.push(`${months} tháng`);
  if (remaining > 0) parts.push(`${remaining} ngày`);

  if (parts.length === 0) return "";
  return parts.join(" ");
}
