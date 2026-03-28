export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export const cropOptions = [
  { label: "Lúa", value: "LÚA" },
  { label: "Bắp (Ngô)", value: "BẮP (NGÔ)" },
  { label: "Sầu riêng", value: "SẦU RIÊNG" },
] as const;

export const diseaseTypeOptions = [
  { label: "Nấm", value: "nấm" },
  { label: "Sâu hại", value: "sâu hại" },
  { label: "Côn trùng", value: "côn trùng" },
] as const;

export const tagOptions = [
  { label: "Mùa mưa", value: "Mùa mưa" },
  { label: "Kháng thuốc", value: "Kháng thuốc" },
  { label: "Hữu cơ", value: "Hữu cơ" },
  { label: "Giai đoạn đầu", value: "Giai đoạn đầu" },
] as const;

export const growthStageOptions = [
  { label: "Cây con", value: "con" },
  { label: "Trưởng thành", value: "truong-thanh" },
  { label: "Ra hoa", value: "ra-hoa" },
  { label: "Kết quả", value: "ket-trai" },
] as const;

export const processTypeOptions = [
  { label: "Phun thuốc", value: "phun" },
  { label: "Bón phân", value: "bon" },
  { label: "Tưới nước", value: "tuoi" },
] as const;

export const materialOptions = [
  { label: "Tricyclazole 75WP", value: "tricyclazole" },
  { label: "Isoprothiolane 40EC", value: "isoprothiolane" },
] as const;

export const phiOptions = [
  { label: "3 ngày", value: "3 ngày" },
  { label: "7 ngày", value: "7 ngày" },
  { label: "14 ngày", value: "14 ngày" },
  { label: "21 ngày", value: "21 ngày" },
] as const;
