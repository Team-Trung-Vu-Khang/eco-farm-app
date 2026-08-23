export const DAYS_OF_WEEK = [
  { label: "T2", value: 1 },
  { label: "T3", value: 2 },
  { label: "T4", value: 3 },
  { label: "T5", value: 4 },
  { label: "T6", value: 5 },
  { label: "T7", value: 6 },
  { label: "CN", value: 0 },
];

export const getFrequencyText = (days: number[], weeks: number) => {
  if (!days || days.length === 0) return "Chưa chọn ngày lặp lại";
  const dayNames = [
    "Chủ nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ];
  const sortedDays = [...days].sort(
    (a, b) => (a === 0 ? 7 : a) - (b === 0 ? 7 : b),
  );
  const daysText = sortedDays.map((d) => dayNames[d]).join(", ");
  return `${daysText} mỗi tuần${weeks ? `, trong ${weeks} tuần` : ""}`;
};

export const getRepeatDatesText = (dates: string[]) => {
  if (!dates || dates.length === 0) return "Chưa chọn ngày lặp lại";
  const sorted = [...dates].sort();
  const formatted = sorted.map((iso) => {
    const d = parseLocalISODate(iso);
    return Number.isNaN(d.getTime())
      ? iso
      : d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
  });
  return `Lặp lại ${formatted.length} ngày: ${formatted.join(", ")}`;
};

// Calendar day-picker selections are local-midnight Date objects — going
// through toISOString()/new Date(iso) shifts them by the UTC offset (e.g.
// picking the 20th in UTC+7 would round-trip to the 19th). These keep the
// conversion in local time so the picked date and the stored ISO date match.
export function formatLocalISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseLocalISODate(iso: string): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

export function getInclusiveDurationDays(startDate: string, endDate: string) {
  if (!startDate || !endDate) return 1;
  const start = parseLocalISODate(startDate).getTime();
  const end = parseLocalISODate(endDate).getTime();
  return Math.max(1, Math.floor((end - start) / 86400000) + 1);
}

/** A repeat start must be after the main range and separated from other starts
 * by at least the task duration so generated child tasks do not overlap. */
export function isRepeatDateAllowed(
  candidate: string,
  startDate: string,
  endDate: string,
  otherRepeatDates: string[],
) {
  if (!candidate || (startDate && candidate <= endDate)) return false;
  const durationDays = getInclusiveDurationDays(startDate, endDate);
  const candidateTime = parseLocalISODate(candidate).getTime();

  return otherRepeatDates.every((date) => {
    const distance = Math.abs(
      Math.floor((candidateTime - parseLocalISODate(date).getTime()) / 86400000),
    );
    return distance >= durationDays;
  });
}
