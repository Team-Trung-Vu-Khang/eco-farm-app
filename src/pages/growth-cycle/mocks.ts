import type { GrowthCycle } from "./types";
import { initialEditorValue } from "../docs/mocks";

const now = Date.now();

export const initialGrowthCycles: GrowthCycle[] = [
  {
    id: "GC001",
    name: "Chu kỳ sinh trưởng Đậu nành DT84",
    cropId: "crop1",
    cropName: "Đậu nành",
    variety: "DT84",
    totalDays: 130,
    numStages: 4,
    stages: [
      {
        id: "1",
        name: "Giai đoạn cây con",
        duration: 30,
        usePdf: false,
        content: initialEditorValue,
      },
      {
        id: "2",
        name: "Giai đoạn ra hoa",
        duration: 40,
        usePdf: false,
        content: initialEditorValue,
      },
      {
        id: "3",
        name: "Giai đoạn kết trái",
        duration: 40,
        usePdf: false,
        content: initialEditorValue,
      },
      {
        id: "4",
        name: "Giai đoạn thu hoạch",
        duration: 20,
        usePdf: false,
        content: initialEditorValue,
      },
    ],
    createdAt: now - 1000 * 60 * 60 * 24 * 30,
    updatedAt: now - 1000 * 60 * 60 * 24 * 5,
  },
  {
    id: "GC002",
    name: "Chu kỳ sinh trưởng Đậu nành DX11",
    cropId: "crop1",
    cropName: "Đậu nành",
    variety: "DX11",
    totalDays: 110,
    numStages: 3,
    stages: [],
    createdAt: now - 1000 * 60 * 60 * 24 * 45,
    updatedAt: now - 1000 * 60 * 60 * 24 * 10,
  },
];

export const cropOptions = [
  { label: "Đậu nành", value: "crop1" },
  { label: "Sầu riêng", value: "crop2" },
  { label: "Lúa", value: "crop3" },
];

export const varietyOptions = [
  { label: "DT84", value: "DT84" },
  { label: "DX11", value: "DX11" },
  { label: "Ri6", value: "Ri6" },
];

export { initialEditorValue };
