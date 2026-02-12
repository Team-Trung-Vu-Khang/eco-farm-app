import { create } from "zustand";

export interface FarmingMethod {
  id: string;
  name: string;
  description?: string;
}

interface FarmingMethodStore {
  farmingMethods: FarmingMethod[];
}

const useFarmingMethodStore = create<FarmingMethodStore>((set) => ({
  farmingMethods: [
    {
      id: "organic",
      name: "Hữu cơ (Organic)",
      description: "Canh tác theo hướng hữu cơ, không sử dụng hóa chất",
    },
    {
      id: "vietgap",
      name: "VietGAP",
      description: "Thực hành sản xuất nông nghiệp tốt tại Việt Nam",
    },
    {
      id: "traditional",
      name: "Truyền thống",
      description: "Canh tác theo phương pháp truyền thống địa phương",
    },
    {
      id: "greenhouse",
      name: "Nhà kính (High-tech)",
      description: "Canh tác trong nhà kính công nghệ cao",
    },
  ],
}));

export default useFarmingMethodStore;
