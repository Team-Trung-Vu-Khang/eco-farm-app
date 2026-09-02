import type { FarmTaskResponse } from "@/features/farm-task";

// ─── Types for HistoryCreatePage ──────────────────────────────────────────────

export interface MockWorkflowItem {
  id: string;
  code: string;
  name: string;
  domainCode: string;
}

export interface MockPlanItem {
  id: string;
  workflowId: string;
  code: string;
  name: string;
}

export interface MockTaskSupplyLine {
  id: number;
  name: string;
  plannedQty: string;
  actualQty?: string;
  unit: string;
}

export interface MockTaskItem {
  id: string;
  planId: string;
  code: string;
  name: string;
  workType: string;
  startDate: string;
  endDate: string;
  supplyLines?: MockTaskSupplyLine[];
}

// ─── Mock Data for HistoryCreatePage ──────────────────────────────────────────

export const MOCK_WORKFLOWS: MockWorkflowItem[] = [
  {
    id: "38",
    code: "WKF-0000035",
    name: "WKF-0000035 - Tên sơ đồ",
    domainCode: "CROP",
  },
  {
    id: "33",
    code: "WKF-0000033",
    name: "WKF-0000033 - Sơ đồ A",
    domainCode: "CROP",
  },
  {
    id: "10",
    code: "QT001",
    name: "QT001 - Lúa hữu cơ 2024",
    domainCode: "CROP",
  },
  {
    id: "11",
    code: "QT002",
    name: "QT002 - Rau màu an toàn",
    domainCode: "CROP",
  },
  {
    id: "12",
    code: "QT003",
    name: "QT003 - Cây ăn trái GAP",
    domainCode: "CROP",
  },
  {
    id: "13",
    code: "QT004",
    name: "QT004 - Nuôi tôm thẻ chân trắng",
    domainCode: "AQUACULTURE",
  },
];

export const MOCK_PLANS: MockPlanItem[] = [
  {
    id: "3801",
    workflowId: "38",
    code: "PLN-3801",
    name: "Kế hoạch Canh tác Vụ 1 - Tên sơ đồ",
  },
  {
    id: "3802",
    workflowId: "38",
    code: "PLN-3802",
    name: "Kế hoạch Thu hoạch & Bảo quản - Tên sơ đồ",
  },
  {
    id: "3301",
    workflowId: "33",
    code: "PLN-3301",
    name: "Kế hoạch Canh tác - Sơ đồ A",
  },
  {
    id: "3302",
    workflowId: "33",
    code: "PLN-3302",
    name: "Kế hoạch Chăm sóc Cây trồng mới kiểm thử",
  },
  {
    id: "20",
    workflowId: "10",
    code: "KH-LUA-01",
    name: "Kế hoạch Vụ Đông Xuân 2024",
  },
  {
    id: "21",
    workflowId: "11",
    code: "KH-RAU-02",
    name: "Kế hoạch Hè Thu 2024",
  },
  {
    id: "22",
    workflowId: "12",
    code: "KH-CAT-01",
    name: "Kế hoạch Chăm sóc Q1/2025",
  },
  {
    id: "23",
    workflowId: "13",
    code: "KH-TOM-01",
    name: "Kế hoạch Nuôi tôm Vụ 1/2024",
  },
];

