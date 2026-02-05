import type { Season } from "./types";
import { initialGrowthCycles } from "../growth-cycle/mocks";

export const initialSeasons: Season[] = [
  {
    id: "S001",
    code: "SV-2024-XUAN",
    name: "Vụ Xuân 2024 - Đậu nành",
    description: "Canh tác đậu nành vụ Xuân tại khu vực A",
    startDate: "2024-02-15",
    endDate: "2024-06-25",
    status: "active",
    growthCycleIds: ["GC001"],
    growthCycles: [initialGrowthCycles[0]],
    documents: [
      {
        id: "D001",
        name: "Quy trình kỹ thuật vụ Xuân",
        url: "#",
        type: "technical",
        uploadedAt: "2024-02-10",
      },
    ],
    createdAt: Date.now() - 10000000,
    updatedAt: Date.now() - 500000,
  },
  {
    id: "S002",
    code: "SV-2024-HE-THU",
    name: "Vụ Hè Thu 2024 - Lúa",
    description: "Kế hoạch canh tác lúa chất lượng cao",
    startDate: "2024-06-01",
    endDate: "2024-09-30",
    status: "planning",
    growthCycleIds: [],
    documents: [],
    createdAt: Date.now() - 5000000,
    updatedAt: Date.now(),
  },
];
