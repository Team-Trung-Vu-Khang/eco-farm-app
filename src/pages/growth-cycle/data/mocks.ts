import { initialEditorValue } from "@/pages/docs/mocks";
import type { GrowthCycle } from "../types/types";

const now = Date.now();

export const initialGrowthCycles: GrowthCycle[] = [
  {
    id: "GC001",
    name: "Quy trình kỹ thuật Sầu riêng (Chung)",
    scope: "crop",
    cropId: "Sầu riêng",
    cropName: "Sầu riêng",
    totalDays: 365,
    numStages: 4,
    stages: [
      {
        id: "s1",
        name: "Giai đoạn phục hồi sau thu hoạch",
        duration: 60,
        usePdf: false,
        content: initialEditorValue,
      },
      {
        id: "s2",
        name: "Giai đoạn tạo tán, rước mắt cua",
        duration: 90,
        usePdf: false,
        content: initialEditorValue,
      },
      {
        id: "s3",
        name: "Giai đoạn ra hoa, đậu quả",
        duration: 90,
        usePdf: false,
        content: initialEditorValue,
      },
      {
        id: "s4",
        name: "Giai đoạn nuôi quả và thu hoạch",
        duration: 125,
        usePdf: false,
        content: initialEditorValue,
      },
    ],
    createdAt: now - 30 * 86400000,
    updatedAt: now - 5 * 86400000,
  },
  {
    id: "GC002",
    name: "Quy trình Sầu riêng Ri6 (Đặc thù)",
    scope: "variety",
    cropId: "Sầu riêng",
    cropName: "Sầu riêng",
    variety: "1", // ID of Sầu riêng Ri6 in variety mocks
    totalDays: 340,
    numStages: 3,
    stages: [
      {
        id: "r1",
        name: "Xử lý ra hoa nghịch vụ",
        duration: 100,
        usePdf: false,
        content: initialEditorValue,
      },
      {
        id: "r2",
        name: "Phát triển trái",
        duration: 150,
        usePdf: false,
        content: initialEditorValue,
      },
      {
        id: "r3",
        name: "Thu hoạch & dưỡng cây",
        duration: 90,
        usePdf: false,
        content: initialEditorValue,
      },
    ],
    createdAt: now - 60 * 86400000,
    updatedAt: now - 10 * 86400000,
  },
  {
    id: "GC003",
    name: "Chu kỳ sinh trưởng Lúa OM5451",
    scope: "variety",
    cropId: "Lúa",
    cropName: "Lúa",
    variety: "5", // ID of Lúa OM5451 in variety mocks
    totalDays: 95,
    numStages: 4,
    stages: [
      {
        id: "l1",
        name: "Giai đoạn mạ",
        duration: 20,
        usePdf: false,
        content: initialEditorValue,
      },
      {
        id: "l2",
        name: "Giai đoạn đẻ nhánh",
        duration: 30,
        usePdf: false,
        content: initialEditorValue,
      },
      {
        id: "l3",
        name: "Giai đoạn làm đòng",
        duration: 25,
        usePdf: false,
        content: initialEditorValue,
      },
      {
        id: "l4",
        name: "Giai đoạn chín & thu hoạch",
        duration: 20,
        usePdf: false,
        content: initialEditorValue,
      },
    ],
    createdAt: now - 15 * 86400000,
    updatedAt: now,
  },
  {
    id: "GC004",
    name: "Chu kỳ sinh trưởng Đậu nành DT84",
    scope: "variety",
    cropId: "Đậu nành",
    cropName: "Đậu nành",
    variety: "6", // ID of Đậu nành DT84 in variety mocks
    totalDays: 90,
    numStages: 4,
    stages: [
      {
        id: "d1",
        name: "Giai đoạn cây con",
        duration: 25,
        usePdf: false,
        content: initialEditorValue,
      },
      {
        id: "d2",
        name: "Giai đoạn ra hoa",
        duration: 25,
        usePdf: false,
        content: initialEditorValue,
      },
      {
        id: "d3",
        name: "Giai đoạn kết quả",
        duration: 25,
        usePdf: false,
        content: initialEditorValue,
      },
      {
        id: "d4",
        name: "Giai đoạn thu hoạch",
        duration: 15,
        usePdf: false,
        content: initialEditorValue,
      },
    ],
    createdAt: now - 5 * 86400000,
    updatedAt: now,
  },
  {
    id: "GC005",
    name: "Quy trình canh tác Đậu nành chuẩn",
    scope: "crop",
    cropId: "Đậu nành",
    cropName: "Đậu nành",
    totalDays: 110,
    numStages: 3,
    stages: [
      {
        id: "dc1",
        name: "Giai đoạn cây con",
        duration: 30,
        usePdf: false,
        content: initialEditorValue,
      },
      {
        id: "dc2",
        name: "Giai đoạn ra hoa kết trái",
        duration: 50,
        usePdf: false,
        content: initialEditorValue,
      },
      {
        id: "dc3",
        name: "Giai đoạn thu hoạch",
        duration: 30,
        usePdf: false,
        content: initialEditorValue,
      },
    ],
    createdAt: now - 100 * 86400000,
    updatedAt: now - 20 * 86400000,
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
