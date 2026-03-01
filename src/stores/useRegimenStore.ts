import { create } from "zustand";

export interface Regimen {
  id: string;
  name: string;
  description: string;
  type: "cai-tao-dat" | "tri-benh";
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
  },
  {
    id: "reg-phen-ben-vung",
    name: "Phác đồ khử phèn bền vững",
    description: "Kết hợp vôi, lân và hữu cơ vi sinh",
    type: "cai-tao-dat",
  },
  {
    id: "reg-man-rua-troi",
    name: "Phác đồ rửa mặn 3 bước",
    description: "Rửa trôi - Bón vôi - Trồng cây chịu mặn",
    type: "cai-tao-dat",
  },
  {
    id: "reg-phong-ngua-sau-benh",
    name: "Phác đồ phòng ngừa sâu bệnh tổng hợp (IPM)",
    description: "Kết hợp biện pháp sinh học, hóa học và canh tác",
    type: "tri-benh",
  },
];

const useRegimenStore = create<RegimenStore>((_set, get) => ({
  regimens: initialRegimens,
  getRegimenById: (id) => get().regimens.find((r) => r.id === id),
  getRegimensByType: (type) => get().regimens.filter((r) => r.type === type),
}));

export default useRegimenStore;
