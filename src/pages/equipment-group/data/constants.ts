import type { EquipmentGroup } from "../types";

export const initialEquipmentGroups: EquipmentGroup[] = [
  {
    id: 1,
    code: "SOIL_PREP",
    name: "Máy làm đất và chuẩn bị đất",
    description:
      "Máy kéo nông nghiệp (tractor), máy đào mương, đắp bờ, máy đào hố trồng cây, máy xới đất, máy cày mini, máy bừa, máy phay",
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    code: "PLANTING",
    name: "Máy trồng trọt và gieo sạ",
    description:
      "Máy gieo hạt, máy trồng cây, máy cấy lúa, máy sạ lúa theo khóm",
    status: "active",
    createdAt: "2024-01-11",
  },
  {
    id: 3,
    code: "CARE_PROTECT",
    name: "Máy chăm sóc và bảo vệ",
    description:
      "Máy phun thuốc trừ sâu/phun phân bón (máy phun đeo vai, máy phun tự hành), máy cắt cỏ cầm tay, máy tưới tiêu (bơm nước, hệ thống tưới nhỏ giọt)",
    status: "active",
    createdAt: "2024-01-12",
  },
  {
    id: 4,
    code: "HARVESTING",
    name: "Máy thu hoạch",
    description:
      "Máy gặt lúa kiểu xếp dãy, máy gặt đập liên hợp (combine harvester), máy thu hoạch rau hoa, máy đập tuốt quả đậu, máy thu hoạch cỏ, máy đóng kiện rơm",
    status: "active",
    createdAt: "2024-01-13",
  },
  {
    id: 5,
    code: "POST_HARVEST",
    name: "Máy chế biến và xử lý sau thu hoạch",
    description:
      "Máy xát trắng gạo, máy đánh bóng gạo, máy sàng tạp chất gạo, máy tách màu nông sản, máy xay xát cà phê, máy phân loại cà phê, máy làm héo vò chè, máy vùi phân hữu cơ, máy đảo trộn phân bón",
    status: "active",
    createdAt: "2024-01-14",
  },
  {
    id: 6,
    code: "LIVESTOCK",
    name: "Máy chăn nuôi",
    description:
      "Máy nghiền/trộn thức ăn chăn nuôi, máy ép viên thức ăn, máy cung cấp thức ăn tự động, máy đếm trứng gia cầm, máy thái rau củ cho gia súc",
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 7,
    code: "AQUACULTURE",
    name: "Máy thủy sản",
    description: "Máy quạt nước cho ao nuôi, máy sục khí, máy cho ăn tự động",
    status: "active",
    createdAt: "2024-01-16",
  },
  {
    id: 8,
    code: "OTHER",
    name: "Máy khác",
    description: "Máy đóng gói nông sản, máy sấy thực phẩm, máy cuốn rơm",
    status: "active",
    createdAt: "2024-01-17",
  },
];