export const MOCK_TASKS_LIST: MockTaskItem[] = [
  {
    id: "10381",
    planId: "3801",
    code: "CV-3801",
    name: "Bón phân lót và làm đất - Sơ đồ 35",
    workType: "amendment",
    startDate: "2026-09-05",
    endDate: "2026-09-10",
    supplyLines: [
      {
        id: 1,
        name: "Phân NPK 20-20-15",
        plannedQty: "150",
        actualQty: "10",
        unit: "kg",
      },
      {
        id: 2,
        name: "Vôi bột cải tạo đất",
        plannedQty: "50",
        actualQty: "50",
        unit: "kg",
      },
    ],
  },
  {
    id: "10382",
    planId: "3801",
    code: "CV-3802",
    name: "Phun thuốc BVTV sinh học đợt 1",
    workType: "treatment",
    startDate: "2026-09-15",
    endDate: "2026-09-18",
    supplyLines: [
      {
        id: 3,
        name: "Thuốc BVTV sinh học",
        plannedQty: "5",
        actualQty: "5",
        unit: "lít",
      },
    ],
  },
  {
    id: "10383",
    planId: "3802",
    code: "CV-3802-TH",
    name: "Thu hoạch nông sản đợt 1",
    workType: "harvest",
    startDate: "2026-10-01",
    endDate: "2026-10-05",
  },
  {
    id: "10331",
    planId: "3301",
    code: "CV-3301",
    name: "Kiểm thử tưới nước tự động - Sơ đồ A",
    workType: "cultivation",
    startDate: "2026-09-02",
    endDate: "2026-09-06",
  },
  {
    id: "10332",
    planId: "3301",
    code: "CV-3302",
    name: "Kiểm tra sâu bệnh cây trồng mới",
    workType: "treatment",
    startDate: "2026-09-08",
    endDate: "2026-09-12",
  },
  {
    id: "10333",
    planId: "3302",
    code: "CV-3303",
    name: "Cải tạo đất và bón phân hữu cơ",
    workType: "amendment",
    startDate: "2026-09-15",
    endDate: "2026-09-20",
  },
  {
    id: "101",
    planId: "20",
    code: "CV-0001",
    name: "Kiểm tra sức khỏe cây trồng đợt 1",
    workType: "cultivation",
    startDate: "2024-03-10",
    endDate: "2024-03-15",
    supplyLines: [
      {
        id: 4,
        name: "Phân hữu cơ vi sinh",
        plannedQty: "200",
        actualQty: "200",
        unit: "kg",
      },
    ],
  },
  {
    id: "103",
    planId: "20",
    code: "CV-0003",
    name: "Thu hoạch lúa Đông Xuân",
    workType: "harvest",
    startDate: "2024-08-20",
    endDate: "2024-08-25",
  },
  {
    id: "102",
    planId: "21",
    code: "CV-0002",
    name: "Bón phân đợt 2 — Vụ rau màu Hè Thu",
    workType: "cultivation",
    startDate: "2024-09-05",
    endDate: "2024-09-07",
    supplyLines: [
      {
        id: 5,
        name: "Phân NPK 20-20-15",
        plannedQty: "150",
        actualQty: "150",
        unit: "kg",
      },
    ],
  },
  {
    id: "104",
    planId: "22",
    code: "CV-0004",
    name: "Phun thuốc trừ sâu đợt 1 — Khu C",
    workType: "treatment",
    startDate: "2025-01-10",
    endDate: "2025-01-12",
  },
  {
    id: "105",
    planId: "23",
    code: "CV-0005",
    name: "Cho tôm ăn và kiểm tra chất lượng nước",
    workType: "cultivation",
    startDate: "2024-04-01",
    endDate: "2024-04-05",
  },
];

