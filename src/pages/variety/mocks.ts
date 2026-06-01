import type { Variety } from "./types";

export const initialData: Variety[] = [
  {
    id: "1",
    illustration:
      "https://halan.net/wp-content/uploads/2024/02/mot-so-dac-tinh-cua-giong-lua-st25.jpg",
    crop: "Lúa",
    varietyCode: "LUA01",
    varietyName: "Giống lúa ST25",
    scientificName: "Oryza sativa",
    origin: "Kỹ sư Hồ Quang Cua và cộng sự (Sóc Trăng)",
    growthDuration: "95 - 105 ngày",
    averageYield: "6.5 - 7.0 tấn/ha (thâm canh đạt >8 tấn/ha)",
    description:
      "Mệnh danh là 'Gạo ngon nhất thế giới', giống lúa có thân cứng, đẻ nhánh tốt, chịu mặn và phèn cực tốt. Hạt gạo thon dài, trắng trong, cơm dẻo mềm, thơm hương lá dứa và cốm non, vị đậm đà.",
    seedType: "Lúa thuần",
    documents: [{ name: "ky-thuat-canh-tac-st25.pdf", url: "#" }],
    status: "active",
    updatedAt: "2024-03-01",
  },
  {
    id: "2",
    illustration:
      "https://nongsanmekong.com/wp-content/uploads/2024/05/lua-om18.jpg",
    crop: "Lúa",
    varietyCode: "LUA02",
    varietyName: "Giống lúa OM18",
    scientificName: "Oryza sativa",
    origin: "Viện Lúa Đồng bằng Sông Cửu Long (Tổ hợp OM8017/OM5166)",
    growthDuration: "95 - 105 ngày",
    averageYield: "5.0 - 8.0 tấn/ha",
    description:
      "Giống lúa ngắn ngày, đẻ nhánh tốt, có khả năng chịu mặn tốt (3-4‰) và kháng đạo ôn. Hạt gạo thon dài, trắng trong, ít bạc bụng, khi nấu cơm mềm, ngọt và có mùi thơm nhẹ, đạt chuẩn xuất khẩu.",
    seedType: "Lúa thuần",
    documents: [{ name: "huong-dan-trong-om18.pdf", url: "#" }],
    status: "active",
    updatedAt: "2024-03-02",
  },
  {
    id: "3",
    illustration:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSStdvROX78RfqQb4gFm0Q5xk9bTik3KAnEAQ&s",
    crop: "Lúa",
    varietyCode: "LUA03",
    varietyName: "Giống lúa Đài Thơm 8",
    scientificName: "Oryza sativa",
    origin: "Vinaseed (Tổ hợp BVN/OM4900)",
    growthDuration:
      "90 - 105 ngày (miền Nam) / 125-130 ngày (vụ Xuân miền Bắc)",
    averageYield: "6.5 - 7.0 tấn/ha (thâm canh đạt 8.0-9.0 tấn/ha)",
    description:
      "Cây đẻ nhánh khỏe, bộ lá đứng, cứng cây chống đổ ngã tốt, chịu phèn mặn khá. Hạt thon dài, vỏ trấu vàng sáng. Cơm dẻo, bóng, thơm nhẹ, để nguội vẫn dẻo.",
    seedType: "Lúa thuần",
    documents: [{ name: "ky-thuat-dai-thom-8.pdf", url: "#" }],
    status: "active",
    updatedAt: "2024-03-03",
  },
  {
    id: "4",
    illustration:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTh1mEJnFGgL5lC4nlfiF1f7rRa8cQ7hJ6lnQ&s",
    crop: "Lúa",
    varietyCode: "LUA04",
    varietyName: "Giống lúa OM 5451",
    scientificName: "Oryza sativa",
    origin: "Viện Lúa Đồng bằng Sông Cửu Long (Tổ hợp Jasmine 85/OM2490)",
    growthDuration: "88 - 100 ngày",
    averageYield: "6.0 - 8.0 tấn/ha",
    description:
      "Giống lúa cao sản, cứng cây, kháng đổ ngã, chống chịu bệnh đạo ôn và rầy nâu khá. Hạt gạo thon dài, hơi đục sữa, hàm lượng sắt cao, cơm dẻo vừa, mềm dẫu để nguội, rất được ưa chuộng cho xuất khẩu và bếp ăn công nghiệp.",
    seedType: "Lúa thuần",
    documents: [{ name: "cham-soc-om5451.pdf", url: "#" }],
    status: "active",
    updatedAt: "2024-03-04",
  },
  {
    id: "5",
    illustration:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTGItjbME4sDBy5dAz-WJpGAEdsPzp_RZJCew&s",
    crop: "Lúa",
    varietyCode: "LUA05",
    varietyName: "Giống lúa BC15",
    scientificName: "Oryza sativa",
    origin: "Tập đoàn ThaiBinh Seed",
    growthDuration: "100 - 138 ngày (tùy vụ và khu vực)",
    averageYield: "7.0 - 7.5 tấn/ha (thâm canh đạt 9.0-10.0 tấn/ha)",
    description:
      "Giống lúa cảm ôn, thích ứng rộng, đẻ nhánh khoẻ, tái sinh mạnh. Bông to dài, tỷ lệ gạo xát cao. Hạt gạo trong, ít bạc bụng, cơm mềm và vị đậm đà. Đã có phiên bản cải tiến (BC15-02) bổ sung gen kháng đạo ôn.",
    seedType: "Lúa thuần",
    documents: [{ name: "tai-lieu-bc15.pdf", url: "#" }],
    status: "active",
    updatedAt: "2024-03-05",
  },
];
