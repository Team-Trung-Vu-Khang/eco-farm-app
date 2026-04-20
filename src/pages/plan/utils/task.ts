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
