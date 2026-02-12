import { create } from "zustand";

export interface IrrigationSystem {
  id: string;
  name: string;
  description?: string;
}

interface IrrigationSystemStore {
  irrigationSystems: IrrigationSystem[];
}

const useIrrigationSystemStore = create<IrrigationSystemStore>((set) => ({
  irrigationSystems: [
    { id: "drip", name: "Tưới nhỏ giọt" },
    { id: "rain", name: "Tưới phun (Mưa nhân tạo)" },
    { id: "flood", name: "Tưới tràn" },
    { id: "manual", name: "Tưới thủ công" },
  ],
}));

export default useIrrigationSystemStore;