export const MOCK_TASKS: FarmTaskResponse[] = [
  {
    id: 10381,
    code: "CV-3801",
    name: "Bón phân lót và làm đất - Sơ đồ 35",
    origin: "PLANNED",
    parent: null,
    domainCode: "CROP",
    workflow: { id: 38, code: "WKF-0000035", name: "Tên sơ đồ" },
    plan: {
      id: 3801,
      code: "PLN-3801",
      name: "Kế hoạch Canh tác Vụ 1 - Tên sơ đồ",
    },
    scopeType: "REGION",
    region: { id: 56, code: "RG-0000049", name: "Xin Chào Thế Giới" },
    area: null,
    plot: null,
    sourceWorkItem: null,
    taskCategory: { id: 1, code: "CAT-CAI-TAO", name: "Cải tạo đất" },
    priority: "HIGH",
    note: "Tiến hành bón phân lót và xới đất chuẩn bị gieo trồng.",
    personnel: [{ id: 3, fullName: "Lê Văn Cường", role: "ASSIGNEE" }],
    startDate: "2026-09-05",
    endDate: "2026-09-10",
    durationDays: 5,
    spawnedChildCount: null,
    recurrence: { repeatMode: "NONE", repeatDates: null },
    supplyLines: [
      {
        id: 1,
        supplyItem: { id: 203, code: "VT-3801", name: "Phân NPK 20-20-15" },
        unitBase: { id: 1, code: "KG", name: "kg" },
        quantity: 150,
        displayOrder: 1,
      },
      {
        id: 2,
        supplyItem: { id: 204, code: "VT-3802", name: "Vôi bột cải tạo đất" },
        unitBase: { id: 1, code: "KG", name: "kg" },
        quantity: 50,
        displayOrder: 2,
      },
    ],
    status: "DOING",
    createdAt: "2026-09-02T04:20:00Z",
    updatedAt: "2026-09-02T04:20:00Z",
  },
  {
    id: 10382,
    code: "CV-3802",
    name: "Phun thuốc BVTV sinh học đợt 1",
    origin: "PLANNED",
    parent: null,
    domainCode: "CROP",
    workflow: { id: 38, code: "WKF-0000035", name: "Tên sơ đồ" },
    plan: {
      id: 3801,
      code: "PLN-3801",
      name: "Kế hoạch Canh tác Vụ 1 - Tên sơ đồ",
    },
    scopeType: "REGION",
    region: { id: 56, code: "RG-0000049", name: "Xin Chào Thế Giới" },
    area: null,
    plot: null,
    sourceWorkItem: null,
    taskCategory: { id: 4, code: "CAT-PHUN-THUOC", name: "Phun thuốc BVTV" },
    priority: "HIGH",
    note: "Phun thuốc BVTV sinh học đợt 1.",
    personnel: [{ id: 3, fullName: "Lê Văn Cường", role: "ASSIGNEE" }],
    startDate: "2026-09-15",
    endDate: "2026-09-18",
    durationDays: 3,
    spawnedChildCount: null,
    recurrence: { repeatMode: "NONE", repeatDates: null },
    supplyLines: [
      {
        id: 3,
        supplyItem: { id: 205, code: "VT-3803", name: "Thuốc BVTV sinh học" },
        unitBase: { id: 2, code: "LT", name: "lít" },
        quantity: 5,
        displayOrder: 1,
      },
    ],
    status: "TODO",
    createdAt: "2026-09-02T04:20:00Z",
    updatedAt: "2026-09-02T04:20:00Z",
  },
  {
    id: 10383,
    code: "CV-3802-TH",
    name: "Thu hoạch nông sản đợt 1",
    origin: "PLANNED",
    parent: null,
    domainCode: "CROP",
    workflow: { id: 38, code: "WKF-0000035", name: "Tên sơ đồ" },
    plan: {
      id: 3802,
      code: "PLN-3802",
      name: "Kế hoạch Thu hoạch & Bảo quản - Tên sơ đồ",
    },
    scopeType: "REGION",
    region: { id: 56, code: "RG-0000049", name: "Xin Chào Thế Giới" },
    area: null,
    plot: null,
    sourceWorkItem: null,
    taskCategory: { id: 3, code: "CAT-THU-HOACH", name: "Thu hoạch" },
    priority: "HIGH",
    note: "Tiến hành thu hoạch lứa nông sản đầu tiên của vụ.",
    personnel: [{ id: 3, fullName: "Lê Văn Cường", role: "ASSIGNEE" }],
    startDate: "2026-10-01",
    endDate: "2026-10-05",
    durationDays: 5,
    spawnedChildCount: null,
    recurrence: { repeatMode: "NONE", repeatDates: null },
    supplyLines: [],
    status: "TODO",
    createdAt: "2026-09-02T04:20:00Z",
    updatedAt: "2026-09-02T04:20:00Z",
  },
  {
    id: 10331,
    code: "CV-3301",
    name: "Kiểm thử tưới nước tự động - Sơ đồ A",
    origin: "PLANNED",
    parent: null,
    domainCode: "CROP",
    workflow: { id: 33, code: "WKF-0000033", name: "Sơ đồ A" },
    plan: { id: 3301, code: "PLN-3301", name: "Kế hoạch Canh tác - Sơ đồ A" },
    scopeType: "REGION",
    region: { id: 55, code: "RG-0000048", name: "123" },
    area: null,
    plot: null,
    sourceWorkItem: null,
    taskCategory: { id: 2, code: "CAT-CANH-TAC", name: "Canh tác" },
    priority: "MEDIUM",
    note: "Kiểm tra hệ thống tưới nước tự động cho cây trồng mới.",
    personnel: [{ id: 5, fullName: "Hoàng Văn Em", role: "ASSIGNEE" }],
    startDate: "2026-09-02",
    endDate: "2026-09-06",
    durationDays: 4,
    spawnedChildCount: null,
    recurrence: { repeatMode: "NONE", repeatDates: null },
    supplyLines: [],
    status: "DOING",
    createdAt: "2026-08-31T01:56:00Z",
    updatedAt: "2026-08-31T01:56:00Z",
  },
  {
    id: 10332,
    code: "CV-3302",
    name: "Kiểm tra sâu bệnh cây trồng mới",
    origin: "PLANNED",
    parent: null,
    domainCode: "CROP",
    workflow: { id: 33, code: "WKF-0000033", name: "Sơ đồ A" },
    plan: { id: 3301, code: "PLN-3301", name: "Kế hoạch Canh tác - Sơ đồ A" },
    scopeType: "REGION",
    region: { id: 55, code: "RG-0000048", name: "123" },
    area: null,
    plot: null,
    sourceWorkItem: null,
    taskCategory: { id: 4, code: "CAT-DIEU-TRI", name: "Điều trị" },
    priority: "HIGH",
    note: "Kiểm tra rầy nâu và các vết nấm lá.",
    personnel: [{ id: 5, fullName: "Hoàng Văn Em", role: "ASSIGNEE" }],
    startDate: "2026-09-08",
    endDate: "2026-09-12",
    durationDays: 4,
    spawnedChildCount: null,
    recurrence: { repeatMode: "NONE", repeatDates: null },
    supplyLines: [],
    status: "TODO",
    createdAt: "2026-08-31T01:56:00Z",
    updatedAt: "2026-08-31T01:56:00Z",
  },
  {
    id: 1,
    code: "CV-0001",
    name: "Kiểm tra sức khỏe cây trồng đợt 1",
    origin: "PLANNED",
    parent: null,
    domainCode: "CROP",
    workflow: { id: 10, code: "QT001", name: "QT001 - Lúa hữu cơ 2024" },
    plan: { id: 20, code: "KH-LUA-01", name: "Kế hoạch Vụ Đông Xuân 2024" },
    scopeType: "PLOT",
    region: { id: 1, code: "VCA", name: "Vùng Canh Tác A" },
    area: { id: 11, code: "KHU-A1", name: "Khu A1" },
    plot: { id: 101, code: "LO-01", name: "Lô 01" },
    sourceWorkItem: null,
    taskCategory: { id: 1, code: "CAT-CANH-TAC", name: "Canh tác" },
    priority: "HIGH",
    note: "Kiểm tra sâu bệnh và tình trạng sinh trưởng.",
    personnel: [
      { id: 3, fullName: "Lê Văn Cường", role: "ASSIGNEE" },
      { id: 4, fullName: "Phạm Thị Dung", role: "SUPERVISOR" },
    ],
    startDate: "2024-03-10",
    endDate: "2024-03-15",
    durationDays: 5,
    spawnedChildCount: null,
    recurrence: { repeatMode: "NONE", repeatDates: null },
    supplyLines: [
      {
        id: 1,
        supplyItem: { id: 201, code: "VT-001", name: "Phân hữu cơ vi sinh" },
        unitBase: { id: 1, code: "KG", name: "kg" },
        quantity: 200,
        displayOrder: 1,
      },
      {
        id: 2,
        supplyItem: { id: 202, code: "VT-002", name: "Thuốc BVTV sinh học" },
        unitBase: { id: 2, code: "LT", name: "lít" },
        quantity: 5,
        displayOrder: 2,
      },
    ],
    status: "DOING",
    createdAt: "2024-03-08T07:00:00Z",
    updatedAt: "2024-03-12T09:30:00Z",
  },
  {
    id: 2,
    code: "CV-0002",
    name: "Bón phân đợt 2 — Vụ rau màu Hè Thu",
    origin: "PLANNED",
    parent: null,
    domainCode: "CROP",
    workflow: { id: 11, code: "QT002", name: "QT002 - Rau màu an toàn" },
    plan: { id: 21, code: "KH-RAU-02", name: "Kế hoạch Hè Thu 2024" },
    scopeType: "AREA",
    region: { id: 2, code: "VCB", name: "Vùng Canh Tác B" },
    area: { id: 12, code: "KHU-B2", name: "Khu B2" },
    plot: null,
    sourceWorkItem: null,
    taskCategory: { id: 2, code: "CAT-BON-PHAN", name: "Bón phân" },
    priority: "MEDIUM",
    note: "Bón phân NPK theo liều lượng quy định.",
    personnel: [{ id: 5, fullName: "Hoàng Văn Em", role: "ASSIGNEE" }],
    startDate: "2024-09-05",
    endDate: "2024-09-07",
    durationDays: 2,
    spawnedChildCount: null,
    recurrence: { repeatMode: "NONE", repeatDates: null },
    supplyLines: [
      {
        id: 3,
        supplyItem: { id: 203, code: "VT-003", name: "Phân NPK 20-20-15" },
        unitBase: { id: 1, code: "KG", name: "kg" },
        quantity: 150,
        displayOrder: 1,
      },
    ],
    status: "TODO",
    createdAt: "2024-09-01T08:00:00Z",
    updatedAt: "2024-09-01T08:00:00Z",
  },
  {
    id: 3,
    code: "CV-0003",
    name: "Thu hoạch lúa Đông Xuân — Lô 01 & Lô 02",
    origin: "PLANNED",
    parent: null,
    domainCode: "CROP",
    workflow: { id: 10, code: "QT001", name: "QT001 - Lúa hữu cơ 2024" },
    plan: { id: 20, code: "KH-LUA-01", name: "Kế hoạch Vụ Đông Xuân 2024" },
    scopeType: "REGION",
    region: { id: 1, code: "VCA", name: "Vùng Canh Tác A" },
    area: null,
    plot: null,
    sourceWorkItem: null,
    taskCategory: { id: 3, code: "CAT-THU-HOACH", name: "Thu hoạch" },
    priority: "HIGH",
    note: "Thu hoạch theo đợt, ưu tiên lô có sản lượng cao nhất.",
    personnel: [
      { id: 7, fullName: "Đặng Văn Giang", role: "ASSIGNEE" },
      { id: 8, fullName: "Bùi Thị Hạnh", role: "ASSIGNEE" },
      { id: 3, fullName: "Lê Văn Cường", role: "SUPERVISOR" },
    ],
    startDate: "2024-08-20",
    endDate: "2024-08-25",
    durationDays: 5,
    spawnedChildCount: null,
    recurrence: { repeatMode: "NONE", repeatDates: null },
    supplyLines: [],
    status: "DONE",
    createdAt: "2024-08-15T06:30:00Z",
    updatedAt: "2024-08-25T16:00:00Z",
  },
  {
    id: 4,
    code: "CV-0004",
    name: "Phun thuốc trừ sâu đợt 1 — Khu C",
    origin: "PLANNED",
    parent: null,
    domainCode: "CROP",
    workflow: { id: 12, code: "QT003", name: "QT003 - Cây ăn trái GAP" },
    plan: { id: 22, code: "KH-CAT-01", name: "Kế hoạch Chăm sóc Q1/2025" },
    scopeType: "AREA",
    region: { id: 3, code: "VCC", name: "Vùng Canh Tác C" },
    area: { id: 13, code: "KHU-C1", name: "Khu C1" },
    plot: null,
    sourceWorkItem: null,
    taskCategory: { id: 4, code: "CAT-PHUN-THUOC", name: "Phun thuốc BVTV" },
    priority: "HIGH",
    note: "Phun thuốc sinh học theo lịch định kỳ.",
    personnel: [
      { id: 9, fullName: "Đỗ Văn Hùng", role: "ASSIGNEE" },
      { id: 11, fullName: "Ngô Văn Minh", role: "SUPERVISOR" },
    ],
    startDate: "2025-01-10",
    endDate: "2025-01-12",
    durationDays: 2,
    spawnedChildCount: null,
    recurrence: { repeatMode: "NONE", repeatDates: null },
    supplyLines: [
      {
        id: 4,
        supplyItem: {
          id: 204,
          code: "VT-004",
          name: "Thuốc trừ sâu sinh học Bt",
        },
        unitBase: { id: 2, code: "LT", name: "lít" },
        quantity: 10,
        displayOrder: 1,
      },
      {
        id: 5,
        supplyItem: { id: 205, code: "VT-005", name: "Bình phun áp suất" },
        unitBase: { id: 3, code: "CAI", name: "cái" },
        quantity: 2,
        displayOrder: 2,
      },
    ],
    status: "TODO",
    createdAt: "2025-01-05T09:00:00Z",
    updatedAt: "2025-01-05T09:00:00Z",
  },
  {
    id: 5,
    code: "CV-0005",
    name: "Cải tạo đất sau vụ — Khu A1",
    origin: "PLANNED",
    parent: null,
    domainCode: "CROP",
    workflow: { id: 10, code: "QT001", name: "QT001 - Lúa hữu cơ 2024" },
    plan: { id: 23, code: "KH-CAI-TAO-01", name: "Kế hoạch Cải tạo đất Q3" },
    scopeType: "AREA",
    region: { id: 1, code: "VCA", name: "Vùng Canh Tác A" },
    area: { id: 11, code: "KHU-A1", name: "Khu A1" },
    plot: null,
    sourceWorkItem: null,
    taskCategory: { id: 5, code: "CAT-CAI-TAO", name: "Cải tạo đất" },
    priority: "LOW",
    note: "Cày bừa, bón vôi và cải tạo cơ cấu đất.",
    personnel: [{ id: 15, fullName: "Nguyễn Văn Sơn", role: "ASSIGNEE" }],
    startDate: "2024-07-01",
    endDate: "2024-07-05",
    durationDays: 4,
    spawnedChildCount: null,
    recurrence: { repeatMode: "NONE", repeatDates: null },
    supplyLines: [
      {
        id: 6,
        supplyItem: { id: 206, code: "VT-006", name: "Vôi bột nông nghiệp" },
        unitBase: { id: 1, code: "KG", name: "kg" },
        quantity: 500,
        displayOrder: 1,
      },
    ],
    status: "DONE",
    createdAt: "2024-06-25T08:00:00Z",
    updatedAt: "2024-07-05T17:00:00Z",
  },
  {
    id: 6,
    code: "CV-0006",
    name: "Tưới nước bổ sung — Vụ Hè Thu (QUÁ HẠN)",
    origin: "PLANNED",
    parent: null,
    domainCode: "CROP",
    workflow: { id: 11, code: "QT002", name: "QT002 - Rau màu an toàn" },
    plan: { id: 21, code: "KH-RAU-02", name: "Kế hoạch Hè Thu 2024" },
    scopeType: "PLOT",
    region: { id: 2, code: "VCB", name: "Vùng Canh Tác B" },
    area: { id: 12, code: "KHU-B2", name: "Khu B2" },
    plot: { id: 102, code: "LO-02", name: "Lô 02" },
    sourceWorkItem: null,
    taskCategory: { id: 6, code: "CAT-TUOI-NUOC", name: "Tưới nước" },
    priority: "MEDIUM",
    note: "Tưới bổ sung do thiếu mưa kéo dài.",
    personnel: [
      { id: 6, fullName: "Vũ Thị Phương", role: "ASSIGNEE" },
      { id: 4, fullName: "Phạm Thị Dung", role: "SUPERVISOR" },
    ],
    startDate: "2024-08-01",
    endDate: "2024-08-05",
    durationDays: 4,
    spawnedChildCount: null,
    recurrence: { repeatMode: "NONE", repeatDates: null },
    supplyLines: [],
    status: "TODO",
    createdAt: "2024-07-28T10:00:00Z",
    updatedAt: "2024-07-28T10:00:00Z",
  },
  {
    id: 7,
    code: "CV-0007",
    name: "Lấy mẫu đất kiểm tra dinh dưỡng — Vùng C",
    origin: "PLANNED",
    parent: null,
    domainCode: "CROP",
    workflow: { id: 12, code: "QT003", name: "QT003 - Cây ăn trái GAP" },
    plan: { id: 22, code: "KH-CAT-01", name: "Kế hoạch Chăm sóc Q1/2025" },
    scopeType: "REGION",
    region: { id: 3, code: "VCC", name: "Vùng Canh Tác C" },
    area: null,
    plot: null,
    sourceWorkItem: null,
    taskCategory: { id: 7, code: "CAT-LAY-MAU", name: "Lấy mẫu đất" },
    priority: "LOW",
    note: null,
    personnel: [
      { id: 13, fullName: "Lý Văn Phúc", role: "ASSIGNEE" },
      { id: 14, fullName: "Mai Thị Quyên", role: "ASSIGNEE" },
    ],
    startDate: "2025-02-01",
    endDate: "2025-02-03",
    durationDays: 2,
    spawnedChildCount: null,
    recurrence: { repeatMode: "NONE", repeatDates: null },
    supplyLines: [
      {
        id: 7,
        supplyItem: { id: 207, code: "VT-007", name: "Túi lấy mẫu đất" },
        unitBase: { id: 3, code: "CAI", name: "cái" },
        quantity: 20,
        displayOrder: 1,
      },
    ],
    status: "TODO",
    createdAt: "2025-01-25T11:00:00Z",
    updatedAt: "2025-01-25T11:00:00Z",
  },
];

