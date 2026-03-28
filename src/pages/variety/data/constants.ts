export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export const varietyFilters: any[] = [
  {
    key: "crop",
    label: "Cây trồng",
    options: [
      { label: "Sầu riêng", value: "Sầu riêng" },
      { label: "Xoài", value: "Xoài" },
      { label: "Cà phê", value: "Cà phê" },
      { label: "Bưởi", value: "Bưởi" },
      { label: "Lúa", value: "Lúa" },
    ],
  },
  {
    key: "status",
    label: "Trạng thái",
    options: [
      { label: "Hoạt động", value: "active" },
      { label: "Ngừng kinh doanh", value: "inactive" },
    ],
  },
] as const;
