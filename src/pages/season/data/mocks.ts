import type { Season } from "../types/types";

export const initialSeasons: Season[] = [
  {
    id: "S001",
    code: "LUA-DBSCL-DX",
    name: "Vụ Đông Xuân (Đồng bằng sông Cửu Long)",
    description:
      "Đây là vụ lúa cho năng suất cao nhất trong năm nhờ điều kiện thời tiết thuận lợi, ít mưa, nhiệt độ thích hợp và ít sâu bệnh [4]. Thời gian canh tác thường từ tháng 11 đến tháng 4 năm sau [2].",
    duration: 105,
    status: "active",
    scope: "crop",
    cropId: "Lúa",
    growthCycleIds: ["GC-LUA-01"],
    documents: [
      {
        id: "D001",
        name: "lich-thoi-vu-dong-xuan-dbscl.pdf",
        url: "#",
        type: "technical",
        uploadedAt: "2024-01-10",
      },
    ],
    createdAt: 1763047136467,
    updatedAt: 1780327172070,
    selectedStages: {
      "GC-LUA-01": {
        lua1_1: "15 ngày",
        lua1_2: "25 ngày",
        lua1_3: "30 ngày",
        lua1_4: "30 ngày",
      },
    },
  },
  {
    id: "S002",
    code: "LUA-DBSCL-HT",
    name: "Vụ Hè Thu (Đồng bằng sông Cửu Long)",
    description:
      "Diễn ra từ tháng 4 đến tháng 8. Thời tiết thường nắng nóng, mưa nhiều, độ ẩm cao nên dễ phát sinh sâu bệnh [2, 5]. Ưu tiên sử dụng các giống lúa ngắn ngày, chịu nhiệt tốt [5].",
    duration: 95,
    status: "active",
    scope: "crop",
    cropId: "Lúa",
    growthCycleIds: ["GC-LUA-01"],
    documents: [
      {
        id: "D002",
        name: "bien-phap-phong-tru-he-thu.pdf",
        url: "#",
        type: "technical",
        uploadedAt: "2024-03-15",
      },
    ],
    createdAt: 1764775136467,
    updatedAt: 1780327183167,
    selectedStages: {
      "GC-LUA-01": {
        lua1_1: "15 ngày",
        lua1_2: "25 ngày",
        lua1_3: "30 ngày",
        lua1_4: "30 ngày",
      },
    },
  },
  {
    id: "S003",
    code: "LUA-DBSCL-TD",
    name: "Vụ Thu Đông (Đồng bằng sông Cửu Long)",
    description:
      "Canh tác từ tháng 8 đến tháng 11 tại những vùng có điều kiện tưới tiêu chủ động. Vụ này thường gặp khó khăn do thời tiết thất thường, mưa bão vào cuối vụ và nguy cơ ngập úng cao [2, 6].",
    duration: 95,
    status: "planning",
    scope: "crop",
    cropId: "Lúa",
    growthCycleIds: ["GC-LUA-02"],
    documents: [],
    createdAt: 1771687136467,
    updatedAt: 1780327192572,
    selectedStages: {
      "GC-LUA-02": {
        lua2_1: "25 ngày",
        lua2_2: "50 ngày",
        lua2_3: "30 ngày",
        lua2_4: "30 ngày",
      },
    },
  },
  {
    id: "S004",
    code: "LUA-DBSH-CX",
    name: "Vụ Chiêm Xuân (Đồng bằng sông Hồng)",
    description:
      "Thời gian canh tác từ tháng 11 đến tháng 5 [3]. Lúa chịu ảnh hưởng của rét đậm, rét hại đầu vụ nên thời gian sinh trưởng kéo dài. Phải áp dụng biện pháp che phủ nilon chống rét cho mạ [7, 8].",
    duration: 135,
    status: "active",
    scope: "crop",
    cropId: "Lúa",
    growthCycleIds: ["GC-LUA-02"],
    documents: [
      {
        id: "D003",
        name: "ky-thuat-chong-ret-lua-xuan.pdf",
        url: "#",
        type: "technical",
        uploadedAt: "2024-01-05",
      },
    ],
    createdAt: 1767367136467,
    updatedAt: 1780327200608,
    selectedStages: {
      "GC-LUA-01": {
        lua1_1: "15 ngày",
        lua1_2: "25 ngày",
        lua1_3: "30 ngày",
        lua1_4: "30 ngày",
      },
    },
  },
  {
    id: "S005",
    code: "LUA-DBSH-MUA",
    name: "Vụ Mùa (Đồng bằng sông Hồng)",
    description:
      "Diễn ra từ tháng 6 đến tháng 10 [3]. Vụ lúa chịu áp lực lớn từ thời tiết mưa nhiều, bão lũ, ngập úng và sâu bệnh hại [8]. Thường ưu tiên các giống lúa ngắn ngày có khả năng chống chịu tốt [8].",
    duration: 105,
    status: "active",
    scope: "crop",
    cropId: "Lúa",
    growthCycleIds: ["GC-LUA-02"],
    documents: [],
    createdAt: 1776007136467,
    updatedAt: 1780327206704,
    selectedStages: {
      "GC-LUA-02": {
        lua2_1: "25 ngày",
        lua2_2: "50 ngày",
        lua2_3: "30 ngày",
        lua2_4: "30 ngày",
      },
    },
  },
  {
    id: "S006",
    code: "LUA-TN-DX-TBR225",
    name: "Vụ Đông Xuân Tây Nguyên - Giống TBR225",
    description:
      "Gieo trồng từ tháng 12 đến tháng 1 năm sau nhằm tận dụng tối đa lượng nước tích lũy từ mùa mưa trước [9, 10]. Giống lúa TBR225 có khả năng đẻ nhánh khỏe, chống chịu sâu bệnh tốt và cho năng suất vượt trội (8.8 - 9 tấn/ha) tại Tây Nguyên [11].",
    duration: 115,
    status: "active",
    scope: "crop",
    cropId: "Lúa",
    growthCycleIds: ["GC-LUA-01"],
    documents: [
      {
        id: "D004",
        name: "ky-thuat-tbr225-tay-nguyen.pdf",
        url: "#",
        type: "technical",
        uploadedAt: "2024-02-20",
      },
    ],
    createdAt: 1769959136467,
    updatedAt: 1780327231201,
    selectedStages: {
      "GC-LUA-01": {
        lua1_1: "15 ngày",
        lua1_2: "25 ngày",
        lua1_3: "30 ngày",
        lua1_4: "30 ngày",
      },
    },
  },
];
