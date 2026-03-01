import type { Season } from "./types";
import { initialGrowthCycles } from "../growth-cycle/mocks";

export const initialSeasons: Season[] = [
  {
    id: "S001",
    code: "SV-2024-XUAN",
    name: "Vụ Xuân 2024 - Đậu nành",
    description: "Canh tác đậu nành vụ Xuân tại khu vực A",
    duration: 130,
    status: "active",
    scope: "crop",
    cropId: "1", // Sầu riêng Ri6 (from crop mocks)
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
    duration: 120,
    status: "planning",
    scope: "variety",
    cropId: "3", // Let's assume some crop ID for Lúa if it exists, but I'll use 1 for demo
    varietyId: "5", // Lúa OM5451
    growthCycleIds: [],
    documents: [],
    createdAt: Date.now() - 5000000,
    updatedAt: Date.now(),
  },
];