// ─── Types & Mock Data for UpdateHistoryPage ─────────────────────────────────

export interface SupplyActualRecord {
  id: number;
  name: string;
  plannedQty?: string;
  actualQty: string;
  unit: string;
}

export interface UpdateLogEntry {
  id: string | number;
  updatedAt: string;
  updaterName: string;
  updaterRole?: string;
  completionPercent?: number;
  status: "DOING" | "COMPLETED" | "TODO";
  note: string;
  supplies?: SupplyActualRecord[];
  images?: string[];
}

export interface TaskHistoryItem {
  id: string | number;
  taskCode: string;
  taskName: string;
  origin: "PLANNED" | "AD_HOC";
  workflowName?: string;
  workflowId?: number | string;
  planCode?: string;
  planName?: string;
  planId?: number | string;
  taskCategoryName?: string;
  latestUpdate: UpdateLogEntry;
  historyLogs: UpdateLogEntry[];
}

export const MOCK_UPDATE_HISTORY: TaskHistoryItem[] = [
  {
    id: 101,
    taskCode: "CV-3801",
    taskName: "Bón phân lót và làm đất - Sơ đồ 35",
    origin: "PLANNED",
    workflowName: "WKF-0000035 - Tên sơ đồ",
    workflowId: 38,
    planCode: "PLN-3801",
    planName: "Kế hoạch Canh tác Vụ 1 - Tên sơ đồ",
    planId: 3801,
    taskCategoryName: "Cải tạo đất",
    latestUpdate: {
      id: "upd-3801-3",
      updatedAt: "2026-09-02T10:30:00Z",
      updaterName: "Lê Văn Cường",
      updaterRole: "Kỹ sư canh tác",
      completionPercent: 85,
      status: "DOING",
      note: "Đã hoàn thành bón lót phân NPK 20-20-15 đợt 1 và xới đất đợt 2 cho vùng canh tác A.",
      supplies: [
        {
          id: 1,
          name: "Phân NPK 20-20-15",
          plannedQty: "150",
          actualQty: "10",
          unit: "kg",
        },
        {
          id: 2,
          name: "Vôi bột cải tạo đất",
          plannedQty: "50",
          actualQty: "50",
          unit: "kg",
        },
      ],
    },
    historyLogs: [
      {
        id: "upd-3801-3",
        updatedAt: "2026-09-02T10:30:00Z",
        updaterName: "Lê Văn Cường",
        updaterRole: "Kỹ sư canh tác",
        completionPercent: 85,
        status: "DOING",
        note: "Đã hoàn thành bón lót phân NPK 20-20-15 đợt 1 và xới đất đợt 2 cho vùng canh tác A.",
        supplies: [
          {
            id: 1,
            name: "Phân NPK 20-20-15",
            plannedQty: "150",
            actualQty: "10",
            unit: "kg",
          },
          {
            id: 2,
            name: "Vôi bột cải tạo đất",
            plannedQty: "50",
            actualQty: "50",
            unit: "kg",
          },
        ],
      },
      {
        id: "upd-3801-2",
        updatedAt: "2026-09-01T15:45:00Z",
        updaterName: "Lê Văn Cường",
        updaterRole: "Kỹ sư canh tác",
        completionPercent: 50,
        status: "DOING",
        note: "Hoàn tất rải 50kg vôi bột khử chua mặt đất, chuẩn bị máy xới đất bón phân lót.",
        supplies: [
          {
            id: 2,
            name: "Vôi bột cải tạo đất",
            plannedQty: "50",
            actualQty: "50",
            unit: "kg",
          },
        ],
      },
      {
        id: "upd-3801-1",
        updatedAt: "2026-08-31T08:00:00Z",
        updaterName: "Phạm Thị Dung",
        updaterRole: "Giám sát kỹ thuật",
        completionPercent: 15,
        status: "DOING",
        note: "Kiểm tra độ pH đất trước khi cải tạo. Đất hơi chua, đo pH = 5.2.",
      },
    ],
  },
  {
    id: 102,
    taskCode: "CV-0001",
    taskName: "Kiểm tra sức khỏe cây trồng đợt 1",
    origin: "PLANNED",
    workflowName: "QT001 - Lúa hữu cơ 2024",
    workflowId: 10,
    planCode: "KH-LUA-01",
    planName: "Kế hoạch Vụ Đông Xuân 2024",
    planId: 20,
    taskCategoryName: "Canh tác",
    latestUpdate: {
      id: "upd-0001-2",
      updatedAt: "2026-09-02T09:15:00Z",
      updaterName: "Hoàng Văn Em",
      updaterRole: "Kỹ thuật viên",
      completionPercent: 100,
      status: "COMPLETED",
      note: "Cây trồng phát triển tốt, không phát hiện dấu hiệu sâu bệnh bất thường.",
      supplies: [
        {
          id: 4,
          name: "Phân hữu cơ vi sinh",
          plannedQty: "200",
          actualQty: "200",
          unit: "kg",
        },
      ],
    },
    historyLogs: [
      {
        id: "upd-0001-2",
        updatedAt: "2026-09-02T09:15:00Z",
        updaterName: "Hoàng Văn Em",
        updaterRole: "Kỹ thuật viên",
        completionPercent: 100,
        status: "COMPLETED",
        note: "Cây trồng phát triển tốt, không phát hiện dấu hiệu sâu bệnh bất thường.",
        supplies: [
          {
            id: 4,
            name: "Phân hữu cơ vi sinh",
            plannedQty: "200",
            actualQty: "200",
            unit: "kg",
          },
        ],
      },
      {
        id: "upd-0001-1",
        updatedAt: "2026-09-01T11:00:00Z",
        updaterName: "Lê Văn Cường",
        updaterRole: "Kỹ sư canh tác",
        completionPercent: 40,
        status: "DOING",
        note: "Khảo sát 3 lô canh tác A1, A2, A3. Phát hiện rải rác sâu cuốn lá nhỏ ở mép bờ.",
      },
    ],
  },
  {
    id: 103,
    taskCode: "CV-3301",
    taskName: "Kiểm thử tưới nước tự động - Sơ đồ A",
    origin: "PLANNED",
    workflowName: "WKF-0000033 - Sơ đồ A",
    workflowId: 33,
    planCode: "PLN-3301",
    planName: "Kế hoạch Canh tác - Sơ đồ A",
    planId: 3301,
    taskCategoryName: "Canh tác",
    latestUpdate: {
      id: "upd-3301-1",
      updatedAt: "2026-09-02T08:00:00Z",
      updaterName: "Nguyễn Văn An",
      updaterRole: "Kỹ thuật viên hệ thống",
      completionPercent: 60,
      status: "DOING",
      note: "Vận hành hệ thống béc phun tự động khu vực 123. Áp lực nước ổn định 2.5 bar.",
    },
    historyLogs: [
      {
        id: "upd-3301-1",
        updatedAt: "2026-09-02T08:00:00Z",
        updaterName: "Nguyễn Văn An",
        updaterRole: "Kỹ thuật viên hệ thống",
        completionPercent: 60,
        status: "DOING",
        note: "Vận hành hệ thống béc phun tự động khu vực 123. Áp lực nước ổn định 2.5 bar.",
      },
    ],
  },
  {
    id: 201,
    taskCode: "PS-0091",
    taskName: "Phát sinh: Xử lý bờ rào ngập nước đợt mưa lớn",
    origin: "AD_HOC",
    taskCategoryName: "Nâng cấp CSVC",
    latestUpdate: {
      id: "upd-adhoc-01",
      updatedAt: "2026-09-02T11:00:00Z",
      updaterName: "Trần Văn Bình",
      updaterRole: "Đội trưởng sản xuất",
      status: "COMPLETED",
      note: "Đã gia cố đoạn bờ rào 15m giáp kênh đào, khơi thông rãnh thoát nước.",
      supplies: [
        {
          id: 10,
          name: "Cọc gỗ tràm",
          actualQty: "20",
          unit: "cây",
        },
        {
          id: 11,
          name: "Bao tải cát",
          actualQty: "30",
          unit: "bao",
        },
      ],
    },
    historyLogs: [
      {
        id: "upd-adhoc-01",
        updatedAt: "2026-09-02T11:00:00Z",
        updaterName: "Trần Văn Bình",
        updaterRole: "Đội trưởng sản xuất",
        status: "COMPLETED",
        note: "Đã gia cố đoạn bờ rào 15m giáp kênh đào, khơi thông rãnh thoát nước.",
        supplies: [
          {
            id: 10,
            name: "Cọc gỗ tràm",
            actualQty: "20",
            unit: "cây",
          },
          {
            id: 11,
            name: "Bao tải cát",
            actualQty: "30",
            unit: "bao",
          },
        ],
      },
    ],
  },
  {
    id: 202,
    taskCode: "PS-0092",
    taskName: "Phát sinh: Phun xịt bọ trĩ lứa 2 vụ rau mầm",
    origin: "AD_HOC",
    taskCategoryName: "Điều trị",
    latestUpdate: {
      id: "upd-adhoc-02",
      updatedAt: "2026-09-01T16:20:00Z",
      updaterName: "Lê Văn Cường",
      updaterRole: "Kỹ sư canh tác",
      status: "COMPLETED",
      note: "Phun chế phẩm thảo mộc xịt bọ trĩ mật độ 3 con/lá tại nhà lưới B.",
      supplies: [
        {
          id: 12,
          name: "Chế phẩm thảo mộc Bio-01",
          actualQty: "2",
          unit: "lít",
        },
      ],
    },
    historyLogs: [
      {
        id: "upd-adhoc-02",
        updatedAt: "2026-09-01T16:20:00Z",
        updaterName: "Lê Văn Cường",
        updaterRole: "Kỹ sư canh tác",
        status: "COMPLETED",
        note: "Phun chế phẩm thảo mộc xịt bọ trĩ mật độ 3 con/lá tại nhà lưới B.",
        supplies: [
          {
            id: 12,
            name: "Chế phẩm thảo mộc Bio-01",
            actualQty: "2",
            unit: "lít",
          },
        ],
      },
    ],
  },
];
