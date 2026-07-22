export type AquacultureGrowthCycleSpeciesOption = {
  id: string;
  name: string;
  group: string;
  description: string;
};

export type AquacultureGrowthCycleVarietyOption = {
  id: string;
  cropId: string;
  name: string;
  description: string;
};

export const AQUACULTURE_GROWTH_CYCLE_SPECIES: AquacultureGrowthCycleSpeciesOption[] =
  [
    {
      id: "201",
      name: "Tôm thẻ chân trắng",
      group: "Tôm",
      description:
        "Phù hợp cho chu kỳ nuôi thâm canh, bán thâm canh hoặc ương giống.",
    },
    {
      id: "202",
      name: "Tôm sú",
      group: "Tôm",
      description:
        "Dùng cho chu kỳ tôm sú bố mẹ, tôm sú thương phẩm và giai đoạn ương.",
    },
    {
      id: "203",
      name: "Cá tra",
      group: "Cá nước ngọt",
      description: "Thiết lập cho chu kỳ nuôi cá tra từ ương giống đến xuất bán.",
    },
    {
      id: "204",
      name: "Nghêu",
      group: "Nhuyễn thể",
      description:
        "Phù hợp cho mô hình bãi nuôi và các giai đoạn tăng trưởng nhuyễn thể.",
    },
    {
      id: "205",
      name: "Cá mú",
      group: "Cá biển",
      description:
        "Áp dụng cho chu kỳ cá mú giống, cá thương phẩm hoặc nuôi biển.",
    },
  ];

export const AQUACULTURE_GROWTH_CYCLE_VARIETIES: AquacultureGrowthCycleVarietyOption[] =
  [
    {
      id: "2011",
      cropId: "201",
      name: "Tôm thẻ chân trắng PL12",
      description:
        "Giống hậu ấu trùng cho giai đoạn ương và tăng trưởng đầu vụ.",
    },
    {
      id: "2012",
      cropId: "201",
      name: "Tôm thẻ chân trắng bố mẹ",
      description: "Dùng cho chu kỳ sinh sản và chọn giống.",
    },
    {
      id: "2021",
      cropId: "202",
      name: "Tôm sú giống",
      description: "Giống tôm sú cho mô hình nuôi thương phẩm hoặc ương.",
    },
    {
      id: "2031",
      cropId: "203",
      name: "Cá tra đơn tính",
      description: "Phù hợp cho chu kỳ nuôi thương phẩm tăng trưởng nhanh.",
    },
    {
      id: "2051",
      cropId: "205",
      name: "Cá mú chấm nâu",
      description: "Giống cá biển cho chu kỳ nuôi lồng bè hoặc bể nuôi.",
    },
  ];
