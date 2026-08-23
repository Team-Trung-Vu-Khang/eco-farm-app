// Not backed by a real "crop group" catalog yet, and `subjectGroupId` is
// empty for virtually every crop in practice — so instead of a mostly-
// useless single "Chưa phân nhóm" bucket, crops are spread deterministically
// (by crop id) across a fixed set of dummy, human-named groups just so the
// "Theo nhóm cây trồng" scope option has something meaningful to demo.
export const DUMMY_CROP_GROUP_NAMES = [
  "Cây ăn quả",
  "Cây công nghiệp",
  "Cây lương thực",
  "Rau màu",
  "Cây dược liệu",
];

export function getDummyCropGroupName(cropId: string | number): string {
  return DUMMY_CROP_GROUP_NAMES[Number(cropId) % DUMMY_CROP_GROUP_NAMES.length];
}
