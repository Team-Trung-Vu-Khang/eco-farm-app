import { create } from "zustand";

export interface RegimenStep {
  id: string;
  day: string;
  title: string;
  description: string;
}

export interface Regimen {
  id: string;
  name: string;
  description: string;
  type: "cai-tao-dat" | "tri-benh";
  provider: string;
  category: string;
  crop: string;
  steps?: RegimenStep[];
}

interface RegimenStore {
  regimens: Regimen[];
  getRegimenById: (id: string) => Regimen | undefined;
  getRegimensByType: (type: "cai-tao-dat" | "tri-benh") => Regimen[];
}

const initialRegimens: Regimen[] = [
  {
    id: "reg-phen-cap-toc",
    name: "Phác đồ khử phèn cấp tốc",
    description: "Sử dụng vôi nóng và bơm xả liên tục",
    type: "cai-tao-dat",
    provider: "Viện Cây Ăn Quả Miền Nam",
    category: "Khử phèn",
    crop: "Tất cả",
    steps: [
      {
        id: "s1",
        day: "Ngày 1",
        title: "Bơm xả nước đợt 1",
        description: "Bơm cạn nước cũ trong mương, xả phèn mặt ruộng.",
      },
      {
        id: "s2",
        day: "Ngày 2",
        title: "Rải vôi nóng",
        description: "Sử dụng vôi bột (500kg/ha) rải đều trên mặt ruộng.",
      },
      {
        id: "s3",
        day: "Ngày 3-5",
        title: "Ngâm nước khử phèn",
        description: "Bơm nước mới vào ngâm để vôi phản ứng trung hòa axit.",
      },
      {
        id: "s4",
        day: "Ngày 6",
        title: "Xả nước đợt 2",
        description: "Xả bỏ nước ngâm và chuẩn bị bón lót lân.",
      },
    ],
  },
  {
    id: "reg-phen-ben-vung",
    name: "Phác đồ khử phèn bền vững",
    description: "Kết hợp vôi, lân và hữu cơ vi sinh",
    type: "cai-tao-dat",
    provider: "Eco-Farm R&D",
    category: "Khử phèn",
    crop: "Sầu riêng",
  },
  {
    id: "reg-man-rua-troi",
    name: "Phác đồ rửa mặn 3 bước",
    description: "Rửa trôi - Bón vôi - Trồng cây chịu mặn",
    type: "cai-tao-dat",
    provider: "Trung tâm Khuyến nông Quốc gia",
    category: "Rửa mặn",
    crop: "Lúa/Cây ăn trái",
  },
  {
    id: "reg-phong-ngua-sau-benh",
    name: "Phác đồ phòng ngừa sâu bệnh tổng hợp (IPM)",
    description: "Kết hợp biện pháp sinh học, hóa học và canh tác",
    type: "tri-benh",
    provider: "Eco-Farm Global",
    category: "Phòng ngừa tổng hợp",
    crop: "Sầu riêng",
  },
  {
    id: "reg-sau-duc-than",
    name: "Xử lý sâu đục thân chuyên sâu",
    description: "Phác đồ 14 ngày tiêu diệt trứng và ấu trùng sâu đục thân",
    type: "tri-benh",
    provider: "Viện Bảo vệ Thực vật",
    category: "Thiên địch & Hóa học",
    crop: "Xoài",
    steps: [
      {
        id: "s1",
        day: "Ngày 1",
        title: "Kiểm tra triệu chứng",
        description: "Dùng dao nạo vết thương, xác định vị trí sâu.",
      },
      {
        id: "s2",
        day: "Ngày 2",
        title: "Phun thuốc đợt 1",
        description: "Sử dụng thuốc lưu dẫn mạnh phun ướt thân cây.",
      },
      {
        id: "s3",
        day: "Ngày 7",
        title: "Đặt bẫy Pheromone",
        description: "Đặt bẫy xung quanh vườn để theo dõi bướm trưởng thành.",
      },
      {
        id: "s4",
        day: "Ngày 14",
        title: "Phun thuốc đợt 2",
        description: "Tiêu diệt các ấu trùng mới nở từ lứa trứng tiếp theo.",
      },
    ],
  },
  {
    id: "reg-nam-hong-sau-rieng",
    name: "Điều trị nấm hồng Sầu riêng",
    description: "Quy trình quét thuốc và bón phân phục hồi cây",
    type: "tri-benh",
    provider: "Syngenta Việt Nam",
    category: "Bệnh nấm",
    crop: "Sầu riêng",
  },
];

const useRegimenStore = create<RegimenStore>((_set, get) => ({
  regimens: initialRegimens,
  getRegimenById: (id) => get().regimens.find((r) => r.id === id),
  getRegimensByType: (type) => get().regimens.filter((r) => r.type === type),
}));

export default useRegimenStore;
